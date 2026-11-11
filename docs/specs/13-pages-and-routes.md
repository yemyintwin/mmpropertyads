# 13 - Pages and Routes (Frontend)

Next.js App Router with route groups. "Render" shows the intended strategy; "Index" shows search-engine behaviour.

## 1. Public
| Route | Page | Render | Index |
|---|---|---|---|
| `/` | Home | ISR | Yes |
| `/search` | Search results | SSR | Curated yes, others noindex |
| `/listings/[slug]` | Ad detail | SSR/ISR | Live only |
| `/areas/[area]` | Area landing (Phase 2) | ISR | Yes |
| `/about`, `/contact`, `/terms`, `/privacy`, `/help` | Static pages | SSG | Yes |
| `/sitemap.xml`, `/robots.txt` | Generated | Dynamic | n/a |

## 2. Auth
| Route | Page |
|---|---|
| `/login` | Login (email, Google, Facebook) |
| `/register` | Register |
| `/forgot-password` | Request reset |
| `/reset-password` | Set new password |
| `/verify-email` | Email verification result / resend |

## 3. Account (login required, noindex)
| Route | Page |
|---|---|
| `/post-ad` | Multi-step post-an-ad form (also `/post-ad/[id]` to resume or edit) |
| `/account/my-ads` | Manage ads |
| `/account/favourites` | Favourites |
| `/account/saved-searches` | Saved searches (Phase 2) |
| `/account/messages`, `/account/messages/[id]` | Enquiry threads |
| `/account/settings` | Profile, password, linked accounts, notifications, delete account |

## 4. Admin (Admin role, noindex)
| Route | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/moderation`, `/admin/moderation/[id]` | Pending queue and review |
| `/admin/reports` | Reports |
| `/admin/users`, `/admin/users/[id]` | User management |

## 5. Navigation
- **Header:** logo, search shortcut, "Post an ad" button, login/register or avatar menu (My ads, Favourites, Messages, Settings, Logout).
- **Mobile:** hamburger or bottom navigation (Home, Search, Post, Favourites, Account).
- **Footer:** About, Contact, Terms, Privacy, popular areas.

## 6. Route protection
- Account and admin route groups are protected by middleware (redirect to `/login?returnUrl=...`); the API re-enforces authorisation regardless.
- After login, users return to `returnUrl` and any interrupted action (contact, favourite) resumes.

## 7. Shared UI components (see `frontend/src/components`)
- `ui/`: Button, Input, Select, Checkbox, Modal, Toast, Badge, Tabs, Pagination, Skeleton.
- `layout/`: Header, Footer, MobileNav, Breadcrumbs.
- `listings/`: ListingCard, ListingGrid, ListingGallery, KeyFacts, AdvertiserCard, SimilarListings, ReportDialog.
- `search/`: SearchBar, FilterPanel, ActiveFilterChips, SortDropdown, ViewToggle.
- `forms/`: PostAdStepper, StepProperty, StepLocation, StepPhotos, StepDescription, StepContact, StepReview.
- `auth/`: LoginForm, RegisterForm, SocialButtons, RequireAuth.
- `map/`: MapView, LocationPicker.
- `admin/`: ModerationQueue, ReviewPanel, ReportTable, UserTable.

## 8. Design source
The React/Vite scaffold in `docs/design/figma_site_reference/` is the visual reference; production routes are implemented in `frontend/` using Next.js App Router. Tailwind CSS v4 design tokens are defined in `frontend/src/app/globals.css`, not a Tailwind config file.
