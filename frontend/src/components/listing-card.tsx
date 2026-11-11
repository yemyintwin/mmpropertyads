import Link from "next/link";
import type { Listing } from "@/types/listing";
import { FavouriteButton } from "@/components/favourite-button";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="listing-card">
      <Link
        aria-label={`View ${listing.title}`}
        className="listing-photo"
        href={`/listings/${encodeURIComponent(listing.slug)}`}
      >
        {listing.imageUrl ? (
          // Listing image URLs come from the listing API and may use a CDN host.
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" height={780} loading="lazy" src={listing.imageUrl} width={1200} />
        ) : (
          <span className="photo-placeholder">Photo unavailable</span>
        )}
        {listing.listingType && (
          <span className="listing-type-badge">
            {listing.listingType === "ForRent" ? "For rent" : "For sale"}
          </span>
        )}
      </Link>
      <FavouriteButton
        initialSaved={listing.isFavourite ?? false}
        listingId={listing.id}
        slug={listing.slug}
      />
      <div className="listing-card-copy">
        <p className="listing-price">
          {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: listing.currency,
            maximumFractionDigits: 0,
          }).format(listing.price)}
        </p>
        <h2>
          <Link href={`/listings/${encodeURIComponent(listing.slug)}`}>
            {listing.title}
          </Link>
        </h2>
        <p className="muted">{listing.location}</p>
        <ul className="listing-facts" aria-label="Property details">
          {listing.bedrooms !== undefined && <li>{listing.bedrooms} beds</li>}
          {listing.bathrooms !== undefined && <li>{listing.bathrooms} baths</li>}
          {listing.floorArea !== undefined && <li>{listing.floorArea} sq ft</li>}
        </ul>
      </div>
    </article>
  );
}
