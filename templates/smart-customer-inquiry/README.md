# Smart Customer Inquiry & Follow-Up Manager

A free n8n template for small businesses that need a structured intake form, transparent priority rules, durable inquiry tracking, internal alerts, and limited follow-up reminders. It suits agencies, consultants, contractors, retailers, and professional services without sending marketing email to customers.

```text
Customer form → validate/classify → Data Table duplicate check → store → internal SMTP alert
                                  ↘ duplicate activity only (no second alert)
Hourly schedule → read Data Table → eligible open items → internal SMTP reminder → record outcome
```

## Requirements

- n8n **2.45.0+** (the current schedule behavior is documented from this release) with the built-in Form Trigger, Data Table, Schedule Trigger, Code, and Send Email nodes.
- A project Data Table and an SMTP credential. Data Tables and the Form Trigger are built in; SMTP is the sole external service and may be a paid or free provider depending on your provider.
- A publicly reachable n8n URL only when using the public production form. No AI, community node, paid API, or enterprise feature is required.

## Capabilities

- Required form fields, server-side re-validation, email syntax checking, safe text handling, trimming, and length limits.
- Deterministic category/urgency priority: Critical, High, Normal, or Low; a lone ambiguous `urgent` never produces Critical.
- Duplicate suppression by normalized email + subject + message inside a 24-hour default window. The existing row gets `duplicate_suppressed` activity; repeated legitimate messages differ in fingerprint and are stored.
- Durable status lifecycle: New → Acknowledged → In progress → Waiting for customer → Resolved → Closed.
- Internal alerts and elapsed-hour reminders (Critical 1, High 4, Normal 24, Low 48), capped at three. Resolved and Closed rows never qualify.

## Important limits

Data Tables are appropriate for light/moderate operational tracking, not a CRM. Their default instance-wide storage limit is 200 MiB. They are project-scoped and accessible to project members. The check-then-insert duplicate flow is not atomic: simultaneous identical submissions can both be treated as new. The schedule also has no distributed lock, so overlapping manual/scheduled runs can duplicate a reminder. Operators should avoid manual edits during a run and use an external database with unique constraints/leases if strict concurrency guarantees are required.

This template uses elapsed hours, not business-hour calculations. SMTP failure is recorded after the inquiry is stored, but no separate Error Trigger workflow is included; use n8n Executions to inspect and retry failures.

## Quick start

Follow [SETUP.md](SETUP.md), then see [CONFIGURATION.md](CONFIGURATION.md), [TESTING.md](TESTING.md), and the [publication package](publication.md). The exported workflow contains no credentials, live URLs, or customer data.

## Maintainer and license

NyxDay Inc. — [nyxday.com](https://nyxday.com). Released under [MIT](../../LICENSE).
