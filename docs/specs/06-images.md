# 06 - Photo Upload and Handling

## 1. Upload flow
1. Browser asks the API for upload slots: `POST /api/ads/{id}/images/upload-urls` with file names, types and sizes.
2. API validates the request (ownership, limits, content types) and returns short-lived SAS URLs (5-10 minutes, write-only, single blob).
3. Browser uploads files directly to Azure Blob Storage (`uploads/` container).
4. Browser confirms with `POST /api/ads/{id}/images/confirm`.
5. An Azure Function (for example, triggered by a blob event) validates, strips metadata, resizes and writes variants to the public container in Azure Blob Storage, then marks the image as ready.

## 2. Requirements
- **FR-IMG-01:** Accepted types: JPEG, PNG, WebP (HEIC converted client-side or rejected with a clear message).
- **FR-IMG-02:** Max file size 10 MB each; max 20 photos per ad; min 1 photo for submission.
- **FR-IMG-03:** Drag-and-drop and file picker; multiple selection; per-file progress and retry.
- **FR-IMG-04:** User can reorder photos and choose the cover; the first image is the cover by default.
- **FR-IMG-05:** User can delete a photo before or after publication.
- **FR-IMG-06:** Server verifies real file type by content (magic bytes), not extension.
- **FR-IMG-07:** EXIF metadata, including GPS, is stripped from stored images.
- **FR-IMG-08:** Generated variants: thumbnail (about 400 px), card (about 800 px), detail (about 1600 px), plus WebP versions.
- **FR-IMG-09:** Images are served via CDN with long cache headers and immutable, versioned URLs.
- **FR-IMG-10:** Each image has optional alt text; default alt is generated from ad title and position.
- **FR-IMG-11:** Orphaned uploads (not confirmed or attached) are deleted after 24 hours via lifecycle rule.
- **FR-IMG-12:** Optional (Phase 2): automated content moderation scan for inappropriate imagery.

## 3. Security
- Azure Blob Storage upload container is private; public container serves only processed variants.
- SAS tokens are scoped to a single blob path, write-only, short-lived.
- No direct upload of non-image content types; server rejects unsupported content after upload.

## 4. Acceptance criteria
- Given a 15 MB file, then the UI blocks it with a size error before upload.
- Given a PNG renamed to `.jpg`, then the server detects the real type and handles it per allowed types.
- Given an ad with 3 photos, when the owner moves photo 3 to first position, then the public cover image changes after re-publish.
