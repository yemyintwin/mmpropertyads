# 03 - Search and Browse

Available to anonymous visitors. Public pages are server-rendered for SEO.

## 1. Entry points
- Home page search bar (location, listing type, property type, price range, bedrooms).
- Search results page `/search` with filters and sorting.
- Area landing pages `/areas/{area}` (Phase 2).
- Direct links with filter query strings.

## 2. Functional requirements

### Search
- **FR-SRCH-01:** Keyword/location search matches title, address, area/neighbourhood and postal code.
- **FR-SRCH-02:** Only ads with status `Live` and not expired appear in results.
- **FR-SRCH-03:** Search state is reflected in the URL query string so results are shareable and crawlable.

### Filters
- **FR-SRCH-04:** Listing type: For Sale / For Rent.
- **FR-SRCH-05:** Property type (for example Apartment, House, Townhouse, Land, Commercial; list configurable).
- **FR-SRCH-06:** Price range (min/max) with currency from config.
- **FR-SRCH-07:** Bedrooms (Studio, 1, 2, 3, 4, 5+), bathrooms.
- **FR-SRCH-08:** Floor area range.
- **FR-SRCH-09:** Furnishing (Unfurnished, Partially, Fully).
- **FR-SRCH-10:** Amenities (multi-select, for example pool, gym, parking, lift).
- **FR-SRCH-11:** Posted within (24h, 7 days, 30 days).
- **FR-SRCH-12:** Clear all filters in one action; active filters shown as removable chips.

### Sorting and paging
- **FR-SRCH-13:** Sort options: Newest, Price low to high, Price high to low, Relevance (default when keyword present).
- **FR-SRCH-14:** Paginated results, default 20 per page. Pagination uses real links (`?page=2`) so crawlers can follow them.
- **FR-SRCH-15:** Result count shown ("124 properties found").

### Views
- **FR-SRCH-16:** Grid and list view toggle.
- **FR-SRCH-17 (Phase 2):** Map view with pins; clicking a pin shows a mini card; "search this area" on map move.

### Listing card
- **FR-SRCH-18:** Each card shows cover photo, price, title, location, beds/baths/size, posted date, and a favourite icon.
- **FR-SRCH-19:** Clicking the favourite icon while logged out opens the login prompt.
- **FR-SRCH-20:** Cards link to the ad detail page via slug URL.

### States
- **FR-SRCH-21:** Loading skeletons while results load on client-side changes.
- **FR-SRCH-22:** Empty state with suggestions (clear filters, widen price range, popular areas).
- **FR-SRCH-23:** Error state with retry.

### Saved search prompt
- **FR-SRCH-24:** Logged-in users see "Save this search" (Phase 2 alerts); anonymous users see a login prompt.

## 3. Performance and SEO notes
- Result pages use SSR with caching (short TTL) in front of API.
- Filter combinations with no results or thin content are `noindex`.
- Canonical URL strips tracking and unsupported parameters.

## 4. Acceptance criteria
- Given 50 live ads, when a visitor filters for 2 bedrooms and price under X, then only matching ads appear and the URL reflects the filters.
- Given an ad that is `Pending` or `Expired`, then it never appears in search results or the sitemap.
- Given a visitor opens `/search?type=rent&beds=2` directly, then server-rendered HTML contains the result cards.
