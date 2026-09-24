# Job Radar company logos

## Goal
Show real company logos throughout Job Radar and its dashboard previews, while avoiding broken images or confidently displaying the wrong company.

## Changes
1. **Connect Logo.dev**
   - Link the frontend Logo.dev connection and use its publishable browser key.
   - Keep the key in the project connection settings rather than hardcoding it.

2. **Capture the company domain**
   - Add a nullable `company_domain` field to Radar signals.
   - Update Radar analysis to return a company’s official domain when the article provides enough evidence.
   - Normalize domains to a safe hostname and reject news-site URLs, social profiles, malformed values, and uncertain guesses.
   - Update existing signal records when a later scan resolves a trustworthy domain.

3. **Return logo-ready Radar data**
   - Include `company_domain` in the Radar alerts response and generated app types.
   - Keep the domain on the shared signal record so every user sees the same company identity.

4. **Reusable company logo display**
   - Add one small company-logo component that loads the official mark from Logo.dev.
   - Show a clean company-initial fallback when the domain is missing or the image fails.
   - Use meaningful alternative text and prevent image loading from shifting the layout.

5. **Apply logos everywhere Radar appears**
   - Replace letter placeholders in the main Job Radar cards.
   - Add the same logos to the dashboard’s featured Radar cards and opportunities list.
   - Preserve the existing warm visual system and compact card spacing.

6. **Verify**
   - Test known companies, missing domains, broken logo responses, similarly named companies, and mobile layouts.
   - Confirm scans still save and return signals, existing signals remain readable, and no browser or function errors are introduced.

## Technical details
- Logo image URL: `https://img.logo.dev/{company_domain}?token={publishable_key}`.
- The database stores only the official domain, not a token-bearing logo URL.
- The migration remains additive and keeps current Radar data valid.
- Logo lookup is presentation-only; Job Radar scoring and matching remain unchanged.
