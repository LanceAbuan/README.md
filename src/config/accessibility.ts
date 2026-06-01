/**
 * Accessibility configuration constants.
 */

/** Default smooth-scroll behavior for all anchor/link navigations. */
export const SCROLL_BEHAVIOR: ScrollBehavior = "smooth";

/** ARIA label for the scroll-down arrow indicator. */
export const SCROLL_ARROW_LABEL = "Scroll down to next section";

/** ARIA label for the external-link icon on project cards. */
export const LIVE_DEMO_LABEL = "Live demo";

/** ARIA label for the GitHub icon on project cards. */
export const GITHUB_REPO_LABEL = "View on GitHub";

/** ARIA label for the mobile menu toggle button. */
export const MOBILE_MENU_LABEL = "Open menu";

/** ARIA label for the mobile menu close button. */
export const MOBILE_MENU_CLOSE_LABEL = "Close menu";

/** ARIA label for the theme selector dropdown. */
export const THEME_SELECTOR_LABEL = "Select theme";

/** Factory for ARIA labels on individual theme options. */
export const THEME_OPTION_LABEL = (label: string) => `Theme: ${label}`;

/** ARIA live region politeness for form status updates. */
export const FORM_STATUS_ARIA_LIVE: "polite" | "assertive" = "polite";

/** ARIA label for the contact form. */
export const CONTACT_FORM_LABEL = "Contact form";
