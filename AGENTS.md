# Project architecture decisions

- Keep the homepage product-led: the hero renders a live in-app preview (sidebar, opportunity feed, metrics) instead of stock photography, so visitors see the real product.
- Use one shared VaylanceLogo component for in-app brand marks so the public site and dashboard stay visually consistent.
- Calculate Job Radar fit from explicit role, industry, location/work-style, and seniority dimensions so scores remain explainable and calibrated.
- Background Radar scans run via pg_cron calling radar-scan with a vault-stored token checked by `verify_radar_cron_token`, so no secret lives in code and user scans stay quota-gated.
- Keep Radar outreach construction in shared pure helpers and save source/event snapshots plus edited pitches in owner-scoped application notes so feed refreshes cannot erase saved opportunities; do not infer user skills from job titles.