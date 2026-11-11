# 01 - Roles and Permissions

## 1. Roles
- `Anonymous` (no account)
- `User` (registered, email verified)
- `Admin`

## 2. Permission matrix
| Capability | Anonymous | User | Admin |
|---|---|---|---|
| Search and browse live ads | Yes | Yes | Yes |
| View ad detail page | Yes | Yes | Yes |
| View advertiser phone number | No | Yes | Yes |
| Send enquiry | No | Yes | Yes |
| Favourite an ad | No | Yes | Yes |
| Save a search | No | Yes | Yes |
| Create / edit / delete own ad | No | Yes | Yes |
| Edit or delete any ad | No | No | Yes |
| Report an ad | No | Yes | Yes |
| View pending ads queue | No | No | Yes |
| Approve / reject ads | No | No | Yes |
| Suspend a user | No | No | Yes |
| View other users' drafts | No | No | Yes (read-only, moderation) |

## 3. Rules
- **FR-ROLE-01:** Unauthenticated requests to protected endpoints return `401`.
- **FR-ROLE-02:** Authenticated requests lacking permission return `403`.
- **FR-ROLE-03:** Every write on an ad verifies ownership (`ad.OwnerId == currentUser.Id`) unless the caller is Admin.
- **FR-ROLE-04:** Unverified-email users can log in but cannot post ads, send enquiries or favourite until verified.
- **FR-ROLE-05:** Suspended users cannot log in; their live ads are hidden from public views.
- **FR-ROLE-06:** Admin role is assigned only via backend seeding or an admin-only action, never through self-signup.
- **FR-ROLE-07:** When a logged-out user attempts a protected action (contact, favourite, post), the UI prompts login and returns them to the same place afterwards.

## 4. Acceptance criteria
- Given a logged-in user A, when they call `PUT /api/ads/{id}` for an ad owned by user B, then the API returns `403`.
- Given an anonymous visitor on an ad page, when they click "Contact advertiser", then a login prompt appears, and after login the contact form opens.
