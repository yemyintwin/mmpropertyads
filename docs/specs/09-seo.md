# 09 - SEO Requirements

## 1. Rendering strategy
| Page | Rendering | Indexable |
|---|---|---|
| Home | SSG/ISR | Yes |
| Search results (base and curated filters) | SSR with short cache | Yes (curated), noindex (deep filter combinations) |
| Area landing pages | ISR | Yes |
| Ad detail (Live) | SSR/ISR with on-demand revalidation | Yes |
| Ad detail (Expired) | SSR | No (`noindex`) |
| Login, register, account, post-ad, admin | Client-rendered | No (`noindex`, disallowed in robots) |

## 2. Requirements
- **FR-SEO-01:** All public pages return complete HTML (content, headings, links, image tags) without JavaScript.
- **FR-SEO-02:** Unique `<title>` and meta description per page, generated from ad data (for example "3-bedroom condo for rent in Woodlands | SiteName").
- **FR-SEO-03:** Canonical URL on every public page; filter/sort/tracking parameters canonicalised.
- **FR-SEO-04:** Readable, stable URLs: `/listings/{slug}` where the slug ends with a short ID; slug changes redirect `301`.
- **FR-SEO-05:** XML sitemap(s) at `/sitemap.xml` (index plus chunks of up to 10,000 URLs), including live ads, areas and static pages with `lastmod`; updated at least daily.
- **FR-SEO-06:** `robots.txt` allows public pages, blocks account, admin, API and internal search permutations; references the sitemap.
- **FR-SEO-07:** Structured data (JSON-LD): `BreadcrumbList` on all pages; listing schema (for example `RealEstateListing` with `Offer`) on ad pages; `Organization` and `WebSite` on home.
- **FR-SEO-08:** Open Graph and Twitter card tags with cover image for link previews (WhatsApp, Facebook, Telegram, X).
- **FR-SEO-09:** Single `<h1>` per page and logical heading hierarchy.
- **FR-SEO-10:** Image `alt` text, width/height attributes, lazy loading below the fold, modern formats via the image pipeline.
- **FR-SEO-11:** Expired/removed ads: expired return `200` with `noindex`; deleted return `410`; never soft-404.
- **FR-SEO-12:** Internal linking: breadcrumbs, similar listings, popular areas and property-type links.
- **FR-SEO-13:** Pagination uses crawlable links; `rel="next/prev"` not required, but each page has a unique title and canonical.
- **FR-SEO-14:** `hreflang` added if multi-language is introduced (Phase 3).

## 3. Performance targets (Core Web Vitals, 75th percentile mobile)
- LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
- Achieved through CDN caching, image optimisation, minimal client JS on public pages, font preloading.

## 4. Operations
- Google Search Console and Bing Webmaster Tools configured; sitemap submitted.
- Monitor index coverage and Core Web Vitals monthly.

## 5. Acceptance criteria
- Given a live ad, then the page source contains a JSON-LD block, canonical tag, Open Graph tags and a single H1.
- Given an ad is rejected or deleted, then it is removed from the sitemap within 24 hours.
