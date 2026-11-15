# Configuration reference

The configuration object is deliberately short and visible in the **Normalize, validate & classify (CONFIG HERE)** node. It contains no secret.

| Setting | Type / default | Permitted value / effect |
| --- | --- | --- |
| `duplicateWindowHours` | number / `24` | Positive elapsed hours. Exact fingerprints at or after this window are suppressed. |
| `defaultOwner` | string / `Unassigned` | Owner placed on new records; use a team label, not an email if possible. |
| follow-up stages in **Initialize follow-up schedule** | arrays / Critical `1,2,4`; High `4,8,24`; Normal `24,24,48`; Low `48,48,72` | Elapsed hours: first due after submission, then delay after each provider-accepted stage. Stage 3 is marked escalation. |
| `maxReminders` in **Explain reminder eligibility** | number / `3` | Bounds successful reminder/escalation stages. Failed deliveries retain the stage and retry one hour later. |
| initial notification retry policy | number / `3` total attempts; `15` minutes | The original initial SMTP send counts as attempt 1. Failures become `retry_pending`; attempt 3 becomes `initial_notification_failed` and clears its retry timestamp. This is independent of reminder retry state. |
| delivery retry policy in **Record reminder retry pending** | number / `3` failures; `60` minutes | `reminder_retry_count` includes the original failed SMTP attempt. At the third failure, the workflow sets `delivery_failure_state` to `delivery_failed`, clears the automatic due time, and stops automatic retries. |
| eligible statuses in **Explain reminder eligibility** | list / New, Acknowledged, In progress | These statuses may receive internal follow-up. Waiting for customer, Resolved, and Closed are paused/stopped. |
| schedule cadence | minutes / `15` | The shared schedule checks initial-alert retry state every 15 minutes and evaluates reminder due timestamps. It doesn't convert elapsed reminder intervals to business hours. |
| workflow timezone | IANA zone / `America/New_York` | Controls form timestamps and scheduled checks; set to the business timezone. |
| ordinary/escalation recipient and from address | SMTP node strings | Required internal addresses. The follow-up `toEmail` expression uses the escalation address only at stage 3; set both to the same team deliberately if there is no management recipient. Leaving either example placeholder in place is a configuration error, not a fallback. SMTP credentials are attached in UI, never exported. |
| categories | form dropdown + `allowed` array | Update both together. Unknown submitted values safely become `Other`. |
| urgency rules | regexes in Code node | Add precise, low-ambiguity signals. Critical requires a Complaint plus `data loss` or `legal escalation`; never add broad words alone. |
| Slack path | disabled / false | The **Slack enabled for High/Critical?** condition is deliberately false and its Slack node disabled. To opt in, configure a Slack credential/channel, enable the Slack node, and change that condition to true. Slack failure must be tested in a non-production workspace. |

The default customer acknowledgement is only the form confirmation. Do not add a customer email unless you have chosen its transactional purpose, sender identity, consent/legal basis, and reply handling.

Stage timing is elapsed time. The first stage is measured from submission; each subsequent stage is measured from the actual successful SMTP provider-acceptance timestamp, not the prior scheduled due time. A delayed execution therefore never compresses the next interval. SMTP acceptance does not prove delivery to an inbox.

The Form Trigger description includes a visible HTML privacy-notice anchor with `REPLACE_WITH_YOUR_PRIVACY_NOTICE_URL`. Replace only that placeholder with a public HTTPS URL, save, open the Form Trigger test URL, and click the link before activating the form. Do not publish the placeholder or a made-up/unrelated notice. The required acknowledgement concerns handling the inquiry, not marketing consent; collect any marketing consent separately and do not enable customer marketing mail in this workflow. The operator remains responsible for accurate notices and applicable privacy/communications obligations; this template does not by itself establish legal compliance. Form rendering/link behavior still requires the isolated runtime acceptance check on the importing n8n version.

The scheduled Data Table read intentionally uses all rows. This preserves the per-row diagnostic output from **Explain reminder eligibility** and avoids prematurely excluding `retry_pending` or escalation records with filters that cannot safely express the full policy. It is suitable for light-to-moderate tables only; establish retention/archiving or use an external database at larger scale.

To change an inquiry safely, edit `status`, `assigned_owner`, `last_activity_at`, and (when resolved) `resolution_at` in the Data Tables UI. Use New → Acknowledged → In progress → Waiting for customer/Resolved/Closed. Do not reopen Closed records. Waiting for customer pauses internal response reminders; Resolved and Closed stop them.
