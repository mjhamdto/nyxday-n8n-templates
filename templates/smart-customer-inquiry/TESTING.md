# Testing and acceptance checklist

`npm test` validates JSON shape, node/connection references, absence of embedded credentials and non-example endpoints, and the deterministic rule module. It does **not** prove that a workflow runs in n8n.

## Automated scenarios

The test suite covers a valid non-ASCII sales inquiry, valid general normalization, critical/high rules, invalid email, missing field, exact duplicate, similar legitimate inquiry, overdue open inquiry, Resolved/Closed exclusion, max reminder count, and closed-state transitions. `examples/inquiries.json` contains synthetic input only.

## Runtime acceptance checklist (pending an isolated n8n instance)

1. Import the JSON on n8n 2.45.0+ and confirm every built-in node resolves without migration errors.
2. Configure a test Data Table and test SMTP mailbox, submit the first synthetic sales inquiry, and confirm one New row and one alert.
3. Submit the exact payload again within 24 hours; confirm no second alert and `duplicate_suppressed` on the original row.
4. Submit the same customer with changed message; confirm a second row and alert.
5. Submit invalid email and missing-field samples; confirm the run stops before storage. The form's native required/email controls should also block ordinary browser submission.
6. Submit the outage sample and verify High; use a Complaint containing both `data loss` and `legal escalation` to verify Critical.
7. Make an open record overdue and manually run the schedule branch. First inspect **Explain reminder eligibility**: it outputs `reminder_eligible` and `reminder_skip_reason` for every row. Confirm exactly one reminder count increment for an eligible item. Set Resolved and Closed separately, rerun, and confirm the reason explains why none is sent.
8. Intentionally use a bad SMTP credential. Confirm the row stays stored and notification state is failed. Restore the credential and retry the specific action after inspecting the row.
9. Temporarily replace the Data Table ID with an invalid ID. Confirm execution error visibility and no false success. Restore it.
10. Trigger two schedule executions manually with the same overdue row and record observed behavior. The template documents that concurrent reminders are not guaranteed once-only.

## Expected constraints

There is no authorized isolated n8n runtime bundled with this repository, so import/execution validation is pending. This template deliberately makes no claim of exactly-once storage, atomic duplicate detection, or successful email delivery during a provider outage.
