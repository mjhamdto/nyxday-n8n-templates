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

This template provides a customer-facing inquiry form and a pragmatic operational queue. It normalizes and validates submissions, calculates transparent rule-based priority, suppresses exact duplicate alerts inside a configurable elapsed-hour window, stores new inquiries in n8n Data Tables, and sends internal SMTP alerts. A visible Switch routes each priority; an optional disabled Slack path can be enabled for High/Critical items. An hourly schedule re-reads durable records, explains eligibility per record, runs staged elapsed-hour reminders, and records the next due state. It never sends marketing email to a submitted contact.

Users create their own Data Table, attach an SMTP credential, configure example values, and test before publishing. The canvas includes an overview plus compact section notes covering setup, intake, rules, reminders, and recovery. This package is ready for Creator Hub review after runtime import validation and replacement of the repository reference; it is not submitted or approved.
