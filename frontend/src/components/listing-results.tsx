import { searchListings } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import Link from "next/link";
import { SearchSortSelect } from "@/components/search-sort-select";
import { SearchHiddenFields } from "@/components/search-hidden-fields";

export async function ListingResults({
  params,
  layout = "standard",
}: {
  params: URLSearchParams;
  layout?: "standard" | "search";
}) {
  const result = await searchListings(params);

  if (layout === "search") {
    return <SearchResultsLayout params={params} result={result} />;
  }

  if (!result.ok) {
    return (
      <div className="notice notice-error" role="status">
        <h2>Listings are unavailable</h2>
        <p>{result.message}</p>
        <a href="/search">Try again</a>
      </div>
    );
  }

  function SearchResultsLayout({
    params,
    result,
  }: {
    params: URLSearchParams;
    result: Awaited<ReturnType<typeof searchListings>>;
  }) {
    const listingType = params.get("type");
    const title =
      listingType === "ForSale"
        ? "Homes for sale"
        : listingType === "ForRent"
          ? "Homes for rent"
          : "Homes to buy or rent";

    return (
      <>
        <header className="results-heading">
          <div>
            <span className="eyebrow results-eyebrow">Properties near you</span>
            <h1>{title}</h1>
            {result.ok && (
              <p>{result.value.totalCount} properties found</p>
            )}
          </div>
          <div className="result-actions">
            <span aria-label="Grid view" className="view-btn active">
              <span aria-hidden="true" className="grid-glyph">▦</span>
            </span>
            <button
              aria-label="Map view is planned"
              className="view-btn map-view-button"
              disabled
              title="Map search is planned"
              type="button"
            >
              Map
            </button>
            <form action="/search" className="sort-form">
              <SearchHiddenFields omit={["sort"]} params={params} />
              <SearchSortSelect value={params.get("sort") ?? "newest"} />
            </form>
          </div>
        </header>

        <div className="mobile-filter-bar">
          <details className="filters mobile-filters">
            <summary>Filters</summary>
            <SearchFilterForm params={params} />
          </details>
          <form action="/search" className="mobile-sort-form">
            <SearchHiddenFields omit={["sort"]} params={params} />
            <SearchSortSelect value={params.get("sort") ?? "newest"} />
          </form>
        </div>

        <div className="results-layout">
          <aside className="filters desktop-filters" aria-label="Property filters">
            <div className="filter-title">
              <h2>Filters</h2>
              <Link href="/search">Clear all</Link>
            </div>
            <SearchFilterForm params={params} />
          </aside>
          <section aria-live="polite" className="result-content">
            <ActiveFilters params={params} />
            {!result.ok ? (
              <div className="notice notice-error" role="status">
                <h2>Listings are unavailable</h2>
                <p>{result.message}</p>
                <a href="/search">Try again</a>
              </div>
            ) : result.value.items.length === 0 ? (
              <div className="notice">
                <h2>No homes match this search</h2>
                <p>Try changing or clearing some of your filters.</p>
                <a href="/search">Clear filters</a>
              </div>
            ) : (
              <>
                <div className="listing-grid results-listing-grid">
                  {result.value.items.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <nav aria-label="Search result pages" className="pagination">
                  {result.value.page > 1 ? (
                    <a href={pageHref(params, result.value.page - 1)}>Previous</a>
                  ) : <span />}
                  <span>Page {result.value.page} of {Math.max(1, Math.ceil(result.value.totalCount / result.value.pageSize))}</span>
                  {result.value.page * result.value.pageSize < result.value.totalCount ? (
                    <a href={pageHref(params, result.value.page + 1)}>Next</a>
                  ) : <span />}
                </nav>
              </>
            )}
          </section>
        </div>
      </>
    );
  }

  function SearchFilterForm({ params }: { params: URLSearchParams }) {
    return (
      <form action="/search" className="filter-form">
        <SearchHiddenFields
          omit={["propertyType", "minPrice", "maxPrice", "beds", "baths", "minArea", "maxArea"]}
          params={params}
        />
        <fieldset className="filter-group">
          <legend>Price range</legend>
          <div className="filter-price-fields">
            <input aria-label="Minimum price" defaultValue={params.get("minPrice") ?? ""} min="0" name="minPrice" placeholder="Min price" type="number" />
            <input aria-label="Maximum price" defaultValue={params.get("maxPrice") ?? ""} min="0" name="maxPrice" placeholder="Max price" type="number" />
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Property type</legend>
          <div className="filter-chips">
            {["", "Condo", "Apartment", "House", "Townhouse"].map((type) => (
              <label className="filter-chip" key={type || "all"}>
                <input
                  defaultChecked={(params.get("propertyType") ?? "") === type}
                  name="propertyType"
                  type="radio"
                  value={type}
                />
                <span>{type || "All"}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Bedrooms</legend>
          <div className="filter-chips filter-chips-row">
            {["", "1", "2", "3", "4"].map((beds) => (
              <label className="filter-chip" key={beds || "any"}>
                <input
                  defaultChecked={(params.get("beds") ?? "") === beds}
                  name="beds"
                  type="radio"
                  value={beds}
                />
                <span>{beds === "" ? "Any" : beds === "4" ? "4+" : beds}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Bathrooms</legend>
          <div className="filter-chips filter-chips-row">
            {["", "1", "2", "3"].map((baths) => (
              <label className="filter-chip" key={baths || "any"}>
                <input
                  defaultChecked={(params.get("baths") ?? "") === baths}
                  name="baths"
                  type="radio"
                  value={baths}
                />
                <span>{baths === "" ? "Any" : `${baths}+`}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Floor area</legend>
          <div className="filter-price-fields">
            <input aria-label="Minimum floor area in square feet" defaultValue={params.get("minArea") ?? ""} min="0" name="minArea" placeholder="Min sq ft" type="number" />
            <input aria-label="Maximum floor area in square feet" defaultValue={params.get("maxArea") ?? ""} min="0" name="maxArea" placeholder="Max sq ft" type="number" />
          </div>
        </fieldset>
        <button className="button button-primary filter-apply" type="submit">Apply filters</button>
      </form>
    );
  }

  function ActiveFilters({ params }: { params: URLSearchParams }) {
    const filters = [
      ["type", params.get("type") === "ForSale" ? "For sale" : params.get("type") === "ForRent" ? "For rent" : ""],
      ["area", params.get("area")],
      ["propertyType", params.get("propertyType")],
      ["minPrice", params.get("minPrice") ? `Min ${params.get("minPrice")}` : ""],
      ["maxPrice", params.get("maxPrice") ? `Max ${params.get("maxPrice")}` : ""],
      ["beds", params.get("beds") ? `${params.get("beds")}+ bedrooms` : ""],
      ["baths", params.get("baths") ? `${params.get("baths")}+ bathrooms` : ""],
      ["minArea", params.get("minArea") ? `Min ${params.get("minArea")} sq ft` : ""],
      ["maxArea", params.get("maxArea") ? `Max ${params.get("maxArea")} sq ft` : ""],
    ].filter((filter): filter is [string, string] => Boolean(filter[1]));

    if (filters.length === 0) return null;

    return (
      <div aria-label="Active filters" className="active-filters">
        {filters.map(([name, label]) => (
          <span className="active-filter" key={name}>
            <Link aria-label={`Remove ${label} filter`} href={withoutParam(params, name)}>{label}</Link>
            <Link aria-label={`Remove ${label} filter`} href={withoutParam(params, name)}>×</Link>
          </span>
        ))}
        <Link className="clear-filters-link" href="/search">Clear all</Link>
      </div>
    );
  }

  function withoutParam(params: URLSearchParams, name: string) {
    const next = new URLSearchParams(params);
    next.delete(name);
    next.delete("page");
    return `/search${next.size ? `?${next.toString()}` : ""}`;
  }

  function pageHref(params: URLSearchParams, page: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    return `/search?${next.toString()}`;
  }

  if (result.value.items.length === 0) {
    return (
      <div className="notice">
        <h2>No homes match this search</h2>
        <p>Try changing or clearing some of your filters.</p>
        <a href="/search">Clear filters</a>
      </div>
    );
  }

  return (
    <>
      <p className="result-count">{result.value.totalCount} homes found</p>
      <div className="listing-grid">
        {result.value.items.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <nav aria-label="Search result pages" className="pagination">
        {result.value.page > 1 && (
          <a
            href={`/search?${new URLSearchParams({
              ...Object.fromEntries(params),
              page: String(result.value.page - 1),
            })}`}
          >
            Previous
          </a>
        )}
        {result.value.page * result.value.pageSize < result.value.totalCount && (
          <a
            href={`/search?${new URLSearchParams({
              ...Object.fromEntries(params),
              page: String(result.value.page + 1),
            })}`}
          >
            Next
          </a>
        )}
      </nav>
    </>
  );
}
