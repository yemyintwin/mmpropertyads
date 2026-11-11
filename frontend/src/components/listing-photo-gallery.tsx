"use client";

import { useEffect, useRef, useState } from "react";

type GalleryPhoto = { src: string };

function getGalleryPhotos(imageUrl?: string, imageUrls?: string[]): GalleryPhoto[] {
  return Array.from(
    new Set([imageUrl, ...(imageUrls ?? [])].filter((source): source is string => Boolean(source))),
  ).map((src) => ({ src }));
}

export function ListingPhotoGallery({
  imageUrl,
  imageUrls,
  title,
}: {
  imageUrl?: string;
  imageUrls?: string[];
  title: string;
}) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const photos = getGalleryPhotos(imageUrl, imageUrls);
  const moreCount = Math.max(0, photos.length - 4);

  return (
    <section aria-label="Listing photo gallery" className="listing-photo-gallery">
      <div className="detail-gallery">
        {Array.from({ length: 4 }, (_, index) => {
          const photo = photos[index];
          const className = `detail-gallery-tile${index === 0 ? " detail-gallery-cover" : ""}`;
          return photo ? (
            <button
              aria-label={`Open photo ${index + 1} of ${photos.length}`}
              className={className}
              key={photo.src}
              onClick={() => setActivePhoto(index)}
              type="button"
            >
              <GalleryPhoto photo={photo} title={title} index={index} />
              {index === 3 && moreCount > 0 && (
                <span className="detail-gallery-more">
                  <strong>+{moreCount}</strong>
                  <span>View all {photos.length} photos</span>
                </span>
              )}
            </button>
          ) : (
            <div
              aria-hidden="true"
              className={className}
              key={`house-art-${index}`}
            >
              <HouseIllustration index={index} />
            </div>
          );
        })}
      </div>
      {activePhoto !== null && (
        <PhotoLightbox
          onClose={() => setActivePhoto(null)}
          onNavigate={setActivePhoto}
          photos={photos}
          title={title}
          activePhoto={activePhoto}
        />
      )}
    </section>
  );
}

function GalleryPhoto({
  photo,
  title,
  index,
}: {
  photo: GalleryPhoto;
  title: string;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return <HouseIllustration index={index} />;
  }

  return (
    // Listing image URLs may be hosted on the listing API's CDN.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${title}, photo ${index + 1}`}
      height={780}
      onError={() => setImageFailed(true)}
      src={photo.src}
      width={1200}
    />
  );
}

function HouseIllustration({ index }: { index: number }) {
  return (
    <span className={`gallery-house-art gallery-house-art-${index % 4}`}>
      <svg fill="none" viewBox="0 0 48 48">
        <path d="m7 22 17-14 17 14v18H7V22Z" />
        <path d="M18 40V27h12v13M13 24h22" />
      </svg>
    </span>
  );
}

function PhotoLightbox({
  activePhoto,
  onClose,
  onNavigate,
  photos,
  title,
}: {
  activePhoto: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  photos: GalleryPhoto[];
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[activePhoto];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const navigate = (direction: -1 | 1) => {
    onNavigate((activePhoto + direction + photos.length) % photos.length);
  };

  return (
    <dialog
      aria-label={`${title} photos`}
      className="listing-photo-lightbox"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") navigate(-1);
        if (event.key === "ArrowRight") navigate(1);
      }}
      ref={dialogRef}
    >
      <div className="listing-photo-lightbox-header">
        <p aria-live="polite">
          Photo {activePhoto + 1} of {photos.length}
        </p>
        <button
          aria-label="Close photo gallery"
          autoFocus
          className="listing-photo-lightbox-close"
          onClick={() => dialogRef.current?.close()}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="listing-photo-lightbox-image">
        {photo && <GalleryPhoto photo={photo} title={title} index={activePhoto} />}
      </div>
      <div className="listing-photo-lightbox-controls">
        <button onClick={() => navigate(-1)} type="button">Previous photo</button>
        <button onClick={() => navigate(1)} type="button">Next photo</button>
      </div>
    </dialog>
  );
}
