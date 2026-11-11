# 12 - API Endpoints (REST, JSON)

Base path: `/api`. Auth column: `Public`, `User` (verified), `Admin`. List endpoints support `page`, `pageSize` (max 50). Errors use RFC 7807 Problem Details. The OpenAPI document is published at `/swagger/v1/swagger.json` (non-production, or protected).

## 1. Auth and account
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Register with email and password |
| POST | /api/auth/login | Public | Email/password login (sets cookie) |
| POST | /api/auth/logout | User | End session |
| GET | /api/auth/external/{provider} | Public | Start Google/Facebook login (redirect) |
| GET | /api/auth/external/{provider}/callback | Public | Provider callback |
| POST | /api/auth/verify-email | Public | Confirm email with token |
| POST | /api/auth/resend-verification | Public | Resend verification email (rate limited) |
| POST | /api/auth/forgot-password | Public | Send reset link |
| POST | /api/auth/reset-password | Public | Reset with token |
| GET | /api/me | User | Current profile and permissions |
| PUT | /api/me | User | Update profile |
| POST | /api/me/change-password | User | Change password |
| DELETE | /api/me | User | Delete account |
| GET/DELETE | /api/me/logins/{provider} | User | List/unlink social logins |

## 2. Public listings
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /api/listings | Public | Search with filters, sort, paging |
| GET | /api/listings/{slug} | Public | Ad detail (live ads) |
| GET | /api/listings/{id}/similar | Public | Similar listings |
| GET | /api/listings/sitemap | Public | Compact list for sitemap generation (server-to-server), returning `[{slug, lastModified}]` |
| GET | /api/areas | Public | Popular areas and counts, returning `[{name, slug, listingCount}]` |
| GET | /api/lookups | Public | Property types, amenities, listing types, and furnishing options |
| POST | /api/listings/{id}/view | Public | Increment view count (throttled); returns `204` on success |

Search query parameters: `q, type, propertyType, minPrice, maxPrice, beds, baths, minArea, maxArea, furnishing, amenities, postedWithin, area, sort, page, pageSize`. `amenities` accepts multiple comma-separated values (all requested amenities must match); `postedWithin` accepts `24h`, `7d`, or `30d`.

## 3. Owner (my ads)
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /api/my/listings | User | List own ads (filter by status) |
| POST | /api/my/listings | User | Create draft |
| GET | /api/my/listings/{id} | User | Get own ad (any status) |
| PUT | /api/my/listings/{id} | User | Update ad / draft step |
| POST | /api/my/listings/{id}/submit | User | Submit for review |
| POST | /api/my/listings/{id}/pause | User | Pause |
| POST | /api/my/listings/{id}/resume | User | Resume |
| POST | /api/my/listings/{id}/renew | User | Renew |
| POST | /api/my/listings/{id}/mark-closed | User | Mark sold/rented |
| DELETE | /api/my/listings/{id} | User | Soft delete |

## 4. Images
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/my/listings/{id}/images/upload-urls | User | Get SAS upload URLs |
| POST | /api/my/listings/{id}/images/confirm | User | Confirm uploaded files |
| PUT | /api/my/listings/{id}/images/order | User | Reorder / set cover |
| PUT | /api/my/listings/{id}/images/{imageId} | User | Update alt text |
| DELETE | /api/my/listings/{id}/images/{imageId} | User | Delete image |

## 5. Enquiries, favourites, saved searches, reports
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/listings/{id}/enquiries | User | Send enquiry |
| GET | /api/my/enquiries?box=inbox\|sent | User | List threads |
| GET | /api/my/enquiries/{id} | User | Thread detail |
| POST | /api/my/enquiries/{id}/reply | User | Reply |
| PUT | /api/my/enquiries/{id}/status | User | Mark read / archive |
| GET | /api/listings/{id}/phone | User | Reveal advertiser phone |
| GET | /api/my/favourites | User | List favourites |
| PUT | /api/my/favourites/{listingId} | User | Add favourite |
| DELETE | /api/my/favourites/{listingId} | User | Remove favourite |
| GET/POST | /api/my/saved-searches | User | List / create (Phase 2) |
| PUT/DELETE | /api/my/saved-searches/{id} | User | Update / delete (Phase 2) |
| POST | /api/listings/{id}/reports | User | Report an ad |

## 6. Admin
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /api/admin/dashboard | Admin | Counters |
| GET | /api/admin/listings/pending | Admin | Moderation queue |
| GET | /api/admin/listings/{id} | Admin | Review detail with flags |
| POST | /api/admin/listings/{id}/approve | Admin | Approve |
| POST | /api/admin/listings/{id}/reject | Admin | Reject with reason |
| POST | /api/admin/listings/{id}/remove | Admin | Remove ad |
| GET | /api/admin/reports | Admin | Open reports |
| POST | /api/admin/reports/{id}/resolve | Admin | Dismiss / action |
| GET | /api/admin/users | Admin | Search users |
| POST | /api/admin/users/{id}/suspend | Admin | Suspend |
| POST | /api/admin/users/{id}/unsuspend | Admin | Unsuspend |
| GET | /api/admin/audit-log | Admin | Audit entries |

## 7. Platform
| Method | Path | Purpose |
|---|---|---|
| GET | /health/live, /health/ready | Probes |

## 8. Conventions
- Status codes: `200/201/204`, `400` validation, `401`, `403`, `404`, `409` conflict (concurrency/duplicate), `410` deleted ad, `429` rate limited.
- Validation errors list field-level messages.
- Dates in ISO 8601 UTC. Money as decimal with separate currency code.
- All write endpoints verify ownership or role server-side.
- Rate-limit policies: `auth` (strict), `write` (moderate), `public-read` (generous), `upload` (strict).
