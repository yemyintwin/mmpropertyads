# 04 - Individual Ad Page

Route: `/listings/{slug}`. Server-rendered, publicly accessible for `Live` ads.

## 1. Content
- **FR-AD-01:** Photo gallery with a cover image, thumbnails, swipe on mobile, and full-screen lightbox. Where additional listing photos are unavailable, show decorative house artwork in unused tiles without labeling them as photos or offering a view-all action.
- **FR-AD-02:** Title, price (and price period for rentals, for example per month), listing type badge.
- **FR-AD-03:** Key facts: property type, bedrooms, bathrooms, floor area, furnishing, tenure/lease, available date.
- **FR-AD-04:** Full description (plain text with line breaks; no raw HTML).
- **FR-AD-05:** Amenities/features list.
- **FR-AD-06:** Location: address (or area only if advertiser chose to hide exact address), static or interactive map with pin.
- **FR-AD-07:** Posted date, last updated date, and ad reference number.
- **FR-AD-08:** Breadcrumbs: Home > Listing type > Area > Ad.

## 2. Actions
- **FR-AD-09:** Contact advertiser: opens enquiry form (name prefilled, message, phone optional). Requires login; logged-out users see the login prompt and return to the form afterwards.
- **FR-AD-10:** Show advertiser phone number after login via a "Show phone number" button.
- **FR-AD-11:** Favourite/unfavourite (login required).
- **FR-AD-12:** Share: copy link plus share links (WhatsApp, Facebook, email).
- **FR-AD-13:** Report this ad with reason (spam, wrong info, scam, duplicate, other) and optional note. Login required.
- **FR-AD-14:** Print-friendly layout (optional).

## 3. Related content
- **FR-AD-15:** "Similar listings" block: same area and type, similar price, max 6.
- **FR-AD-16:** Advertiser summary card (display name, member since, number of live ads). Contact details are not exposed to anonymous users.

## 4. Status handling
| Ad status | Public behaviour |
|---|---|
| Live | Full page, indexable |
| Pending / Draft / Rejected | `404` to the public; visible to owner and admin with a status banner |
| Expired | Page remains with "This ad has expired" banner, `noindex`, similar listings shown |
| Sold/Rented | Page remains with a clear badge, `noindex` after 30 days |
| Deleted | `410 Gone` |

## 5. Edge cases
- Photos fail to load: show placeholder.
- No photos: show a neutral placeholder and a hint to the owner.
- Slug mismatch (for example title edited): `301` redirect to the current canonical slug using the ad ID suffix.

## 6. Acceptance criteria
- Given a live ad, when a bot fetches the page without JavaScript, then title, price, description, key facts and image tags are present in HTML.
- Given an anonymous visitor, when they click "Show phone number", then they are asked to log in and the number is not present in the page source.
