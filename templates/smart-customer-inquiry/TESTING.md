# Testing and acceptance checklist

`npm test` validates raw JSON duplicate keys before parsing, JSON shape, node/connection references, absence of embedded credentials and non-example endpoints, and the deterministic rule module. It covers bounded reminder retry transitions and acceptance-time schedules. It does **not** prove that a workflow runs in n8n.

## Automated scenarios

The test suite covers a valid non-ASCII sales inquiry, valid general normalization, critical/high rules, invalid email, missing field, exact duplicate, similar legitimate inquiry, overdue open inquiry, Resolved/Closed exclusion, max reminder count, waiting-for-customer pause, terminal delivery exclusion, first/second/third reminder failure, successful retry reset, acceptance-time scheduling, initial-alert retry exhaustion/recovery, recipient expression, privacy placeholder, Slack-disabled routing, and closed-state transitions. `examples/inquiries.json` contains synthetic input only. Mocked tests validate the exported configuration and helper logic; they do not validate SMTP, Form rendering, Slack, or n8n runtime behavior.

## Runtime acceptance checklist (pending an isolated n8n instance)

1. Import the JSON on n8n 2.45.0+ and confirm every built-in node resolves without migration errors.
2. Configure a test Data Table and test SMTP mailbox, submit the first synthetic sales inquiry, and confirm one New row and one alert.
3. Submit the exact payload again within 24 hours; confirm no second alert and `duplicate_suppressed` on the original row.
4. Submit the same customer with changed message; confirm a second row and alert.
5. Submit invalid email and missing-field samples; confirm the run stops before storage. The form's native required/email controls should also block ordinary browser submission.
6. Confirm the form description presents the privacy-notice link. Replace `REPLACE_WITH_YOUR_PRIVACY_NOTICE_URL` with a public test HTTPS URL, click it from the test form, and confirm the acknowledgement is required but does not request marketing consent.
7. Intentionally use a bad SMTP credential for the initial alert. Confirm the row remains stored, `initial_notification_state` becomes `retry_pending`, `initial_notification_attempts` is `1`, and `initial_notification_next_retry_at` is about 15 minutes later. After correcting SMTP, set the retry time in the past and run **Scheduled inquiry check (every 15 min)**: confirm provider acceptance, attempts increment once, retry timestamp clears, and reminder stage/count remain unchanged. Repeat failures through attempt 3 to confirm terminal `initial_notification_failed` and no later automatic initial-alert retry.
8. Submit the outage sample and verify High; use a Complaint containing both `data loss` and `legal escalation` to verify Critical.
9. Make an open `New` record overdue by setting `next_reminder_due_at` in the past, then manually run the schedule branch. First inspect **Explain reminder eligibility**: it outputs `reminder_eligible`, `reminder_action`, and `reminder_skip_reason` for every row. Confirm a provider-accepted send increments `reminder_stage`, increments `reminder_count`, and advances `next_reminder_due_at`.
8. Repeat until stage 3. Confirm its action is `escalation` and that it uses the configured escalation recipient. If it should go to the normal team, deliberately configure the escalation placeholder with that same internal address. Confirm Waiting for customer, Resolved, and Closed have an explanatory skip reason.
9. Intentionally use a bad SMTP credential for a reminder. Confirm **Record reminder retry pending** retains its stage/count, records `retry_pending`, increments `reminder_retry_count`, captures a bounded error message, and moves its next due time one hour forward. Repeat twice: at the third failed attempt, confirm `delivery_failure_state` and `notification_state` are `delivery_failed`, `next_reminder_due_at` is empty, and later schedule runs skip the row. Restore credentials before re-testing, then use the recovery steps in SETUP to resume without lowering the completed stage.
10. For a delayed-send timing test, set a due time well in the past, execute a successful reminder at a known current time, and verify the following due time is the priority interval after the actual acceptance timestamp—not after the old due time.
11. Confirm **Slack enabled for High/Critical?** routes to SMTP while false. Optionally, in an isolated workspace, attach a Slack credential, set a test channel, enable the disabled Slack node, change the condition to true, and submit a High or Critical item. Confirm Normal/Low do not use Slack and, with an intentionally bad Slack credential, confirm SMTP still receives the alert because the Slack node continues on failure.
12. Intentionally use a bad SMTP credential for intake. Confirm the row stays stored and its outcome is failed. Restore the credential and retry the specific action after inspecting the row.
13. Temporarily replace the Data Table ID with an invalid ID. Confirm execution error visibility and no false success. Restore it.
14. Trigger two schedule executions manually with the same overdue row and record observed behavior. The template documents that concurrent reminders are not guaranteed once-only.

## Expected constraints

There is no authorized isolated n8n runtime bundled with this repository, so import/execution validation is pending. This template deliberately makes no claim of exactly-once storage, atomic duplicate detection, or successful email delivery during a provider outage.
