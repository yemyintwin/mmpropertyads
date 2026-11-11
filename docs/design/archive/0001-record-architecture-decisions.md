# ADR 0001: Record architecture decisions

- Status: Accepted
- Date: 2026-11-01

## Context
The project spans a Next.js frontend, an ASP.NET Core API and Azure infrastructure. Decisions such as session handling, hosting model and search approach will be revisited as traffic and requirements grow.

## Decision
Record significant decisions as short ADRs in `docs/decisions/`, numbered sequentially (`0002-...md`). Each has: Status, Date, Context, Decision, Consequences.

## Consequences
New contributors can understand why choices were made. Superseded decisions stay in the repo with their status updated.

## Decisions already taken (see architecture.md section 2)
D1 Next.js, D2 ASP.NET Core API, D3 ASP.NET Core Identity with social login, D4 Azure SQL, D5 direct-to-blob uploads, D6 cookie sessions, D7 admin approval before go-live.

## Decisions to make next
- Hosting: App Service vs Container Apps for frontend and API.
- Cookie session vs bearer tokens if frontend and API end up on unrelated domains.
- Email provider: Azure Communication Services vs SendGrid.
- Map provider: Azure Maps vs Leaflet with OpenStreetMap tiles vs Google Maps.
