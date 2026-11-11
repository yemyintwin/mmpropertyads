# 11 - Data Model (Azure Cosmos DB for PostgreSQL / EF Core)

The backend stores relational data in Azure Cosmos DB for PostgreSQL using EF Core and the Npgsql provider. The PostgreSQL types below are logical schema types; users and roles use the standard ASP.NET Core Identity tables (`AspNetUsers`, `AspNetRoles`, `AspNetUserLogins` for social logins, etc.) extended as below. Naming: PascalCase entities, `Guid` primary keys unless noted, UTC timestamps (`timestamptz`).

## 1. Entity overview
```
User 1---* Listing 1---* ListingImage
User 1---* Enquiry (as sender)       Listing 1---* Enquiry
User *---* Listing   (Favourite)
User 1---* SavedSearch
User 1---* Report (as reporter)      Listing 1---* Report
Listing 1---* ModerationAction       User 1---* AuditLog
Listing *---* Amenity (ListingAmenity)
```

## 2. Tables

### ApplicationUser (extends AspNetUsers)
| Column | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| Email, NormalizedEmail, EmailConfirmed | | Identity |
| DisplayName | varchar(80) | |
| PhoneNumber | varchar(30) | optional |
| Status | smallint | Active, Suspended, Deleted |
| CreatedAt, LastLoginAt | timestamptz | |
| ApprovedAdCount | integer | cached, supports "trusted user" rule |
| NotificationPrefs | jsonb | |

### Listing
| Column | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| ReferenceNo | varchar(12) | unique, human-friendly |
| Slug | varchar(200) | unique, includes short ID suffix |
| OwnerId | Guid | FK ApplicationUser |
| ListingType | smallint | Sale, Rent |
| PropertyType | smallint | Apartment, House, Townhouse, Land, Commercial... |
| Title | varchar(100) | |
| Description | varchar(5000) | plain text |
| Price | numeric(14,2) | |
| PricePeriod | smallint | None, PerMonth, PerWeek |
| Currency | char(3) | from config |
| Bedrooms | smallint | null for land; 0 = studio |
| Bathrooms | smallint | |
| FloorAreaSqm | numeric(10,2) | |
| Furnishing | smallint | |
| Tenure | varchar(40) | |
| AvailableFrom | date | |
| AddressLine, Area, City, PostalCode, Country | varchar | |
| Latitude, Longitude | numeric(9,6) | |
| HideExactAddress | boolean | |
| ContactPreference | smallint | Form, Phone, Both |
| ContactPhone | varchar(30) | |
| Status | smallint | Draft, Pending, Live, Paused, Rejected, Expired, SoldRented, Deleted |
| RejectionReason | varchar(500) | |
| ViewCount | integer | |
| CreatedAt, UpdatedAt, PublishedAt, ExpiresAt | timestamptz | |
| Version | bigint | incremented for optimistic concurrency |

Indexes: `(Status, PublishedAt desc)`, `(Status, ListingType, PropertyType, Price)`, `(Area, Status)`, `OwnerId`, unique `Slug`, spatial or lat/long index (Phase 2).

### ListingImage
| Column | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| ListingId | Guid | FK |
| BlobPath | varchar(300) | base path for variants in Azure Blob Storage |
| SortOrder | integer | |
| IsCover | boolean | |
| AltText | varchar(200) | |
| Width, Height | integer | |
| Status | smallint | Uploaded, Processing, Ready, Failed |
| CreatedAt | timestamptz | |

### Amenity / ListingAmenity
- `Amenity(Id, Code, Name, Category)` seed data.
- `ListingAmenity(ListingId, AmenityId)` composite PK.

### Enquiry
| Column | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| ListingId | Guid | FK |
| SenderId | Guid | FK ApplicationUser |
| RecipientId | Guid | FK (listing owner) |
| ParentEnquiryId | Guid? | thread replies |
| Message | varchar(1000) | |
| ContactPhone | varchar(30) | optional |
| Status | smallint | Sent, Read, Archived, Held |
| CreatedAt | timestamptz | |

### Favourite
`(UserId, ListingId)` composite PK, `CreatedAt` (`timestamptz`).

### SavedSearch
`Id, UserId, Name, QueryJson (jsonb), AlertFrequency (None/Daily/Weekly), LastAlertAt, CreatedAt` (timestamps use `timestamptz`).

### Report
`Id, ListingId, ReporterId, Reason (enum), Note, Status (Open/Dismissed/Actioned), HandledBy, HandledAt, CreatedAt` (timestamps use `timestamptz`).

### ModerationAction
`Id, ListingId, AdminId, Action (Approve/Reject/RequestChanges/Remove), Reason, Note, CreatedAt` (timestamp uses `timestamptz`).

### AuditLog
`Id, ActorId, Action, EntityType, EntityId, DetailsJson (jsonb), IpAddress, CreatedAt` (timestamp uses `timestamptz`).

## 3. Rules
- Soft delete via `Status = Deleted`; global query filter hides deleted rows by default.
- Public queries always filter `Status = Live AND ExpiresAt > now`.
- Optimistic concurrency on Listing (`Version`, incremented on each update).
- Migrations live in `backend/src/PropertyAds.Infrastructure/Persistence/Migrations`.
- Seed data: roles (`User`, `Admin`), amenities, property types.
