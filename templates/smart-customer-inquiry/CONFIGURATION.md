# Configuration reference

The configuration object is deliberately short and visible in the **Normalize, validate & classify (CONFIG HERE)** node. It contains no secret.

| Setting | Type / default | Permitted value / effect |
| --- | --- | --- |
| `duplicateWindowHours` | number / `24` | Positive elapsed hours. Exact fingerprints at or after this window are suppressed. |
| `defaultOwner` | string / `Unassigned` | Owner placed on new records; use a team label, not an email if possible. |
| follow-up stages in **Initialize follow-up schedule** | arrays / Critical `1,2,4`; High `4,8,24`; Normal `24,24,48`; Low `48,48,72` | Elapsed hours: first due after submission, then delay after each provider-accepted stage. Stage 3 is marked escalation. |
| `maxReminders` in **Explain reminder eligibility** | number / `3` | Bounds successful reminder/escalation stages. Failed deliveries retain the stage and retry one hour later. |
| eligible statuses in **Explain reminder eligibility** | list / New, Acknowledged, In progress | These statuses may receive internal follow-up. Waiting for customer, Resolved, and Closed are paused/stopped. |
| workflow timezone | IANA zone / `America/New_York` | Controls form timestamps and scheduled checks; set to the business timezone. |
| recipient/from address | SMTP node strings | Required internal addresses. SMTP credential is attached in UI, never exported. |
| categories | form dropdown + `allowed` array | Update both together. Unknown submitted values safely become `Other`. |
| urgency rules | regexes in Code node | Add precise, low-ambiguity signals. Critical requires a Complaint plus `data loss` or `legal escalation`; never add broad words alone. |
| Slack path | disabled / false | The **Slack enabled for High/Critical?** condition is deliberately false and its Slack node disabled. To opt in, configure a Slack credential/channel, enable the Slack node, and change that condition to true. Slack failure must be tested in a non-production workspace. |

The default customer acknowledgement is only the form confirmation. Do not add a customer email unless you have chosen its transactional purpose, sender identity, consent/legal basis, and reply handling.

To change an inquiry safely, edit `status`, `assigned_owner`, `last_activity_at`, and (when resolved) `resolution_at` in the Data Tables UI. Use New → Acknowledged → In progress → Waiting for customer/Resolved/Closed. Do not reopen Closed records. Waiting for customer pauses internal response reminders; Resolved and Closed stop them.
