namespace PropertyAds.Api;

public sealed record Listing(
    string Id,
    string Slug,
    string Title,
    decimal Price,
    string Currency,
    string Location,
    string? ImageUrl,
    int? Bedrooms,
    int? Bathrooms,
    decimal? FloorArea,
    string? Description,
    string? PropertyType,
    string ListingType,
    string? Furnishing = null,
    IReadOnlyList<string>? Amenities = null,
    DateTimeOffset? PostedAt = null,
    int ViewCount = 0);

public sealed record ListingSearchResponse(
    IReadOnlyList<Listing> Items,
    int TotalCount,
    int Page,
    int PageSize);

public sealed record ListingSitemapItem(string Slug, DateTimeOffset LastModified);

public sealed record AreaSummary(string Name, string Slug, int ListingCount);
