# Frontend feature sprint delivery

## Architecture target

The production frontend is Next.js App Router with server-rendered or statically generated public pages. The Vite app under `docs/design/figma_site_reference/` is a visual reference, not the production runtime. Public routes must render meaningful HTML for SEO; auth, account, and post-ad routes must remain non-indexable.

## First frontend slice

The initial UI slice follows the Figma home, search/results, listing detail, login/register, post-ad, and account surfaces. Use API-backed data and explicit loading, empty, unsupported-response, and service-error states. Do not treat fixture content as production data or display a successful operation when an API call is unavailable.

Map search and saved-search alerts remain Phase 2 as specified in the product requirements. Do not add Azure deployment to this slice; the Bicep resources and deployment prerequisites are not ready.

## Repeatable sprint process

1. Select the feature slice and agree on routes, acceptance criteria, API request/response contracts, data ownership, accessibility, and responsive behavior.
2. Frontend-dev and backend-dev identify endpoint availability and agree on auth-cookie, CSRF, CORS, error, and validation behavior. Record missing endpoints as dependencies before integration begins.
3. Implement UI and API changes against the agreed contract. Public routes retain SSR/ISR where required; protected routes enforce access in both frontend and API.
4. Open a PR and require the frontend CI gates: clean dependency install, lint, type-check, unit tests, dependency audit, production build, and focused browser tests.
5. Test-engineer verifies acceptance criteria, loading/error/empty states, accessibility, responsive layouts, and relevant API integration. DevSecOps reviews workflow/security changes. Merge only after required checks and review pass.
6. technical-writer updates directly affected setup, API, and user-facing documentation. Merge to `main` is the release boundary until Azure infrastructure and gated staging/production workflows are available.

## Agent responsibilities

| Agent | Sprint responsibility |
|---|---|
| frontend-dev | Next.js routes, components, accessibility, API client usage |
| backend-dev | API contracts, endpoint implementation, authorization and validation |
| test-engineer | Unit, integration, browser, and acceptance coverage |
| devsecops | CI/CD, dependency/security scanning, infrastructure and release gates |
| technical-writer | Specs, setup instructions, API docs, and changelog |

## Current dependencies and gaps

The repository currently has no backend C# endpoint implementations or DTOs. The API routes in `docs/specs/12-api-endpoints.md` are therefore intended contracts, not verified live endpoints. Authentication, listings, favourites/enquiries, owner listing management, and image uploads require backend implementation and agreed response schemas before full end-to-end behavior can be accepted. Registration also remains disabled until its required CAPTCHA integration is available.

The current browser API client uses `XSRF-TOKEN` as the readable antiforgery cookie and sends it as `X-XSRF-TOKEN` on mutations. The backend must confirm or adopt this convention and issue the cookie before write flows can pass end-to-end verification.

The CI workflow includes a backend job only when `backend/PropertyAds.sln` exists. This lets a frontend-only sprint produce meaningful checks without pretending the backend is already scaffolded.
