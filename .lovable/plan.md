# Remaining dashboard tool redesign

## Direction
Match the supplied Vaylance mockup across the remaining signed-in tools: warm white canvas, compact forest-green actions, thin borders, clear labels, and practical two-column work areas. Keep all current data, quotas, saved history, forms, and AI actions working exactly as they do now.

## Preserve unchanged
- Dashboard home
- Job Radar
- Resume + ATS workflow and scoring interface
- Existing sidebar, header, mobile navigation, database behavior, and usage limits

## Redesign
1. **Shared tool shell**
   - Add a reusable page heading and restrained panel treatment so every tool aligns to the same width, spacing, typography, border, input, tab, and action hierarchy.
   - Remove legacy gradients, glass effects, oversized centered headings, emoji UI, and isolated brand-blue treatments from these screens.

2. **Job Search**
   - Compact search and filter row above a readable results list.
   - Keep live search behavior, job details, logos, dates, and external Apply actions.

3. **Interview Coach**
   - Preserve Practice, Copilot, Tips, and History modes.
   - Make setup a clear left-side control panel with questions or feedback on the right, using consistent segmented tabs and difficulty controls.
   - Replace emoji tip icons with Lucide icons.

4. **Skill Gap Analyzer**
   - Use a focused input panel beside a result preview.
   - Present match percentage, matched skills, missing skills, and learning recommendations with compact semantic status treatments.

5. **LinkedIn Optimizer**
   - Use current-content and optimized-output columns, with section tabs and one obvious Generate action.
   - Keep optimization history and copy/delete actions; replace hardcoded LinkedIn blue with the Vaylance design tokens.

6. **Salary Intelligence**
   - Keep the existing inputs and generated benchmark/negotiation data.
   - Prioritize role/location inputs, salary range, market position, and negotiation output in a compact comparison layout.

7. **Application Tracker, Settings, Billing, and Help**
   - Restyle the application board with compact columns and accessible status labels.
   - Simplify Settings into clear profile, preferences, notifications, security, and account sections without glass cards or oversized headings.
   - Align Billing cards and usage information with the same hierarchy.
   - Replace the sparse Help screen and emoji headings with two clear support options.

8. **Verification**
   - Check type safety and preview build output.
   - Verify the major tools at desktop and mobile widths where public/session state allows.
   - Confirm no horizontal overflow, clipped controls, raw hardcoded colors, or altered Resume + ATS code.

## Technical details
- React, Tailwind, shadcn/ui, semantic tokens, and existing Work Sans/Instrument Serif typography remain authoritative.
- Changes are presentation-only except for small accessibility corrections such as button labels and removing emoji structural icons.
- No new product features or database changes are included.
