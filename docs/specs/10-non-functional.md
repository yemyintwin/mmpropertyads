# 10 - Non-Functional Requirements

## 1. Performance
- **NFR-PERF-01:** API p95 latency under 300 ms for read endpoints, under 800 ms for writes (excluding image processing).
- **NFR-PERF-02:** Public page TTFB under 600 ms from CDN cache, under 1.5 s on cache miss.
- **NFR-PERF-03:** Search queries use indexed columns; pagination uses keyset or limited offset.

## 2. Scalability
- **NFR-SCALE-01:** Initial target: 10,000 live ads, 5,000 daily visitors, 50 concurrent requests.
- **NFR-SCALE-02:** Stateless API (cookie session data protected with shared keys in Key Vault/Blob) so instances can scale horizontally.
- **NFR-SCALE-03:** Architecture allows adding a search service and cache without API contract changes.

## 3. Availability and reliability
- **NFR-AVAIL-01:** Target 99.5% monthly availability for MVP.
- **NFR-AVAIL-02:** Database backups with point-in-time restore (at least 7 days); blob soft delete enabled.
- **NFR-AVAIL-03:** Health endpoints (`/health/live`, `/health/ready`) for platform probes.
- **NFR-AVAIL-04:** Transient failures retried with backoff (database, email, storage).

## 4. Security
- **NFR-SEC-01:** HTTPS everywhere, HSTS, TLS 1.2+.
- **NFR-SEC-02:** OWASP Top 10 mitigations: parameterised queries (EF Core), output encoding, CSRF protection, strict CORS allowlist, security headers (CSP, X-Content-Type-Options, Referrer-Policy, frame protection).
- **NFR-SEC-03:** Rate limiting on auth, posting, enquiry and upload endpoints; global per-IP limits.
- **NFR-SEC-04:** Secrets in Azure Key Vault accessed via managed identity; none in source control.
- **NFR-SEC-05:** Server-side validation on all inputs; authorisation checked on every write.
- **NFR-SEC-06:** Dependency and container scanning in CI (for example Dependabot, CodeQL).
- **NFR-SEC-07:** Audit log for admin actions and security events.
- **NFR-SEC-08:** Bot protection (CAPTCHA) on registration, login after failures, and posting for new accounts.
- **NFR-SEC-09:** Optional WAF (Front Door) once traffic or abuse justifies it.

## 5. Privacy and compliance
- **NFR-PRIV-01:** Collect only necessary personal data (name, email, optional phone).
- **NFR-PRIV-02:** Privacy policy, terms of use and cookie notice available; consent captured at registration.
- **NFR-PRIV-03:** Account deletion removes personal data within 30 days; moderation/audit records retain minimal identifiers where legally required.
- **NFR-PRIV-04:** Advertiser phone numbers and emails not exposed to anonymous users or in page source.
- **NFR-PRIV-05:** Comply with applicable local data-protection law for the target market (to be confirmed, assumption A1).

## 6. Accessibility
- **NFR-A11Y-01:** WCAG 2.1 AA target: keyboard navigation, visible focus, sufficient contrast, labelled forms, alt text, ARIA only where needed.
- **NFR-A11Y-02:** Touch targets at least 44 px on mobile.

## 7. Compatibility and responsiveness
- Latest two versions of Chrome, Safari, Edge, Firefox; iOS Safari and Android Chrome.
- Responsive breakpoints: mobile 360-767, tablet 768-1023, desktop 1024 and above.

## 8. Observability
- **NFR-OBS-01:** Structured logging with correlation IDs; no secrets or PII in logs.
- **NFR-OBS-02:** Application Insights for requests, dependencies, exceptions and key business events (ad posted, enquiry sent).
- **NFR-OBS-03:** Alerts on error rate, latency, failed background jobs and budget thresholds.

## 9. Maintainability
- **NFR-MAINT-01:** Clean layered backend (Domain, Application, Infrastructure, Api) with unit and integration tests.
- **NFR-MAINT-02:** OpenAPI spec generated from the API; typed client generated for the frontend.
- **NFR-MAINT-03:** Infrastructure as code (Bicep); environments: local, staging, production.
- **NFR-MAINT-04:** CI runs build, tests, lint and security scans on every pull request; CD deploys staging automatically and production on approval.

## 10. Cost
- **NFR-COST-01:** Use serverless/low-tier services at launch; budget alerts at 50%, 80%, 100% of monthly budget.
- **NFR-COST-02:** CDN caching and image variants to limit bandwidth.
