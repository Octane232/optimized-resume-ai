# Vaylance full visual redesign

## Design read
A career-intelligence SaaS for job seekers who need a practical advantage, with an editorial intelligence-terminal language rather than generic “AI software” styling.

**Direction:** Overhaul · variance 7/10 · motion 4/10 · density 6/10

## What will change
- Replace blue-purple gradients, glowing blobs, glass effects, repetitive cards, fake usage claims, and the fake dashboard illustration.
- Establish one restrained system: graphite surfaces, warm white typography, a single signal-green accent, crisp 4–8px corners, strong type hierarchy, and subtle grid/noise texture.
- Rebuild the public homepage around real product evidence: Job Radar as the opening visual, a direct Radar → Resume + ATS workflow, concise proof, honest pricing, and a simplified footer.
- Restyle navigation, buttons, fields, pricing, testimonials, and calls-to-action so they feel consistent rather than assembled from templates.
- Carry the same system into the authenticated app: sidebar, mobile navigation, dashboard overview, Job Radar, and shared controls. Existing data, payments, authentication, quotas, and feature logic remain unchanged.
- Keep every layout usable on phones, tablets, and desktop, with keyboard focus states and reduced-motion support.

## Technical notes
- Work within the existing React, Tailwind, shadcn, and Framer Motion setup.
- Express all colors and surfaces through semantic tokens in the global design system.
- Use existing product data to render the homepage’s Radar demonstration instead of a static fake screenshot.
- Verify the homepage and core dashboard screens at desktop and mobile widths, then run the project checks.
