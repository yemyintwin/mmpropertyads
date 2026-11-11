# 07 - Enquiries, Favourites and Saved Searches

## 1. Enquiries (contact advertiser)
- **FR-ENQ-01:** Logged-in verified user can send an enquiry from an ad page: message (10-1000 chars), optional phone, optional preferred viewing time.
- **FR-ENQ-02:** The advertiser receives an email notification with the enquiry content and a link to reply in "Messages". The sender's email is revealed only to the advertiser.
- **FR-ENQ-03:** Enquiries are stored and visible in both users' "Messages" pages (simple thread: enquiry and replies).
- **FR-ENQ-04:** Advertiser can reply from the site; the reply is emailed to the enquirer. Direct email replies are out of scope for MVP.
- **FR-ENQ-05:** Rate limits: max 10 enquiries per user per hour and 3 per ad per day; duplicates blocked.
- **FR-ENQ-06:** Users can mark an enquiry as read, archive it, or report the sender.
- **FR-ENQ-07:** Enquiry counts are shown on "My ads".
- **FR-ENQ-08:** Messages are scanned for obvious spam patterns (links, repeated text); suspicious messages are held for admin review.

## 2. Favourites
- **FR-FAV-01:** Logged-in users can favourite and unfavourite ads from cards and detail pages.
- **FR-FAV-02:** "Favourites" page lists favourited ads with status; expired or removed ads are shown as unavailable.
- **FR-FAV-03:** Optimistic UI toggle with rollback on failure.
- **FR-FAV-04:** Favourite counts are not shown publicly in MVP.
- **FR-FAV-05 (Phase 2):** Email the user when a favourited ad's price drops.

## 3. Saved searches (Phase 2)
- **FR-SAVE-01:** Logged-in users can save the current search filters with a name.
- **FR-SAVE-02:** Max 10 saved searches per user.
- **FR-SAVE-03:** Users choose alert frequency: none, daily, weekly.
- **FR-SAVE-04:** A scheduled job emails new matching ads since the last alert, with an unsubscribe link.
- **FR-SAVE-05:** Users can rename, edit alert frequency, run, and delete saved searches.

## 4. Email notification summary
| Event | Recipient |
|---|---|
| New enquiry | Advertiser |
| Reply to enquiry | Enquirer |
| Saved-search alerts | User |
| Ad status changes | Advertiser |
| Price drop on favourite (Phase 2) | User |

All emails include an unsubscribe/notification-settings link, except security emails (verification, reset).

## 5. Acceptance criteria
- Given an anonymous visitor taps the heart icon, then a login prompt appears; after login the ad is favourited.
- Given an enquiry is sent, then the advertiser receives an email and the enquiry appears in both users' Messages.
