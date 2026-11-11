# Backend API

The local API is an Azure Functions .NET isolated worker that reads its listing fixtures from `src/PropertyAds.Api/SampleData/listings.json`.

## Run locally

Prerequisites: .NET 10 SDK, Azure Functions Core Tools v4, and (optionally) Azurite. In PowerShell:

```powershell
Copy-Item src\PropertyAds.Api\local.settings.sample.json src\PropertyAds.Api\local.settings.json
func start --script-root src\PropertyAds.Api --cors http://localhost:3000 --cors-credentials
```

The API listens at `http://localhost:7071`. Set both `API_BASE_URL` and `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:7071` in `frontend/.env.local`, then restart the Next.js dev server so server-rendered and browser requests use the API.

Available sample-data endpoints:

- `GET /api/listings` with search, filter, sort, and paging query parameters (page size capped at 50)
- `GET /api/listings/{slug}`
- `GET /api/listings/{id}/similar`
- `GET /api/listings/sitemap`
- `GET /api/areas`
- `GET /api/lookups`
- `POST /api/listings/{id}/view`
- `GET /api/health/live`

For an Azure deployment, configure the Static Web App origin in the Function App's CORS settings. Routes are public and use sample data; authentication and database persistence are not implemented. View counts and per-IP throttling are held in process memory and reset when the Function host restarts.
