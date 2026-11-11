# 00 - Product Overview

## 1. Purpose
A lightweight property advertisement website. Anyone can search and browse property ads. Registered users can post and manage their own ads. Admins moderate content to keep the site free of spam and scams.

## 2. Goals
- G1: Let anonymous visitors find relevant properties quickly (search, filter, map, detail pages).
- G2: Let registered users post a complete ad with photos in under 5 minutes.
- G3: Rank well in search engines (server-rendered public pages, structured data, sitemaps).
- G4: Keep running cost low (serverless / small-tier Azure services) and operations simple.
- G5: Keep spam and fraudulent ads under control through verification and moderation.

## 3. Non-goals (MVP)
- In-app payments, paid promotion, or subscription plans.
- Real-time chat (enquiries are form-based with email notification).
- Native mobile apps (responsive web only).
- Agent/agency profiles with team management.
- Virtual tours, mortgage calculators, price-history analytics.

## 4. User types
| Role | Description |
|---|---|
| Anonymous visitor | Not logged in. Can search, browse, view ads, share. |
| Registered user | Logged in with a verified email. Can post/manage ads, favourite, save searches, send enquiries. |
| Admin | Internal moderator. Approves/rejects ads, handles reports, manages users. |

## 5. Scope summary
| Area | Spec file |
|---|---|
| Roles and permissions | 01-roles-permissions.md |
| Registration, login, social login | 02-authentication.md |
| Search, filter, browse | 03-search-browse.md |
| Individual ad page | 04-ad-detail.md |
| Post and manage ads | 05-post-manage-ads.md |
| Photo upload and handling | 06-images.md |
| Enquiries, favourites, saved searches | 07-enquiries-favourites-saved-searches.md |
| Moderation and admin | 08-moderation-admin.md |
| SEO | 09-seo.md |
| Non-functional requirements | 10-non-functional.md |
| Data model | 11-data-model.md |
| API endpoints | 12-api-endpoints.md |
| Pages and routes | 13-pages-and-routes.md |

## 6. Azure platform
- **Frontend:** Azure Static Web Apps.
- **Backend API:** Azure Functions.
- **Database:** Azure Cosmos DB for PostgreSQL, accessed by the backend.
- **Image storage:** Azure Blob Storage. The browser uploads images directly using short-lived SAS URLs issued by the backend.

> **Platform caveat:** Microsoft says Azure Cosmos DB for PostgreSQL is on a retirement path and is not recommended for new projects. Confirm that this target is an existing deployment before implementation; otherwise, evaluate [Azure Database for PostgreSQL elastic clusters](https://learn.microsoft.com/en-us/azure/postgresql/elastic-clusters/concepts-elastic-clusters).

## 7. Glossary
- **Ad / Listing:** a property advertisement posted by a user.
- **Advertiser:** the registered user who owns an ad.
- **Enquiry:** a message from a visitor or user to an advertiser about an ad.
- **Slug:** URL-friendly identifier for an ad, for example `3-bedroom-condo-woodlands-1a2b3c`.
- **SAS URL:** short-lived signed URL for uploading directly to Azure Blob Storage.

## 8. Assumptions and open questions
| # | Item | Status |
|---|---|---|
| A1 | Target market, country and currency | TBD (placeholder: single currency, configurable) |
| A2 | Listing types supported | Assumed: For Sale and For Rent |
| A3 | Ads require admin approval before going live | Assumed yes for MVP; revisit once trust scoring exists |
| A4 | Ad lifetime | Assumed 60 days, renewable |
| A5 | Max photos per ad | Assumed 20 |
| A6 | Advertiser phone number visibility | Assumed shown only to logged-in users |
| A7 | Languages | English only for MVP |

## 9. Release phases
- **Phase 1 (MVP):** auth, post ad, browse/search, ad detail, enquiries, favourites, admin approval, SEO basics.
- **Phase 2:** saved searches with email alerts, map search, reports workflow, area landing pages.
- **Phase 3:** featured ads, agent profiles, analytics, multi-language.
