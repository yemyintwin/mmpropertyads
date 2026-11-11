import type { Metadata } from "next";
import Link from "next/link";
import { ListingResults } from "@/components/listing-results";
import { SearchHiddenFields } from "@/components/search-hidden-fields";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const values = await searchParams;
  const hasFilters = Object.entries(values).some(
    ([key, value]) => key !== "page" && key !== "pageSize" && value !== undefined,
  );
  return {
    title: "Search homes",
    alternates: { canonical: "/search" },
    robots: { index: !hasFilters, follow: true },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  if (!params.has("pageSize")) params.set("pageSize", "20");

  return (
    <main className="page-shell results-page-shell">
      <section aria-label="Quick property search" className="results-search">
        <form action="/search" className="search-form results-search-form">
          <SearchHiddenFields
            omit={["area", "type", "propertyType", "minPrice", "maxPrice", "beds"]}
            params={params}
          />
          <label className="field results-location">
            <span className="field-label">Location</span>
            <input autoComplete="address-level2" defaultValue={params.get("area") ?? ""} name="area" placeholder="Where do you want to live?" />
          </label>
          <label className="field">
            <span className="field-label">Listing type</span>
            <select defaultValue={params.get("type") ?? ""} name="type">
              <option value="">Buy or rent</option>
              <option value="ForSale">For sale</option>
              <option value="ForRent">For rent</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Property type</span>
            <select defaultValue={params.get("propertyType") ?? ""} name="propertyType">
              <option value="">All homes</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </label>
          <div className="field">
            <span className="field-label">Price range</span>
            <div className="quick-price-fields">
              <input aria-label="Minimum price" defaultValue={params.get("minPrice") ?? ""} min="0" name="minPrice" placeholder="Min" type="number" />
              <input aria-label="Maximum price" defaultValue={params.get("maxPrice") ?? ""} min="0" name="maxPrice" placeholder="Max" type="number" />
            </div>
          </div>
          <label className="field">
            <span className="field-label">Bedrooms</span>
            <select defaultValue={params.get("beds") ?? ""} name="beds">
              <option value="">Any beds</option>
              <option value="1">1+ beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
            </select>
          </label>
          <button aria-label="Search properties" className="button button-primary results-search-submit" type="submit">Search</button>
        </form>
      </section>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <span>{params.get("type") === "ForRent" ? "Properties for rent" : params.get("type") === "ForSale" ? "Properties for sale" : "Properties"}</span>
      </nav>
      <ListingResults layout="search" params={params} />
    </main>
  );
}
