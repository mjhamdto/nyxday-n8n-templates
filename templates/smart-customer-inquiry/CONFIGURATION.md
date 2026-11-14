# Configuration reference

The configuration object is deliberately short and visible in the **Normalize, validate & classify (CONFIG HERE)** node. It contains no secret.

| Setting | Type / default | Permitted value / effect |
| --- | --- | --- |
| `duplicateWindowHours` | number / `24` | Positive elapsed hours. Exact fingerprints at or after this window are suppressed. |
| `defaultOwner` | string / `Unassigned` | Owner placed on new records; use a team label, not an email if possible. |
| `reminderHours.Critical` | number / `1` | Positive elapsed hours until first due time. |
| `reminderHours.High` | number / `4` | Positive elapsed hours until first due time. |
| `reminderHours.Normal` | number / `24` | Positive elapsed hours until first due time. |
| `reminderHours.Low` | number / `48` | Positive elapsed hours until first due time. |
| `maxReminders` | number / `3` | Set in **Keep eligible open inquiries**; bounds repeated internal reminders. |
| workflow timezone | IANA zone / `America/New_York` | Controls form timestamps and scheduled checks; set to the business timezone. |
| recipient/from address | SMTP node strings | Required internal addresses. SMTP credential is attached in UI, never exported. |
| categories | form dropdown + `allowed` array | Update both together. Unknown submitted values safely become `Other`. |
| urgency rules | regexes in Code node | Add precise, low-ambiguity signals. Critical requires a Complaint plus `data loss` or `legal escalation`; never add broad words alone. |

The default customer acknowledgement is only the form confirmation. Do not add a customer email unless you have chosen its transactional purpose, sender identity, consent/legal basis, and reply handling.

To change an inquiry safely, edit `status`, `assigned_owner`, `last_activity_at`, and (when resolved) `resolution_at` in the Data Tables UI. Only use the documented lifecycle. Changing an open row to Resolved or Closed prevents future reminders on the next read.
