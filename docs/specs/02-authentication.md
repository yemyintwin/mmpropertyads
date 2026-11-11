# 02 - Authentication and Account

## 1. Approach
ASP.NET Core Identity (users stored in the application database) with external login providers (Google, Facebook). Session is a secure HttpOnly cookie. If frontend and API end up on separate unrelated domains, switch to short-lived bearer tokens with refresh (decision tracked in `docs/decisions`).

## 2. Functional requirements

### Registration
- **FR-AUTH-01:** User can register with email and password.
- **FR-AUTH-02:** Password minimum length 10 characters; no forced complexity rules; common-password check applied.
- **FR-AUTH-03:** After registration, a verification email with a time-limited link (24 hours) is sent.
- **FR-AUTH-04:** Registration form includes bot protection (CAPTCHA/Turnstile).
- **FR-AUTH-05:** Email addresses are unique (case-insensitive).

### Login
- **FR-AUTH-06:** User can log in with email and password.
- **FR-AUTH-07:** Failed logins trigger lockout after 5 attempts for 15 minutes.
- **FR-AUTH-08:** "Remember me" extends the session lifetime (default session 12 hours; remembered 30 days).
- **FR-AUTH-09:** Logout invalidates the session cookie.

### Social login
- **FR-AUTH-10:** User can sign in or sign up with Google.
- **FR-AUTH-11:** User can sign in or sign up with Facebook.
- **FR-AUTH-12:** If a social login email matches an existing local account, accounts are linked only when the provider reports the email as verified; otherwise the user is asked to log in with their password first and link from settings.
- **FR-AUTH-13:** Social sign-ups are treated as email verified when the provider asserts verification.
- **FR-AUTH-14:** Users can link or unlink social providers from account settings (cannot unlink the last remaining login method).

### Password and email management
- **FR-AUTH-15:** Forgot password sends a time-limited reset link (1 hour) and never reveals whether the email exists.
- **FR-AUTH-16:** Resetting a password invalidates existing sessions.
- **FR-AUTH-17:** User can change password and display name from settings.
- **FR-AUTH-18:** User can resend the verification email (rate limited).
- **FR-AUTH-19:** User can delete their account; their ads are removed and personal data erased within 30 days (see non-functional spec).

### Optional (Phase 2)
- **FR-AUTH-20:** Authenticator-app MFA (TOTP) for users and mandatory for admins.

## 3. Screens
Login, Register, Forgot password, Reset password, Verify email, Account settings (profile, password, linked accounts, delete account).

## 4. Security rules
- Cookies: `HttpOnly`, `Secure`, `SameSite=Lax` (or `None` only if cross-site is unavoidable, with antiforgery tokens).
- Antiforgery/CSRF protection on state-changing requests.
- Rate limits on login, register, forgot password and resend verification.
- Passwords hashed by ASP.NET Core Identity defaults; never logged.
- Social provider secrets stored in Key Vault.

## 5. Acceptance criteria
- Given a new visitor registers, when they click the verification link within 24 hours, then the account becomes verified and they can post ads.
- Given 5 failed password attempts, when the user tries a 6th time within 15 minutes, then login is refused with a lockout message.
- Given a user with a local account `a@x.com` and an unverified-email social login for the same address, then no automatic linking happens.
