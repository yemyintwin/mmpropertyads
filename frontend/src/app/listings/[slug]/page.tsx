import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/api";
import { ListingActions } from "@/components/listing-actions";
import { FavouriteButton } from "@/components/favourite-button";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ShareListingButton } from "@/components/share-listing-button";
import { SimilarListings } from "@/components/similar-listings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getListing(slug);
  return result.ok
    ? {
        title: result.value.title,
        description: `${result.value.title} in ${result.value.location}`,
        alternates: { canonical: `/listings/${encodeURIComponent(slug)}` },
        openGraph: {
          title: result.value.title,
          description: `${result.value.title} in ${result.value.location}`,
          images:
            result.value.imageUrls?.length
              ? result.value.imageUrls
              : result.value.imageUrl
                ? [result.value.imageUrl]
                : undefined,
        },
      }
    : { title: "Property listing" };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getListing(slug);
  if (!result.ok && result.status === 404) notFound();

  if (!result.ok) {
    return (
      <main className="page-shell">
        <div className="notice notice-error" role="status">
          <h1>Listing unavailable</h1>
          <p>{result.message}</p>
          <Link href="/search">Return to search</Link>
        </div>
      </main>
    );
  }

  const listing = result.value;
  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  }/listings/${encodeURIComponent(listing.slug)}`;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    url: canonicalUrl,
    address: listing.location,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: listing.currency,
    },
  }).replace(/</g, "\\u003c");
  const price = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: listing.currency,
    maximumFractionDigits: 0,
  }).format(listing.price);
  const propertyArea = listing.location.split(",")[0]?.trim() || listing.location;
  const searchHref =
    listing.listingType === "ForRent"
      ? "/search?type=ForRent"
      : listing.listingType === "ForSale"
        ? "/search?type=ForSale"
        : "/search";
  const facts = [
    listing.bedrooms !== undefined
      ? { icon: "bed" as const, value: String(listing.bedrooms), label: "Bedrooms" }
      : null,
    listing.bathrooms !== undefined
      ? { icon: "bath" as const, value: String(listing.bathrooms), label: "Bathrooms" }
      : null,
    listing.floorArea !== undefined
      ? { icon: "area" as const, value: listing.floorArea.toLocaleString(), label: "sq ft" }
      : null,
    listing.propertyType
      ? { icon: "home" as const, value: listing.propertyType, label: "Property type" }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <main className="page-shell detail-page">
      <script
        dangerouslySetInnerHTML={{ __html: structuredData }}
        type="application/ld+json"
      />
      <nav aria-label="Breadcrumb" className="detail-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link href={searchHref}>{listing.listingType === "ForRent" ? "For rent" : "For sale"}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{propertyArea}</span>
      </nav>
      <ListingPhotoGallery
        imageUrl={listing.imageUrl}
        imageUrls={listing.imageUrls}
        title={listing.title}
      />
      <div className="detail-body">
        <section aria-label="Property overview" className="detail-summary">
          <header className="detail-title">
            <div className="detail-title-copy">
              <span className="detail-listing-type">
                {listing.listingType === "ForRent"
                  ? "For rent"
                  : listing.listingType === "ForSale"
                    ? "For sale"
                    : "Property"}
              </span>
              <h1>{listing.title}</h1>
              <p className="detail-location">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {listing.location}
              </p>
            </div>
            <div aria-label="Listing actions" className="detail-actions">
              <ShareListingButton />
              <FavouriteButton
                initialSaved={listing.isFavourite ?? false}
                listingId={listing.id}
                slug={listing.slug}
              />
            </div>
          </header>
          {facts.length > 0 && (
            <ul aria-label="Property details" className="detail-facts">
              {facts.map((fact) => (
                <li key={fact.label}>
                  <DetailFactIcon type={fact.icon} />
                  <span>
                    <strong>{fact.value}</strong>
                    <small>{fact.label}</small>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside aria-label="Property price and contact" className="detail-sidebar">
          <div className="detail-price-card">
            <span className="detail-price-label">
              {listing.listingType === "ForRent" ? "Monthly rent" : "Asking price"}
            </span>
            <p className="detail-price">
              {price}
              {listing.listingType === "ForRent" && <span> / month</span>}
            </p>
            {listing.floorArea !== undefined && (
              <p className="detail-price-per-area">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: listing.currency,
                  maximumFractionDigits: 0,
                }).format(Math.round(listing.price / listing.floorArea))} per sq ft
              </p>
            )}
            <ListingActions listingId={listing.id} slug={listing.slug} />
          </div>
        </aside>
        <article className="detail-content">
          <section className="detail-section">
            <h2>About this home</h2>
            <p>{listing.description ?? "Description not available."}</p>
          </section>
          <section className="detail-section">
            <h2>Property details</h2>
            <dl className="detail-property-list">
              {listing.propertyType && (
                <div><dt>Property type</dt><dd>{listing.propertyType}</dd></div>
              )}
              {listing.bedrooms !== undefined && (
                <div><dt>Bedrooms</dt><dd>{listing.bedrooms}</dd></div>
              )}
              {listing.bathrooms !== undefined && (
                <div><dt>Bathrooms</dt><dd>{listing.bathrooms}</dd></div>
              )}
              {listing.floorArea !== undefined && (
                <div><dt>Floor area</dt><dd>{listing.floorArea.toLocaleString()} sq ft</dd></div>
              )}
            </dl>
          </section>
          <section aria-labelledby="property-location-heading" className="detail-section detail-location-section">
            <h2 id="property-location-heading">Location</h2>
            <p className="detail-location-address">{listing.location}</p>
            <div className="property-map">
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(listing.location)}&z=14&output=embed`}
                title={`Google Map showing ${listing.location}`}
              />
            </div>
            <a
              className="property-map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`}
              rel="noreferrer"
              target="_blank"
            >
              Open in Google Maps
            </a>
          </section>
        </article>
      </div>
      <SimilarListings listing={listing} />
    </main>
  );
}

function DetailFactIcon({ type }: { type: "bed" | "bath" | "area" | "home" }) {
  const paths = {
    bed: <><path d="M3 19v-8m18 8v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h18" /><path d="M7 11V7h5a2 2 0 0 1 2 2v2" /></>,
    bath: <><path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2Z" /><path d="M7 12V6a3 3 0 0 1 6 0" /></>,
    area: <><path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5" /><path d="m3 8 5-5m8 0 5 5M3 16l5 5m8 0 5-5" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  };

  return (
    <svg aria-hidden="true" className="detail-fact-icon" fill="none" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}
