# Vaylance: Radar-led opportunity workflow

## Goal
Make Job Radar the starting point for finding a company, identifying whom to approach, preparing a relevant pitch and resume, and following through. Keep the existing visual design and working tools; replace standalone tools only after their connected alternatives pass testing.

This roadmap improves the workflow and breadth of use cases. It does not promise 80% occupational coverage, confirmed hiring, or an 80% success rate.

## What already exists
- Radar carries company news, source links, likely roles, matching explanations, and hiring-window estimates.
- Cards already offer editable outreach, a generic LinkedIn search, opening checks, feedback, and saving to Mission Control.
- Resume + ATS accepts posted job descriptions; Interview Coach can use a saved resume.
- Mission Control saves applications but does not yet track a complete outreach sequence.
- Scheduled Radar ingestion runs every six hours. That is not real-time monitoring.

## Phase 1 — Targeted outreach inside Radar
**First implementation milestone.**

- Replace the generic contact search with three role-mapped searches: the relevant department leader, a talent/recruitment lead, and an appropriate senior hiring leader. Adapt titles to company size and occupation rather than assuming every company has a VP.
- Provide an editable connection note for each contact category, plus separate three-sentence LinkedIn DM and cold-email drafts.
- Reference the actual event: acquired company, expansion location, contract award, or funding round. Link back to its source and preserve cautious language about possible hiring.
- Use skills and achievements explicitly supplied by the user or supported by their resume. The current role-based examples, such as Python, must not be presented as the user's actual skills. Ask for one genuine strength when evidence is missing.
- Offer an optional signal-aligned headline/bio snippet without automatically editing the user's profile.
- Save the selected opportunity and pitch to Mission Control, retaining the source and event context after a fresh scan clears feed alerts.

**Acceptance:** a signed-in tester opens a real signal, chooses a relevant contact search, edits/copies both pitch formats, and saves the same opportunity without duplicates. Searches are labelled as searches—not verified people or discovered email addresses.

## Phase 2 — Resume tailoring without a posted vacancy
- Add “Tailor resume” to a Radar opportunity, carrying its company, source, likely role, growth stage, and event into Resume + ATS.
- Ask the user to confirm the target role and upload/select their PDF or DOCX resume.
- Keep two distinct modes: posted-job ATS analysis and predictive signal-based tailoring.
- In predictive mode, show inferred priorities and evidence limits; do not invent a job description or present an ATS keyword score as if a vacancy exists.
- Preserve the current DOCX improvement/review/export flow and show changes for approval. Never invent experience, qualifications, or results.

**Acceptance:** tailor a real uploaded resume from a Radar signal, review changes, download DOCX/PDF, and confirm saved context survives navigation and feed refresh. Separately verify the existing posted-job ATS flow still works.

## Phase 3 — Value proposals and relevant interview practice
- Add a 30–60–90-day value-pitch builder using the selected signal, the user's strengths, and any learning needs.
- Produce an editable one-page proposal with specific actions, suggested outcomes, and assumptions—not guaranteed business results.
- Extend Interview Coach with the same company/event context so practice focuses on plausible operational challenges. Clearly distinguish inferred practice scenarios from real interview questions.
- Keep standalone skill analysis available until the proposal replacement is useful and tested.

**Acceptance:** generate a proposal and practice session for the same saved opportunity; both reference the real event and user-supported experience.

## Phase 4 — Active outreach pipeline
- Extend Mission Control with outreach stages, contact/category, channel, draft, sent date, reply, and next action while preserving existing applications.
- Start follow-up reminders 4 and 9 days after the user marks a pitch sent—not when a company is saved. Stop reminders on replies, closure, or opt-out; avoid duplicate notifications.
- Add optional revocable resume/portfolio share links. Sharing is explicitly enabled by the owner, not public by default.
- Report link visits as visits only: email scanners, bots, and shared links mean a visit does not prove a hiring manager read the resume. Do not claim tracking of LinkedIn views or ordinary attachments.
- Provide deletion, expiry, and clear privacy controls for shared documents and activity.

**Acceptance:** send-date entry schedules both reminders; a reply cancels pending reminders; another account cannot access private documents; revoked links stop working.

## Phase 5 — Opt-in signal alerts
- Begin with email through the existing system-email service, with opt-in, unsubscribe, quiet-time/frequency settings, and deduplication.
- Notify only for newly eligible signals with a match strictly greater than 80%, sufficient supporting preferences, and source/trust checks. Keep news confidence separate from personal fit.
- Match scheduled alerts against saved preferences, not generic company news. Limited-evidence/example matches must not trigger high-fit alerts.
- Use daily digests initially, or notify after each ingestion run if selected. With today's six-hour ingestion, call these “new signal alerts,” not instant or real-time alerts.
- Add Telegram and WhatsApp later, after confirming provider availability, consent requirements, operating costs, and delivery testing. Faster monitoring is a separate change, not included in this plan.

**Acceptance:** a qualifying new signal delivers one email to an opted-in tester; an exactly 80% score, insufficient-evidence signal, duplicate, or opted-out account delivers none.

## Phase 6 — Simplify navigation and positioning
- Once the connected flows are tested, remove standalone LinkedIn Optimizer navigation and any standalone Cover Letter entry that actually exists. Preserve saved content and retain posted-job cover letters where they remain useful.
- Present the core journey as Radar → Pitch → Prepare → Follow through, rather than a collection of unrelated generators.
- Update homepage examples, dashboard labels, README, and mobile navigation together. Use real product captures or explicitly labelled examples; no invented outcomes or abilities.
- Leave Salary Intelligence and unrelated working tools unchanged unless separately requested.

## Technical approach
- Introduce a persisted, user-owned opportunity context shared by Radar, Resume + ATS, Interview Coach, and Mission Control. Keep source/event snapshots so scans do not erase saved work.
- Reuse existing Supabase-backed records and functions where practical; add focused outreach, reminder, sharing, and notification records only where needed. Enforce ownership and input validation server-side.
- Use the project's existing AI model conventions, Stripe configuration, semantic design tokens, and system-email service. Keep secrets server-side.
- Keep the temporary free-beta access unchanged. Do not restart billing or automatic promotional Pro grants.
- Use scheduled jobs and idempotent delivery records for reminders/alerts; do not automatically send cold outreach on the user's behalf.
- Validate additions through targeted rule tests, signed-in end-to-end flows, mobile/desktop checks, and security checks before deprecating old tools.

## Rollout and validation
Ship Phase 1 first, then evaluate it with five active job seekers before advancing. Track useful-signal ratings, edited/copied pitches, saved opportunities, user-recorded replies, interviews, and drop-off. Copies are not sent messages; visits are not confirmed reads.

The first release is complete only when the live signed-in outreach-to-Mission-Control flow passes. Later phases remain separate milestones; new messaging services may require permission, setup, or paid provider access.