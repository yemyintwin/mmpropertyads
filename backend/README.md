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

## Deploy to Azure

The API is deployed as a separate Azure Functions app; it is not part of the Static Web App deployment. Create a Function App using the .NET 10 isolated worker runtime and Azure Functions v4, then configure the repository:

- Add the Function App name as the `AZURE_FUNCTIONAPP_NAME` Actions variable.
- Add its publish profile as the `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` Actions secret.

The `Deploy Azure Functions API` workflow publishes the API when backend files change on `main`, or can be started manually. It remains skipped until `AZURE_FUNCTIONAPP_NAME` is configured.

To connect the frontend, configure both `API_BASE_URL` and `NEXT_PUBLIC_API_BASE_URL` in the Static Web App with the Function App origin (for example, `https://<function-app>.azurewebsites.net`), and allow the Static Web App origin in the Function App's CORS settings. Since the Static Web App uses hybrid Next.js, the separate Function App will appear under Azure Function Apps, not in the Static Web App's APIs blade.
