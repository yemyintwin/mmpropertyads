import { ListingCard } from "@/components/listing-card";
import { getSimilarListings } from "@/lib/api";
import type { Listing } from "@/types/listing";

export async function SimilarListings({ listing }: { listing: Listing }) {
  const result = await getSimilarListings(listing, 3);

  return (
    <section aria-labelledby="similar-listings-heading" className="similar-listings">
      <span className="eyebrow similar-listings-eyebrow">You may also like</span>
      <h2 id="similar-listings-heading">Similar homes nearby</h2>
      {!result.ok ? (
        <p className="similar-listings-message" role="status">{result.message}</p>
      ) : result.value.length === 0 ? (
        <p className="similar-listings-message">There are no similar homes available right now.</p>
      ) : (
        <div className="listing-grid similar-listings-grid">
          {result.value.map((similarListing) => (
            <ListingCard key={similarListing.id} listing={similarListing} />
          ))}
        </div>
      )}
    </section>
  );
}
