# Changelog

## v1.1.2 — Initial-alert reliability and privacy patch

- Added a separate, bounded initial-notification retry lane using the existing scheduler: three total SMTP attempts at 15-minute intervals, with terminal `initial_notification_failed` state.
- Kept initial-alert retries independent of reminder count, reminder stage, escalation, and duplicate-inquiry handling.
- Added visible privacy-notice URL placeholder and acknowledgement wording that explicitly excludes marketing consent.
- Updated the overview/version references, typed schema, setup, runtime acceptance checklist, publication metadata, and automated validation.

## v1.1.1 — Final quality patch

- Removed the duplicate raw `toEmail` key from the follow-up SMTP node and added a raw-JSON duplicate-key test that runs before normal JSON parsing.
- Bounded reminder delivery attempts to three failed sends (including the original failed attempt), with durable retry audit fields and terminal `delivery_failed` state.
- Scheduled each later reminder from actual SMTP provider acceptance time instead of the prior due timestamp.
- Documented terminal-failure recovery, privacy-notice configuration, elapsed-time/timezone semantics, and the deliberate all-row diagnostic Data Table read.
- Expanded automated coverage for retry, terminal failure, acceptance-time scheduling, recipient selection, and Slack-safe defaults.

## v1.1 — Smart Customer Inquiry & Follow-Up Manager

- Added visible priority routing for Critical, High, Normal, and Low inquiries.
- Added optional disabled-by-default Slack path for High/Critical alerts.
- Reworked duplicate auditing to retrieve one matching Data Table row and update by native row ID instead of a broad fingerprint update.
- Added persisted multi-stage follow-up fields, escalation state, next-due scheduling, and retry-pending state.
- Added visible reminder-eligibility output with skip explanations.
- Added distinct success and failure reminder recording paths.
- Documented typed Data Table schema, optional Slack setup, escalation setup, and runtime acceptance checks.

## Runtime status

Static validation is complete. Import/execution validation in an isolated n8n 2.46.7+ environment with test SMTP and optional Slack credentials remains required before publication.
