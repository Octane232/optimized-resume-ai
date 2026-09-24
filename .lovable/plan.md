# Consistent Vaylance design system

## Goal
Make every public page, account screen, legal page, and signed-in tool use the same warm-white and forest-green visual language already established on the homepage and dashboard.

## What will change
- Make the warm Vaylance palette the global default so all routes share the same background, text, border, input, status, and action colors.
- Standardize typography, section widths, spacing, page headings, cards, buttons, inputs, tabs, badges, empty states, loading states, and focus styles.
- Remove remaining legacy blue/purple gradients, glass effects, decorative glows, hardcoded interface colors, oversized shadows, and inconsistent corner radii.
- Align sign-in, password reset, About, Contact, student/individual pages, legal pages, 404, billing, and all dashboard tools with the same visual system.
- Preserve intentional brand colors where accuracy matters, such as the official Google sign-in icon and verified company logos.
- Keep all existing product behavior, authentication, payments, quotas, scoring, AI features, and data flows unchanged.

## Verification
- Check every reachable public route at desktop and mobile sizes.
- Check dashboard source patterns and the authenticated shell without altering gated behavior.
- Confirm no horizontal overflow, broken controls, console errors, or build errors.

## Technical notes
- Use semantic design tokens and existing shared components instead of page-specific hardcoded colors.
- Consolidate repeated presentation rules in the global theme and shared UI components where practical.
- Retain responsive and reduced-motion behavior.
