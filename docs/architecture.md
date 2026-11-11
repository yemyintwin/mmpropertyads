# Architecture Overview

## 1. Context
```
Users (browser/mobile)
   |
Azure Front Door + CDN (optional at launch: WAF, caching, SSL)
   |-----------------------------|
Next.js frontend            ASP.NET Core API  ---- Social login (Google, Facebook)
(SSR, React, Tailwind)            |
                                  |---- Azure SQL        (listings, users)
                                  |---- Blob Storage     (property photos, via SAS + CDN)
                                  |---- Email service    (verify, reset, notifications)

Supporting: Key Vault, Application Insights, GitHub Actions, Bicep
```

## 2. Key decisions
| # | Decision | Rationale |
|---|---|---|
| D1 | Next.js for the frontend | Strong SEO needs server-rendered public pages |
| D2 | ASP.NET Core Web API for the backend | Team preference for C#; first-class Azure support |
| D3 | ASP.NET Core Identity with Google/Facebook login | No per-user cost; full control; Entra External ID not needed now |
| D4 | Azure SQL (serverless) | Structured listings, filter-heavy queries, EF Core support |
| D5 | Direct-to-blob uploads with SAS | Keeps large files off the API; cheaper and faster |
| D6 | Cookie-based session (HttpOnly) | Safer than storing tokens in browser storage; fits shared parent domain |
| D7 | Admin approval before ads go live | Reduces spam and scams at launch |

Record future decisions as ADRs in `docs/decisions/` (one file per decision: context, decision, consequences).

## 3. Request flows

### Browse a listing (anonymous)
1. Browser requests `/listings/{slug}` through CDN.
2. Cache miss: Next.js server fetches the ad from the API (server-to-server), renders HTML, adds metadata and JSON-LD.
3. Response cached; revalidated on ad change.

### Post an ad
1. User logs in (cookie session). Frontend calls `POST /api/my/listings` to create a draft.
2. Frontend requests SAS upload URLs, uploads photos straight to Blob Storage, then confirms.
3. A background process validates, strips EXIF, resizes and publishes image variants.
4. User submits; the ad becomes `Pending`; admin approves; the ad goes `Live` and the page cache is revalidated.

### Social login
1. SPA navigates to `/api/auth/external/google`.
2. API redirects to Google; callback creates or links the local user and sets the cookie.
3. API redirects back to the frontend `returnUrl`.

## 4. Environments
| Env | Purpose | Notes |
|---|---|---|
| Local | Development | SQL in Docker, Azurite for storage, user-secrets |
| Staging | Pre-release testing | Auto-deploy from `main`; smaller SKUs |
| Production | Live | Deploy on approval; backups, alerts, budget limits |

## 5. Domains and cookies
Preferred: `www.example.com` (frontend) and `api.example.com` (API) under the same registrable domain so the session cookie can be shared with `SameSite=Lax`. Alternative: proxy `/api` through the frontend origin to avoid CORS entirely.

## 6. Security summary
HTTPS only, HttpOnly secure cookies, CSRF protection, strict CORS, input validation (FluentValidation), rate limiting, CAPTCHA on sign-up, SAS tokens scoped and short-lived, secrets in Key Vault, audit logging. Full list in `specs/10-non-functional.md`.

## 7. Growth path
Front Door with WAF, Redis cache for hot queries, Azure AI Search for advanced search, Service Bus for background jobs, read replicas or elastic pools if the database becomes a bottleneck.
