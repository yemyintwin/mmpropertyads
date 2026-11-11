using System.Globalization;
using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace PropertyAds.Api;

public sealed class ListingsFunctions
{
    private static readonly ConcurrentDictionary<string, DateTimeOffset> LastViewAt = new();
    private static readonly ConcurrentDictionary<string, int> ViewCounts = new();
    private static readonly TimeSpan ViewThrottleWindow = TimeSpan.FromMinutes(1);
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly IReadOnlyList<Listing> _listings;

    public ListingsFunctions()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "SampleData", "listings.json");
        var json = File.ReadAllText(path);
        var fixtureListings = JsonSerializer.Deserialize<List<Listing>>(
            json,
            new JsonSerializerOptions(JsonSerializerDefaults.Web)) ?? [];
        var now = DateTimeOffset.UtcNow;
        _listings = fixtureListings.Select((listing, index) => listing with
        {
            Furnishing = listing.Furnishing ?? new[] { "Fully", "Partially", "Unfurnished" }[index % 3],
            Amenities = listing.Amenities ?? GetSampleAmenities(index),
            PostedAt = listing.PostedAt ?? now.AddDays(-(index % 30)).AddHours(-(index % 24)),
            ViewCount = listing.ViewCount
        }).ToArray();
    }

    [Function(nameof(SearchListings))]
    public async Task<HttpResponseData> SearchListings(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "listings")] HttpRequestData request)
    {
        var query = ParseQuery(request.Url.Query);
        var matching = _listings.Where(listing => Matches(listing, query)).ToList();

        var sort = Get(query, "sort");
        matching = sort switch
        {
            "price_asc" => matching.OrderBy(listing => listing.Price).ToList(),
            "price_desc" => matching.OrderByDescending(listing => listing.Price).ToList(),
            _ => matching
        };

        var page = ParsePositiveInt(query, "page", 1);
        var pageSize = Math.Clamp(ParsePositiveInt(query, "pageSize", 20), 1, 50);
        var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
        await WriteJsonAsync(response, new ListingSearchResponse(
            matching.Skip((page - 1) * pageSize).Take(pageSize).ToArray(),
            matching.Count,
            page,
            pageSize));
        return response;
    }

    [Function(nameof(GetAreas))]
    public async Task<HttpResponseData> GetAreas(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "areas")] HttpRequestData request)
    {
        var areas = _listings
            .Select(listing => listing.Location.Split(',', 2)[0].Trim())
            .Where(area => area.Length > 0)
            .GroupBy(area => area, StringComparer.OrdinalIgnoreCase)
            .Select(group => new AreaSummary(
                group.Key,
                ToSlug(group.Key),
                group.Count()))
            .OrderByDescending(area => area.ListingCount)
            .ThenBy(area => area.Name, StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
        await WriteJsonAsync(response, areas);
        return response;
    }

    [Function(nameof(GetLookups))]
    public async Task<HttpResponseData> GetLookups(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "lookups")] HttpRequestData request)
    {
        var lookups = new
        {
            propertyTypes = _listings
                .Select(listing => listing.PropertyType)
                .Where(type => !string.IsNullOrWhiteSpace(type))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(type => type, StringComparer.OrdinalIgnoreCase),
            amenities = _listings
                .SelectMany(listing => listing.Amenities ?? [])
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(amenity => amenity, StringComparer.OrdinalIgnoreCase),
            listingTypes = new[] { "ForSale", "ForRent" },
            furnishingOptions = new[] { "Unfurnished", "Partially", "Fully" }
        };
        var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
        await WriteJsonAsync(response, lookups);
        return response;
    }

    [Function(nameof(RecordListingView))]
    public async Task<HttpResponseData> RecordListingView(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "listings/{id}/view")] HttpRequestData request,
        string id)
    {
        if (!_listings.Any(listing => listing.Id.Equals(id, StringComparison.OrdinalIgnoreCase)))
        {
            return request.CreateResponse(System.Net.HttpStatusCode.NotFound);
        }

        var clientIp = request.Headers.TryGetValues("X-Forwarded-For", out var forwardedFor)
            ? forwardedFor.FirstOrDefault()?.Split(',')[0].Trim()
            : null;
        clientIp ??= request.Url.Host;
        var key = $"{id}:{clientIp}";
        var now = DateTimeOffset.UtcNow;
        if (LastViewAt.TryGetValue(key, out var previous) && now - previous < ViewThrottleWindow)
        {
            var limited = request.CreateResponse(System.Net.HttpStatusCode.TooManyRequests);
            await WriteJsonAsync(limited, new
            {
                type = "about:blank",
                title = "Too many view requests",
                status = (int)System.Net.HttpStatusCode.TooManyRequests,
                detail = "Wait before recording another view of this listing."
            });
            return limited;
        }

        LastViewAt[key] = now;
        var initialCount = _listings.First(listing =>
            listing.Id.Equals(id, StringComparison.OrdinalIgnoreCase)).ViewCount;
        ViewCounts.AddOrUpdate(id, initialCount + 1, (_, count) => count + 1);
        return request.CreateResponse(System.Net.HttpStatusCode.NoContent);
    }

    [Function(nameof(GetListing))]
    public async Task<HttpResponseData> GetListing(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "listings/{slug}")] HttpRequestData request,
        string slug)
    {
        if (slug.Equals("sitemap", StringComparison.OrdinalIgnoreCase))
        {
            var sitemapResponse = request.CreateResponse(System.Net.HttpStatusCode.OK);
            await WriteJsonAsync(sitemapResponse, GetListingSitemapItems());
            return sitemapResponse;
        }

        var listing = _listings.FirstOrDefault(item =>
            string.Equals(item.Slug, slug, StringComparison.OrdinalIgnoreCase));
        if (listing is null)
        {
            return request.CreateResponse(System.Net.HttpStatusCode.NotFound);
        }

        var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
        await WriteJsonAsync(response, listing with
        {
            ViewCount = ViewCounts.TryGetValue(listing.Id, out var viewCount)
                ? listing.ViewCount + viewCount
                : listing.ViewCount
        });
        return response;
    }

    [Function(nameof(GetSimilarListings))]
    public async Task<HttpResponseData> GetSimilarListings(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "listings/{id}/similar")] HttpRequestData request,
        string id)
    {
        var listing = _listings.FirstOrDefault(item =>
            string.Equals(item.Id, id, StringComparison.OrdinalIgnoreCase));
        if (listing is null)
        {
            return request.CreateResponse(System.Net.HttpStatusCode.NotFound);
        }

        var limit = Math.Clamp(ParsePositiveInt(ParseQuery(request.Url.Query), "limit", 3), 1, 20);
        var matches = _listings
            .Where(item => item.Id != listing.Id && item.ListingType == listing.ListingType)
            .OrderByDescending(item => item.PropertyType == listing.PropertyType)
            .ThenByDescending(item => item.Location.Split(',')[0].Trim().Equals(
                listing.Location.Split(',')[0].Trim(), StringComparison.OrdinalIgnoreCase))
            .Take(limit)
            .ToArray();

        var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
        await WriteJsonAsync(response, matches);
        return response;
    }

    [Function(nameof(Health))]
    public HttpResponseData Health(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health/live")] HttpRequestData request) =>
        request.CreateResponse(System.Net.HttpStatusCode.OK);

    private static bool Matches(Listing listing, IReadOnlyDictionary<string, string> query)
    {
        var type = Get(query, "type")?.ToLowerInvariant();
        var listingType = type switch
        {
            "rent" => "ForRent",
            "sale" or "buy" => "ForSale",
            _ => type
        };

        return
            (listingType is null || listing.ListingType.Equals(listingType, StringComparison.OrdinalIgnoreCase)) &&
            MatchesText(listing, Get(query, "q")) &&
            Contains(listing.Location, Get(query, "area")) &&
            EqualsIgnoreCase(listing.PropertyType, Get(query, "propertyType")) &&
            EqualsIgnoreCase(listing.Furnishing, Get(query, "furnishing")) &&
            MatchesAmenities(listing, Get(query, "amenities")) &&
            MatchesPostedWithin(listing, Get(query, "postedWithin")) &&
            AtLeast(listing.Price, query, "minPrice") &&
            AtMost(listing.Price, query, "maxPrice") &&
            AtLeast(listing.Bedrooms, query, "beds") &&
            AtLeast(listing.Bathrooms, query, "baths") &&
            AtLeast(listing.FloorArea, query, "minArea") &&
            AtMost(listing.FloorArea, query, "maxArea");
    }

    private static bool Contains(string value, string? filter) =>
        string.IsNullOrWhiteSpace(filter) || value.Contains(filter.Trim(), StringComparison.OrdinalIgnoreCase);

    private static bool MatchesText(Listing listing, string? query) =>
        string.IsNullOrWhiteSpace(query) ||
        Contains(listing.Title, query) ||
        Contains(listing.Location, query);

    private static bool EqualsIgnoreCase(string? value, string? filter) =>
        string.IsNullOrWhiteSpace(filter) || string.Equals(value, filter.Trim(), StringComparison.OrdinalIgnoreCase);

    private static bool MatchesAmenities(Listing listing, string? filter)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return true;
        }

        var requiredAmenities = filter.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var listingAmenities = listing.Amenities ?? [];
        return requiredAmenities.All(required =>
            listingAmenities.Contains(required, StringComparer.OrdinalIgnoreCase));
    }

    private static bool MatchesPostedWithin(Listing listing, string? filter)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return true;
        }

        var maxAge = filter.Trim().ToLowerInvariant() switch
        {
            "24h" => TimeSpan.FromHours(24),
            "7d" => TimeSpan.FromDays(7),
            "30d" => TimeSpan.FromDays(30),
            _ => (TimeSpan?)null
        };
        return maxAge is null ||
            (listing.PostedAt is not null && DateTimeOffset.UtcNow - listing.PostedAt.Value <= maxAge.Value);
    }

    private static IReadOnlyList<string> GetSampleAmenities(int index)
    {
        var allAmenities = new[] { "Parking", "Lift", "Pool", "Gym" };
        return allAmenities
            .Where((_, amenityIndex) => (index & (1 << amenityIndex)) != 0)
            .ToArray();
    }

    private static string ToSlug(string value) =>
        string.Join('-', value.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .ToLowerInvariant();

    private static async Task WriteJsonAsync(HttpResponseData response, object value)
    {
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await response.WriteStringAsync(JsonSerializer.Serialize(value, JsonOptions));
    }

    private IReadOnlyList<ListingSitemapItem> GetListingSitemapItems() =>
        _listings
            .OrderByDescending(listing => listing.PostedAt)
            .Select(listing => new ListingSitemapItem(listing.Slug, listing.PostedAt!.Value))
            .ToArray();

    private static bool AtLeast(decimal? value, IReadOnlyDictionary<string, string> query, string key) =>
        !query.TryGetValue(key, out var raw) ||
        (decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out var min) && value >= min);

    private static bool AtMost(decimal? value, IReadOnlyDictionary<string, string> query, string key) =>
        !query.TryGetValue(key, out var raw) ||
        (decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out var max) && value <= max);

    private static bool AtLeast(int? value, IReadOnlyDictionary<string, string> query, string key) =>
        !query.TryGetValue(key, out var raw) ||
        (int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var min) && value >= min);

    private static int ParsePositiveInt(IReadOnlyDictionary<string, string> query, string key, int fallback) =>
        query.TryGetValue(key, out var raw) &&
        int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value) &&
        value > 0
            ? value
            : fallback;

    private static string? Get(IReadOnlyDictionary<string, string> query, string key) =>
        query.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value) ? value : null;

    private static IReadOnlyDictionary<string, string> ParseQuery(string queryString) =>
        queryString.TrimStart('?')
            .Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Select(part => part.Split('=', 2))
            .GroupBy(parts => Uri.UnescapeDataString(parts[0].Replace('+', ' ')), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group =>
                    string.Join(',', group.Select(parts =>
                        parts.Length > 1 ? Uri.UnescapeDataString(parts[1].Replace('+', ' ')) : "")),
                StringComparer.OrdinalIgnoreCase);
}
