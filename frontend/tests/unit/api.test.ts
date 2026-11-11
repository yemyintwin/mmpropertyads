import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getListing,
  getSimilarListings,
  searchListings,
  submitJson,
} from "@/lib/api";
import type { Listing } from "@/types/listing";

describe("searchListings", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("API_BASE_URL", "http://localhost:5080");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:5080");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("accepts a response matching the frontend listing contract", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              id: "listing-1",
              slug: "home-1",
              title: "Home",
              price: 250000,
              currency: "USD",
              location: "Bahan",
              imageUrls: ["/images/cover.jpg", "/images/living-room.jpg"],
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 20,
        }),
        { status: 200 },
      ),
    );

    const result = await searchListings(new URLSearchParams({ beds: "2" }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items[0]?.imageUrls).toEqual([
        "/images/cover.jpg",
        "/images/living-room.jpg",
      ]);
    }
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/listings?beds=2"),
      expect.objectContaining({ credentials: "include", cache: "no-store" }),
    );
  });

  it("reports an unsupported response shape instead of treating it as empty results", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ items: [] }), { status: 200 }),
    );

    const result = await searchListings(new URLSearchParams());

    expect(result).toEqual({
      ok: false,
      message: "The listings service returned data in an unsupported format.",
    });
  });

  it("falls back to sample listings when the configured API is unavailable", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"));

    const result = await searchListings(new URLSearchParams({ type: "ForRent" }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalCount).toBe(20);
      expect(result.value.items).toHaveLength(20);
      expect(result.value.items.every((listing) => listing.listingType === "ForRent")).toBe(true);
    }
  });

  it("loads sample rentals when the API is not configured", async () => {
    vi.stubEnv("API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");

    const result = await searchListings(new URLSearchParams({ type: "ForRent" }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalCount).toBe(20);
      expect(result.value.items).toHaveLength(20);
      expect(result.value.items.every((listing) => listing.listingType === "ForRent")).toBe(true);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("filters and paginates sample listings when no API is configured", async () => {
    vi.stubEnv("API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");

    const result = await searchListings(
      new URLSearchParams({ type: "ForSale", area: "Bahan", pageSize: "5" }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalCount).toBe(1);
      expect(result.value.items[0]?.slug).toBe("bahan-family-villa");
      expect(result.value.pageSize).toBe(5);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("applies bathroom, floor area, and price sorting to sample listings", async () => {
    vi.stubEnv("API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");

    const result = await searchListings(
      new URLSearchParams({
        type: "ForSale",
        baths: "3",
        minArea: "2000",
        sort: "price_asc",
      }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalCount).toBeGreaterThan(0);
      expect(result.value.items.every(
        (listing) => (listing.bathrooms ?? 0) >= 3 && (listing.floorArea ?? 0) >= 2000,
      )).toBe(true);
      expect(result.value.items[0]?.price).toBeLessThanOrEqual(
        result.value.items[result.value.items.length - 1]?.price ?? 0,
      );
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads sample listing details by slug when the API is not configured", async () => {
    vi.stubEnv("API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");

    const result = await getListing("bahan-family-villa");

    expect(result).toMatchObject({
      ok: true,
      value: {
        slug: "bahan-family-villa",
        listingType: "ForSale",
      },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads nearby sample listings of the same listing type", async () => {
    vi.stubEnv("API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const listing: Listing = {
      id: "sample-sale-01",
      slug: "bahan-family-villa",
      title: "Bright family villa with garden",
      price: 1250000000,
      currency: "MMK",
      location: "Bahan, Yangon",
      listingType: "ForSale",
      propertyType: "House",
    };

    const result = await getSimilarListings(listing);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(3);
      expect(result.value.every(
        (candidate) =>
          candidate.id !== listing.id && candidate.listingType === "ForSale",
      )).toBe(true);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads similar listings from the documented API endpoint", async () => {
    const listing: Listing = {
      id: "listing-1",
      slug: "home-1",
      title: "Home",
      price: 250000,
      currency: "USD",
      location: "Bahan",
    };
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              id: "listing-2",
              slug: "home-2",
              title: "Similar home",
              price: 275000,
              currency: "USD",
              location: "Bahan",
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const result = await getSimilarListings(listing);

    expect(result).toMatchObject({
      ok: true,
      value: [{ id: "listing-2", title: "Similar home" }],
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/listings/listing-1/similar"),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("does not send a mutation without an antiforgery token", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "" });

    const result = await submitJson("/api/auth/login", {
      email: "person@example.com",
      password: "example-password",
    });

    expect(result).toEqual({
      ok: false,
      message: "Security token unavailable. Reload the page and try again.",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends the antiforgery token header on mutations", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "XSRF-TOKEN=token%3Dvalue" });
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

    const result = await submitJson("/api/auth/login", {
      email: "person@example.com",
      password: "example-password",
    });
    const options = vi.mocked(fetch).mock.calls[0]?.[1];

    expect(result.ok).toBe(true);
    expect(new Headers(options?.headers).get("X-XSRF-TOKEN")).toBe("token=value");
  });
});
