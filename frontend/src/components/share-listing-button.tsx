"use client";

import { useState } from "react";

export function ShareListingButton() {
  const [message, setMessage] = useState("");

  function shareListing() {
    if (!navigator.clipboard) {
      setMessage("Sharing is unavailable in this browser.");
      return;
    }

    void navigator.clipboard.writeText(window.location.href).then(
      () => setMessage("Link copied."),
      () => setMessage("Couldn't copy the link. Please try again."),
    );
  }

  return (
    <div className="share-listing-control">
      <button
        aria-label="Share listing"
        className="detail-icon-button"
        onClick={shareListing}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" />
        </svg>
      </button>
      {message && <span aria-live="polite" className="share-listing-message">{message}</span>}
    </div>
  );
}
