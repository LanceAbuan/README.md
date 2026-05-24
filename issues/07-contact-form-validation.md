# Issue #7: Contact Form Client-Side Validation & Accessibility

**Type:** Feature / Accessibility  
**Priority:** High  
**Status:** Open

## Description

The contact form currently relies on basic HTML5 validation (`required` attributes) and server-side checks. Add robust client-side validation with real-time feedback and full accessibility support.

## Proposed Implementation

- Add email format validation (regex or `HTML5 email` type enhancement)
- Add minimum message length validation (e.g., 10 characters)
- Add maximum length limits to prevent abuse (name: 100, email: 254, message: 2000)
- Show inline validation errors below each field in real-time (on blur + after first change)
- Add `aria-invalid` and `aria-describedby` for screen reader support
- Disable submit button when form is invalid
- Add a character counter for the message textarea

## Acceptance Criteria

- [ ] Email field validates format on blur
- [ ] Message has min/max length validation with visible feedback
- [ ] Inline error messages appear below invalid fields
- [ ] Submit button is disabled when form has errors
- [ ] Character counter shows remaining characters for message
- [ ] Screen readers announce validation errors
- [ ] Server-side validation still acts as a safety net
