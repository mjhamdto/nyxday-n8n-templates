# Smart Customer Inquiry & Follow-Up Manager v1.1.2

A free n8n template for small businesses that need a structured intake form, transparent priority rules, durable inquiry tracking, internal alerts, and limited follow-up reminders. It suits agencies, consultants, contractors, retailers, and professional services without sending marketing email to customers.

```text
Customer form → normalize/validate → duplicate check → store → priority route → SMTP alert
                                       ↘ exact matching row activity only (no second alert)
15-minute schedule → read Data Table → initial-alert retry or reminder/escalation → record durable state
```

## Requirements

- n8n **2.45.0+** with the built-in Form Trigger, Data Table, Schedule Trigger, Code, Switch, If, and Send Email nodes.
- A project Data Table and an SMTP credential. Data Tables and the Form Trigger are built in; SMTP is the sole external service and may be a paid or free provider depending on your provider.
- A publicly reachable n8n URL only when using the public production form. No AI, community node, paid API, or enterprise feature is required.

## Capabilities

- Required form fields, server-side re-validation, email syntax checking, safe text handling, trimming, and length limits.
- Deterministic category/urgency priority: Critical, High, Normal, or Low; a lone ambiguous `urgent` never produces Critical.
- Duplicate suppression by normalized email + subject + message inside a 24-hour default window. The existing row gets `duplicate_suppressed` activity; repeated legitimate messages differ in fingerprint and are stored.
- Durable status lifecycle: New → Acknowledged → In progress → Waiting for customer → Resolved → Closed.
- Visible Switch-based routing for Critical, High, Normal, and Low priorities.
- Initial internal SMTP alerts retry independently after 15 minutes when unsuccessful, with a maximum of three total attempts. A terminal initial failure is stored as `initial_notification_failed`; it never creates another inquiry, reminder, or escalation.
- Three staged elapsed-hour follow-up schedules: Critical `1/2/4`, High `4/8/24`, Normal `24/24/48`, and Low `48/48/72`. The next reminder advances only after the SMTP node reports provider acceptance; a failed send keeps its stage, retries after 60 minutes, and becomes `delivery_failed` after three failed attempts.
- Optional, disabled-by-default Slack alert path for High/Critical items. SMTP remains the default and the Slack node has no exported credential.

## Important limits

Data Tables are appropriate for light/moderate operational tracking, not a CRM. Their default instance-wide storage limit is 200 MiB. They are project-scoped and accessible to project members. The hourly check intentionally reads all rows so **Explain reminder eligibility** can show why each row was skipped; archive/delete old records or move to a database as volume grows. The check-then-insert duplicate flow is not atomic: simultaneous identical submissions can both be treated as new. The schedule also has no distributed lock, so overlapping manual/scheduled runs can duplicate a reminder. Operators should avoid manual edits during a run and use an external database with unique constraints/leases if strict concurrency guarantees are required.

This template uses elapsed hours, not business-hour calculations. The shared scheduler runs every 15 minutes so it can service initial-alert retries; normal reminders still use their durable elapsed-hour due timestamps. Each later stage is calculated from the actual SMTP provider-acceptance time, not the old due time. SMTP acceptance is not proof of inbox delivery. The base workflow exposes retry-pending and terminal failure state but does not include an Error Trigger companion; use n8n Executions and the Data Table to inspect failures.

The Form Trigger confirmation is returned only when the execution reaches its final storage/outcome-recording node. n8n's current Form Trigger doesn't provide this template with a separate, custom internal-error page; persistence/validation failures remain execution errors rather than being presented as a false confirmation. SMTP failure does not invalidate a stored inquiry, so it receives the normal confirmation and is tracked for internal retry.

## Quick start

Follow [SETUP.md](SETUP.md), then see [CONFIGURATION.md](CONFIGURATION.md), [TESTING.md](TESTING.md), and the [publication package](publication.md). The exported workflow contains no credentials, live URLs, or customer data.

The imported canvas is also self-guiding: its overview, SMTP, Data Table schema, privacy, and test notes contain the essential setup steps. The Markdown files remain the detailed operational reference.

## Maintainer and license

NyxDay Inc. — [nyxday.com](https://nyxday.com). Released under [MIT](../../LICENSE).
