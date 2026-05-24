# Issue #9: Lightweight Self-Hosted Analytics

**Type:** Feature  
**Priority:** Medium  
**Status:** Open

## Description

Add a lightweight, privacy-respecting analytics system to track page views and popular blog posts without third-party trackers like Google Analytics.

## Proposed Implementation

- Create a `/api/analytics` endpoint that logs page views to a local JSON file or lightweight database
- Track: page path, timestamp, referrer, country (from IP, optional)
- Client-side: send a `navigator.sendBeacon` or fetch on route change
- Create a simple dashboard page (`/analytics`) protected by a query parameter or basic auth
- Display: total page views, unique visitors, top pages, traffic over time (simple chart)
- Do NOT track personal data or use cookies

## Acceptance Criteria

- [ ] Page views are logged to a lightweight storage backend
- [ ] Analytics dashboard page displays view counts and top pages
- [ ] No third-party trackers or cookies used
- [ ] GDPR/privacy compliant (no PII collected)
- [ ] Dashboard access is restricted (basic auth or secret parameter)
