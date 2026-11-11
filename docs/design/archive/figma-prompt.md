# Figma AI Brief

Paste into Figma AI. Replace the bracketed items first. Generate one screen at a time for best results.

```
Design a modern, clean, mobile-first web UI/UX for a property advertisement platform where anyone can browse listings and registered users can post their own ads. Deliver desktop (1440px), tablet (768px) and mobile (390px) layouts with a consistent design system.

MARKET AND TONE
- Region/currency: [e.g. Singapore, SGD] | Listing types: [For sale / For rent / both]
- Style: trustworthy, bright, minimal, photo-led. Primary color [e.g. deep teal], neutral grays, one accent color for calls to action. Rounded corners, generous whitespace, clear typography (Inter or similar).

USER TYPES
1. Anonymous visitor: can search, filter, browse and view ads, but must log in to contact the advertiser, save favourites or post.
2. Registered user (advertiser): can post and manage their own ads.
3. Admin (simple moderation screens only).

KEY SCREENS
1. Home / landing
   - Hero with a large search bar (location, buy/rent, property type, price range, bedrooms) and a "Post an ad" button
   - Featured and latest listings (cards), popular areas, short "how it works" section, footer
2. Search results
   - Filter panel (price, property type, bedrooms, bathrooms, size, furnished, amenities), sort dropdown
   - Grid/list toggle, map view toggle, pagination or infinite scroll
   - Listing card: main photo, price, title, location, beds/baths/size, posted date, favourite (heart) icon
   - Empty state, loading skeletons, "save this search" prompt
3. Individual ad page
   - Photo gallery with lightbox, price and key facts (beds, baths, size, type, tenure/furnishing)
   - Description, amenities list, location map, posted date and ad reference number
   - Advertiser card with a "Contact" button (message form or reveal phone after login), share, favourite, "Report this ad"
   - Similar listings section
4. Login / sign up
   - Email + password, "Continue with Google" and "Continue with Facebook" buttons
   - Forgot password, email verification screen, clear error states
5. Post an ad (multi-step form, login required)
   - Steps: Property details > Location (with map pin) > Photos (drag-and-drop, reorder, set cover image) > Description and price > Contact details > Review and publish
   - Progress indicator, inline validation, save draft
   - Success screen stating the ad is pending approval
6. My account
   - My ads list with status tags (Draft, Pending, Live, Expired, Rejected), edit / delete / renew / mark as sold or rented
   - Favourites, saved searches, messages/enquiries, profile and password settings
7. Admin moderation
   - Table of pending ads with approve/reject, reported ads, user list

GLOBAL COMPONENTS
- Responsive header (logo, search shortcut, "Post an ad", login/avatar menu) and mobile bottom navigation or hamburger menu
- Buttons, inputs, dropdowns, chips, tags, modals, toasts, breadcrumbs, pagination, cards, form steppers, badges
- States for each: default, hover, focus, disabled, error, loading

UX REQUIREMENTS
- Logged-out users are prompted to sign in only at the moment they try to contact, favourite or post, then returned to what they were doing
- Accessible: WCAG AA contrast, visible focus states, large tap targets
- SEO-friendly page structure: clear H1/H2 hierarchy, breadcrumbs, readable URLs shown on listing pages
- Light mode only, with a note on how a dark mode could extend the design

OUTPUT
- Clickable prototype linking the main flows: browse > view ad > log in > contact; sign up > post ad > pending approval; my ads > edit
- Reusable components and color/typography styles as a design system
- Use realistic placeholder content and property photos
```

## Tips
- Paste the full brief for context, then ask for each screen separately (home, search, ad page, post-ad flow).
- Add a screenshot of a reference site to steer the look.
- After the key screens exist, request tablet/mobile versions and empty, error and loading states.
- Map design tokens (colours, type scale, spacing) into `frontend/tailwind.config.ts`.
