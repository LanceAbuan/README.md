# Issue #5: Resume Download with File Generation

**Type:** Feature  
**Priority:** Medium  
**Status:** Open

## Description

Replace the static `/resume.pdf` download link with a dynamically generated resume built from the existing `experience.ts`, `skills.ts`, and `about.ts` data files. This ensures the resume always stays in sync with the site content.

## Proposed Implementation

- Create a server-side API route (`/api/resume`) that generates a PDF on demand
- Use a library like `@react-pdf/renderer` or `pdf-lib` to structure the PDF
- Pull data from the existing `data/` files (experience, skills, education, contact)
- Cache the generated PDF for a configurable duration (e.g., 1 hour) to avoid regeneration on every request
- Keep the navbar download button, but point it to the API route instead of a static file

## Acceptance Criteria

- [ ] `/api/resume` returns a generated PDF
- [ ] PDF includes all experience entries, skills, and contact info
- [ ] Data comes from the existing `data/` files (no duplicate content)
- [ ] PDF is cached to avoid regeneration spam
- [ ] Download button in navbar continues to work
