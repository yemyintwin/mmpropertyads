# Property Ads

A lightweight property advertisement website. Anonymous visitors search and browse ads; registered users post and manage ads; admins moderate. Hosted on Azure.

## Tech stack
| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + React + TypeScript + Tailwind CSS, TanStack Query, React Hook Form + Zod |
| Backend | ASP.NET Core (latest LTS) Web API, EF Core, ASP.NET Core Identity (Google + Facebook login) |
| Database | Azure SQL (serverless tier) |
| Images | Azure Blob Storage + CDN (direct upload using SAS URLs) |
| Email | Azure Communication Services Email (or SendGrid) |
| Hosting | Azure App Service or Container Apps (frontend and API), Azure Front Door/CDN optional at launch |
| Ops | Key Vault, Application Insights, GitHub Actions, Bicep |

See [docs/architecture.md](docs/architecture.md) for the architecture and [docs/specs/](docs/specs/) for the functional specification.

## Repository layout
```
property-ads/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── specs/                 Functional specification (00-13)
│   ├── design/                Figma brief and design notes
│   └── decisions/             Architecture decision records (ADRs)
├── backend/
│   ├── PropertyAds.sln        (create with the commands below)
│   ├── src/
│   │   ├── PropertyAds.Api/              HTTP layer: endpoints, auth, middleware, config
│   │   ├── PropertyAds.Application/      Use cases per feature (Listings, Users, Enquiries, ...)
│   │   ├── PropertyAds.Domain/           Entities, enums, value objects (no dependencies)
│   │   └── PropertyAds.Infrastructure/   EF Core, Identity, Blob storage, Email
│   └── tests/
│       ├── PropertyAds.UnitTests/
│       └── PropertyAds.IntegrationTests/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/               Routes: (public) (auth) (account) (admin)
│   │   ├── components/        ui, layout, listings, search, forms, auth, map, admin
│   │   ├── lib/               api client, auth helpers, seo helpers, utils
│   │   ├── hooks/  types/  styles/  config/
│   └── tests/                 unit and e2e
├── infra/
│   ├── bicep/                 Azure resources as code (modules/)
│   └── scripts/
└── .github/workflows/         CI/CD pipelines
```

## Backend layering
Dependencies point inward: `Api -> Application -> Domain`, and `Infrastructure -> Application/Domain`. The Api project wires everything together with dependency injection.

## Getting started

### Prerequisites
.NET SDK (latest LTS), Node.js (LTS) and npm or pnpm, Azure CLI, SQL Server (local Docker image or LocalDB), Azurite (storage emulator).

### Scaffold the backend
Run from `backend/` (the folders already exist; the commands create the project files inside them):
```bash
cd backend
dotnet new sln -n PropertyAds
dotnet new webapi -n PropertyAds.Api -o src/PropertyAds.Api --use-minimal-apis --force
dotnet new classlib -n PropertyAds.Application -o src/PropertyAds.Application --force
dotnet new classlib -n PropertyAds.Domain -o src/PropertyAds.Domain --force
dotnet new classlib -n PropertyAds.Infrastructure -o src/PropertyAds.Infrastructure --force
dotnet new xunit -n PropertyAds.UnitTests -o tests/PropertyAds.UnitTests --force
dotnet new xunit -n PropertyAds.IntegrationTests -o tests/PropertyAds.IntegrationTests --force

dotnet sln add src/*/*.csproj tests/*/*.csproj

# project references
dotnet add src/PropertyAds.Api reference src/PropertyAds.Application src/PropertyAds.Infrastructure
dotnet add src/PropertyAds.Application reference src/PropertyAds.Domain
dotnet add src/PropertyAds.Infrastructure reference src/PropertyAds.Application src/PropertyAds.Domain
dotnet add tests/PropertyAds.UnitTests reference src/PropertyAds.Application src/PropertyAds.Domain
dotnet add tests/PropertyAds.IntegrationTests reference src/PropertyAds.Api

# key packages
dotnet add src/PropertyAds.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/PropertyAds.Infrastructure package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add src/PropertyAds.Infrastructure package Azure.Storage.Blobs
dotnet add src/PropertyAds.Application package FluentValidation
dotnet add src/PropertyAds.Api package Microsoft.AspNetCore.Authentication.Google
dotnet add src/PropertyAds.Api package Microsoft.AspNetCore.Authentication.Facebook
dotnet add src/PropertyAds.Api package Microsoft.EntityFrameworkCore.Design
```

### Scaffold the frontend
The Next.js App Router project and dependencies are in `frontend/`. From that directory, run `npm ci`, then `npm run dev`. The frontend checks are `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` (after building).

Generate the typed API client from the backend's OpenAPI document:
```bash
npx openapi-typescript http://localhost:5080/swagger/v1/swagger.json -o src/types/api.d.ts
```

### Run locally
```bash
# backend
cd backend && dotnet run --project src/PropertyAds.Api

# frontend
cd frontend && npm run dev
```
Frontend: http://localhost:3000. Backend: http://localhost:5080 (configure in `launchSettings.json`).

When no API URL is configured, the frontend loads 20 sale and 20 rental sample listings from `frontend/src/data/` so search and listing detail pages can be tried without a backend. Setting `API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL` uses the API instead.

## Configuration and secrets
- Local: `dotnet user-secrets` for the backend, `.env.local` for the frontend. Never commit secrets.
- Azure: Key Vault with managed identity; App Service/Container Apps settings reference Key Vault.

| Setting | Where |
|---|---|
| `ConnectionStrings__Default` | Backend |
| `Authentication__Google__ClientId/ClientSecret` | Backend |
| `Authentication__Facebook__AppId/AppSecret` | Backend |
| `Storage__ConnectionString` or managed identity | Backend |
| `Email__*` | Backend |
| `NEXT_PUBLIC_SITE_URL`, `API_BASE_URL` | Frontend |

## Suggested build order
1. Backend skeleton: Domain entities, EF Core context, migrations, health endpoints.
2. Auth: Identity, email verification, Google/Facebook login (spec 02).
3. Listings: create/edit/submit, images upload flow (specs 05, 06).
4. Public search and ad detail endpoints (specs 03, 04).
5. Frontend: design system, public pages with SSR, auth pages.
6. Frontend: post-ad flow, My ads, favourites, enquiries.
7. Admin moderation (spec 08).
8. SEO: sitemap, robots, structured data (spec 09).
9. Infra (Bicep), CI/CD, monitoring, hardening (spec 10).

Feature-sprint handoffs, agent responsibilities, and CI quality gates are documented in [docs/development/frontend-sprint-delivery.md](docs/development/frontend-sprint-delivery.md).

## Documentation
- Functional spec index: [docs/specs/00-overview.md](docs/specs/00-overview.md)
- Figma brief: [docs/design/figma-prompt.md](docs/design/figma-prompt.md)
