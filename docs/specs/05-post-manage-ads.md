# 05 - Post and Manage Ads

Requires login and verified email.

## 1. Ad lifecycle
```
Draft -> Pending -> Live -> Expired
            |         |-> Sold/Rented
            |-> Rejected -> (edit) -> Pending
Live -> (edit sensitive fields) -> Pending (re-review)
Any -> Deleted (soft delete)
```

## 2. Post-an-ad flow (multi-step form)
1. **Property details:** listing type, property type, bedrooms, bathrooms, floor area, furnishing, tenure, available date.
2. **Location:** address search/autocomplete, map pin adjustable, option to hide exact address (show area only).
3. **Photos:** upload, reorder, choose cover, delete (see 06-images.md).
4. **Description and price:** title, description, price, price period (rent), amenities.
5. **Contact:** display name, phone (optional), preferred contact (enquiry form, phone, both).
6. **Review and publish:** summary preview of the public page and a terms checkbox.

### Requirements
- **FR-POST-01:** Form is a stepper with a progress indicator and back/next navigation.
- **FR-POST-02:** Draft is auto-saved after each step and resumable from "My ads".
- **FR-POST-03:** Inline validation with clear messages; the final submit re-validates everything on the server.
- **FR-POST-04:** Required fields: listing type, property type, location, price, title, description, at least 1 photo, contact preference.
- **FR-POST-05:** Title 10-100 characters; description 50-5000 characters.
- **FR-POST-06:** Price must be a positive number within configured limits.
- **FR-POST-07:** Contact details inside title/description (emails, phone numbers, URLs) are flagged for moderator attention.
- **FR-POST-08:** On submit, status becomes `Pending` and the user sees a confirmation that review is in progress, with expected review time.
- **FR-POST-09:** Rate limit: max 5 new ads per user per day (configurable); new accounts max 2 live ads until first ad is approved.
- **FR-POST-10:** Duplicate detection: warn if the same user has another live ad with identical address and price.

## 3. Manage ads ("My ads")
- **FR-MANAGE-01:** List of own ads with cover image, title, price, status tag, views count, enquiries count, expiry date.
- **FR-MANAGE-02:** Filter by status; search by title.
- **FR-MANAGE-03:** Actions by status:

| Status | Available actions |
|---|---|
| Draft | Continue editing, delete |
| Pending | View, withdraw to draft |
| Live | View, edit, mark sold/rented, pause, delete, renew early |
| Expired | Renew, delete |
| Rejected | View reason, edit and resubmit, delete |
| Paused | Resume, delete |

- **FR-MANAGE-04:** Editing price, photos or description of a live ad is allowed. Changes to listing type, address or title trigger re-review; other edits go live immediately.
- **FR-MANAGE-05:** Ads expire automatically after 60 days; owner receives email reminders at 7 days and 1 day before expiry.
- **FR-MANAGE-06:** Renewing resets the expiry to 60 days from the renewal date (no re-review if unchanged).
- **FR-MANAGE-07:** Deleting an ad is a soft delete; the public URL returns `410`.
- **FR-MANAGE-08:** Owner sees basic stats: views and enquiries per ad.

## 4. Notifications (email)
- Ad submitted (confirmation), approved, rejected (with reason), expiring soon, expired.

## 5. Acceptance criteria
- Given a user submits a complete ad, then the ad status is `Pending` and it is not visible publicly.
- Given an owner edits the title of a live ad, then the ad returns to `Pending` and is hidden until re-approved.
- Given a user with unverified email opens `/post-ad`, then they are asked to verify their email first.
