"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutateJson } from "@/lib/api";

export function FavouriteButton({
  initialSaved,
  listingId,
  slug,
}: {
  initialSaved: boolean;
  listingId: string;
  slug: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function toggleFavourite() {
    const nextSaved = !saved;
    setSaved(nextSaved);
    setPending(true);
    setMessage("");
    const result = await mutateJson(
      `/api/my/favourites/${encodeURIComponent(listingId)}`,
      nextSaved ? "PUT" : "DELETE",
    );
    setPending(false);
    if (result.ok) return;

    setSaved(!nextSaved);
    if (result.status === 401) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(`/listings/${slug}`)}`,
      );
      return;
    }

    setMessage(result.message);
  }

  return (
    <div className="favourite-control">
      <button
        aria-label={saved ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={saved}
        className={`favourite-button${saved ? " is-saved" : ""}`}
        disabled={pending}
        onClick={toggleFavourite}
        type="button"
      >
        {saved ? "♥" : "♡"}
      </button>
      {message && (
        <span aria-live="polite" className="favourite-error">{message}</span>
      )}
    </div>
  );
}
