import type { CurrentUser, Listing, ListingSearchResponse } from "@/types/listing";
import {
  getSampleListing,
  getSampleSimilarListings,
  searchSampleListings,
} from "@/lib/sample-listings";

export type ApiResult<T> =
  | { ok: true; value: T }
  | { ok: false; status?: number; message: string };

function apiBaseUrl(): string | undefined {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  }

  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl?.replace(/\/$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isListing(value: unknown): value is Listing {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    typeof value.currency === "string" &&
    /^[A-Z]{3}$/.test(value.currency) &&
    typeof value.location === "string" &&
    (value.imageUrl === undefined || typeof value.imageUrl === "string") &&
    (value.imageUrls === undefined ||
      (Array.isArray(value.imageUrls) &&
        value.imageUrls.every((imageUrl) => typeof imageUrl === "string"))) &&
    (value.isFavourite === undefined || typeof value.isFavourite === "boolean") &&
    (value.bedrooms === undefined || typeof value.bedrooms === "number") &&
    (value.bathrooms === undefined || typeof value.bathrooms === "number") &&
    (value.floorArea === undefined || typeof value.floorArea === "number") &&
    (value.description === undefined || typeof value.description === "string") &&
    (value.propertyType === undefined || typeof value.propertyType === "string") &&
    (value.listingType === undefined ||
      value.listingType === "ForSale" ||
      value.listingType === "ForRent")
  );
}

export function isSearchResponse(
  value: unknown,
): value is ListingSearchResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isListing) &&
    typeof value.totalCount === "number" &&
    typeof value.page === "number" &&
    typeof value.pageSize === "number"
  );
}

export async function requestJson(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<unknown>> {
  const method = (options.method ?? "GET").toUpperCase();
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);
  const requestHeaders = new Headers(options.headers);

  if (isMutation && typeof window !== "undefined") {
    const csrfCookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("XSRF-TOKEN="));
    if (!csrfCookie) {
      return {
        ok: false,
        message: "Security token unavailable. Reload the page and try again.",
      };
    }

    try {
      requestHeaders.set(
        "X-XSRF-TOKEN",
        decodeURIComponent(csrfCookie.slice("XSRF-TOKEN=".length)),
      );
    } catch (error) {
      if (!(error instanceof URIError)) throw error;
      return {
        ok: false,
        message: "Security token invalid. Reload the page and try again.",
      };
    }
  }

  let response: Response;
  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return {
      ok: false,
      message: "The API base URL is not configured.",
    };
  }

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: new Headers({
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...Object.fromEntries(requestHeaders.entries()),
      }),
      cache: "no-store",
    });
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    return {
      ok: false,
      message: "The service is unavailable. Please try again later.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message:
        response.status === 401
          ? "Please sign in to continue."
          : `The request could not be completed (HTTP ${response.status}).`,
    };
  }

  if (response.status === 204) {
    return { ok: true, value: null };
  }

  try {
    const body: unknown = await response.json();
    return { ok: true, value: body };
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return {
      ok: false,
      status: response.status,
      message: "The service returned an invalid response.",
    };
  }
}

export async function searchListings(
  params: URLSearchParams,
): Promise<ApiResult<ListingSearchResponse>> {
  if (!apiBaseUrl()) {
    return { ok: true, value: searchSampleListings(params) };
  }

  const query = params.toString();
  const result = await requestJson(
    `/api/listings${query ? `?${query}` : ""}`,
  );

  if (!result.ok) return result;
  return isSearchResponse(result.value)
    ? { ok: true, value: result.value }
    : {
        ok: false,
        message: "The listings service returned data in an unsupported format.",
      };
}

export async function getListing(slug: string): Promise<ApiResult<Listing>> {
  if (!apiBaseUrl()) {
    const listing = getSampleListing(slug);
    return listing
      ? { ok: true, value: listing }
      : { ok: false, status: 404, message: "The requested listing was not found." };
  }

  const result = await requestJson(
    `/api/listings/${encodeURIComponent(slug)}`,
  );

  if (!result.ok) return result;
  return isListing(result.value)
    ? { ok: true, value: result.value }
    : {
        ok: false,
        message: "The listing service returned data in an unsupported format.",
      };
}

export async function getSimilarListings(
      listing: Listing,
      limit = 3,
): Promise<ApiResult<Listing[]>> {
      if (!apiBaseUrl()) {
        return { ok: true, value: getSampleSimilarListings(listing, limit) };
      }

      const result = await requestJson(
        `/api/listings/${encodeURIComponent(listing.id)}/similar`,
      );
      if (!result.ok) return result;

      const value = Array.isArray(result.value)
        ? result.value
        : isRecord(result.value) && Array.isArray(result.value.items)
          ? result.value.items
          : undefined;

      if (!value || !value.every(isListing)) {
        return {
          ok: false,
          message: "The similar listings service returned data in an unsupported format.",
        };
      }

      return {
        ok: true,
        value: value
          .filter((candidate) => candidate.id !== listing.id)
          .slice(0, limit),
      };
}

export async function submitJson(
  path: string,
  body: unknown,
): Promise<ApiResult<unknown>> {
  return mutateJson(path, "POST", body);
}

export async function mutateJson(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<ApiResult<unknown>> {
  return requestJson(path, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

export function isCurrentUser(value: unknown): value is CurrentUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.displayName === "string" &&
    typeof value.email === "string"
  );
}
