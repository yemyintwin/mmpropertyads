export interface Listing {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  imageUrl?: string;
  imageUrls?: string[];
  isFavourite?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  description?: string;
  propertyType?: string;
  listingType?: "ForSale" | "ForRent";
}

export interface ListingSearchResponse {
  items: Listing[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CurrentUser {
  id: string;
  displayName: string;
  email: string;
}
