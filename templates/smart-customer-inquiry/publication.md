# Creator Hub submission package

- **Title:** Smart Customer Inquiry & Follow-Up Manager
- **Short description:** Capture, prioritize, track, and follow up on customer inquiries with n8n Forms, Data Tables, and SMTP.
- **Target users:** Small-business owners and operations teams at agencies, consultancies, contractors, retailers, and professional-services firms.
- **Supported integrations:** n8n Form Trigger, Data Table, Schedule Trigger, Switch, If, Code, and Send Email (SMTP). Slack is optional, disabled by default, and requires its own credential only when enabled.
- **Categories:** Customer support; Sales; Operations
- **Tags:** customer inquiry, lead management, follow-up, form, data table, smtp, small business
- **Required credentials:** One SMTP credential for internal notifications. Data Tables require no credential but must be created in the importing project.
- **Cost:** The workflow has no paid integration requirement. n8n plan/hosting and SMTP provider costs are chosen by the user.
- **License:** MIT
- **Repository:** `nyxday-n8n-templates` (publish the actual repository URL before submission)
- **Publisher reference:** NyxDay Inc. — https://nyxday.com

## Detailed description

This template provides a customer-facing inquiry form and a pragmatic operational queue. It normalizes and validates submissions, calculates transparent rule-based priority, suppresses exact duplicate alerts inside a configurable elapsed-hour window, stores new inquiries in n8n Data Tables, and sends internal SMTP alerts. A visible Switch routes each priority; an optional disabled Slack path can be enabled for High/Critical items. A 15-minute schedule re-reads durable records, retries a failed initial internal alert up to three total attempts without changing reminder state, explains eligibility per record, runs staged elapsed-hour reminders, and records the next due state. Failed reminder sends retain their stage, retry after 60 minutes, and stop automatically after three failed attempts. Later stages are scheduled from SMTP provider acceptance time, not an older due timestamp. It never sends marketing email to a submitted contact.

Users create their own typed Data Table, attach an SMTP credential, configure example values and a real privacy-notice URL, and test before publishing. The imported canvas includes an overview plus compact setup, schema, intake, rules, reminder, and recovery notes; repository files provide the detailed reference. This package is ready for Creator Hub review after runtime import validation, privacy-link rendering verification, and replacement of the repository reference; it is not submitted or approved.

## AI-review response

The exported workflow retains the tested implementation rather than an AI-generated replacement. Generic SMTP values were replaced with valid, documented configuration addresses; credential references remain absent. The template uses one Data Table (customer_inquiries), not multiple tables. See CREATOR_HUB_COMPLIANCE.md for the detailed disposition and remaining manual checks.
