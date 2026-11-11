import forRent from "@/data/listings-for-rent.json";
import forSale from "@/data/listings-for-sale.json";
import type { Listing, ListingSearchResponse } from "@/types/listing";

const sampleListings: Listing[] = [
  ...forSale.map(
    (listing): Listing => ({ ...listing, listingType: "ForSale" }),
  ),
  ...forRent.map(
    (listing): Listing => ({ ...listing, listingType: "ForRent" }),
  ),
];

function matchesSearch(listing: Listing, params: URLSearchParams): boolean {
  const type = params.get("type")?.toLowerCase();
  const listingType =
    type === "rent" ? "forrent" : type === "sale" || type === "buy" ? "forsale" : type;
  const area = params.get("area")?.trim().toLowerCase();
  const propertyType = params.get("propertyType")?.trim().toLowerCase();
  const minPrice = Number(params.get("minPrice"));
  const maxPrice = Number(params.get("maxPrice"));
  const bedrooms = Number(params.get("beds"));
  const bathrooms = Number(params.get("baths"));
  const minArea = Number(params.get("minArea"));
  const maxArea = Number(params.get("maxArea"));

  return (
    (!listingType || listing.listingType?.toLowerCase() === listingType) &&
    (!area || listing.location.toLowerCase().includes(area) || listing.title.toLowerCase().includes(area)) &&
    (!propertyType || listing.propertyType?.toLowerCase() === propertyType) &&
    (!params.has("minPrice") || (Number.isFinite(minPrice) && listing.price >= minPrice)) &&
    (!params.has("maxPrice") || (Number.isFinite(maxPrice) && listing.price <= maxPrice)) &&
    (!params.has("beds") || (Number.isFinite(bedrooms) && (listing.bedrooms ?? 0) >= bedrooms)) &&
    (!params.has("baths") || (Number.isFinite(bathrooms) && (listing.bathrooms ?? 0) >= bathrooms)) &&
    (!params.has("minArea") || (Number.isFinite(minArea) && (listing.floorArea ?? 0) >= minArea)) &&
    (!params.has("maxArea") || (Number.isFinite(maxArea) && (listing.floorArea ?? 0) <= maxArea))
  );
}

export function searchSampleListings(params: URLSearchParams): ListingSearchResponse {
  const matchingListings = sampleListings.filter((listing) =>
    matchesSearch(listing, params),
  );
  const sort = params.get("sort");
  if (sort === "price_asc") {
    matchingListings.sort((first, second) => first.price - second.price);
  } else if (sort === "price_desc") {
    matchingListings.sort((first, second) => second.price - first.price);
  }
  const requestedPage = Number(params.get("page") ?? 1);
  const requestedPageSize = Number(params.get("pageSize") ?? 20);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize =
    Number.isInteger(requestedPageSize) && requestedPageSize > 0
      ? Math.min(requestedPageSize, 100)
      : 20;
  const start = (page - 1) * pageSize;

  return {
    items: matchingListings.slice(start, start + pageSize),
    totalCount: matchingListings.length,
    page,
    pageSize,
  };
}

export function getSampleListing(slug: string): Listing | undefined {
  return sampleListings.find((listing) => listing.slug === slug);
}

export function getSampleSimilarListings(
  listing: Listing,
  limit = 3,
): Listing[] {
  const area = listing.location.split(",")[0]?.trim().toLowerCase();
  return sampleListings
    .filter(
      (candidate) =>
        candidate.id !== listing.id &&
        candidate.listingType === listing.listingType,
    )
    .sort((first, second) => {
      const score = (candidate: Listing) =>
        Number(candidate.location.toLowerCase().includes(area ?? "")) * 2 +
        Number(candidate.propertyType === listing.propertyType);
      return score(second) - score(first);
    })
    .slice(0, limit);
}
