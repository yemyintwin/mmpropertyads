# 08 - Moderation and Admin

Admin pages live under `/admin` and require the `Admin` role (MFA required in Phase 2).

## 1. Ad moderation queue
- **FR-MOD-01:** Queue of `Pending` ads, oldest first, with filters (new user, flagged content, re-review).
- **FR-MOD-02:** Moderator opens an ad in review mode showing all fields, photos, advertiser history and automated flags (contact info in text, duplicate suspicion, new account).
- **FR-MOD-03:** Actions: Approve, Reject (reason required from a preset list plus optional note), Request changes.
- **FR-MOD-04:** Rejection and approval trigger an email to the advertiser.
- **FR-MOD-05:** Bulk approve for trusted users (users with at least 3 previously approved ads and no violations).
- **FR-MOD-06:** Every moderation action is recorded in an audit log (who, when, what, reason).

## 2. Reports
- **FR-MOD-07:** Reports from users are listed with ad, reporter, reason and note.
- **FR-MOD-08:** Actions: dismiss, remove ad, remove ad and warn user, remove ad and suspend user.
- **FR-MOD-09:** Multiple reports on one ad are grouped; ads with 3 or more reports from different users are automatically hidden pending review.

## 3. User management
- **FR-MOD-10:** Searchable user list (email, name, status, join date, ad counts).
- **FR-MOD-11:** Suspend and unsuspend users with a reason; suspension hides their live ads and blocks login.
- **FR-MOD-12:** View a user's ads, enquiries sent (count only), and moderation history.
- **FR-MOD-13:** Admins cannot see user passwords or tokens; sensitive actions are logged.

## 4. Dashboard (basic)
- Pending ads count, reports open, new users (7 days), live ads, enquiries (7 days).

## 5. Content rules (enforced by moderation)
- No misleading or fake listings, stock-photo-only listings, or ads for properties the poster does not represent.
- No contact info in descriptions designed to bypass the platform (configurable).
- No discriminatory language; no offensive imagery.

## 6. Service levels
- Target: 90% of pending ads reviewed within 24 hours.

## 7. Acceptance criteria
- Given an admin rejects an ad with a reason, then the advertiser receives an email with the reason and the ad shows `Rejected` with the reason in "My ads".
- Given a non-admin requests an `/admin/*` API endpoint, then the response is `403`.
