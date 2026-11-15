# Creator Hub compliance review — v1.1.2

Reviewed: 2026-11-15. This is a submission-readiness record, not n8n approval.

## Source availability

The two requested Notion sources could not be independently retrieved on the review date: the template-guideline URL returned HTTP 400 and the sticky-note URL returned HTTP 404. Requirements attributed exclusively to those sources are therefore marked **SOURCE NOT VERIFIED**. The official Form Trigger documentation was available and is linked where used.

| Requirement | Source | Status | Evidence | Required action |
| --- | --- | --- | --- | --- |
| Importable workflow with supported built-in nodes | Internal NyxDay quality standard | PASS | JSON, Code-node syntax, node references, and connections are checked by \`npm test\`. | Import in an isolated n8n environment before submission. |
| No exported credentials, secrets, private endpoints, or customer data | Internal NyxDay quality standard | PASS | Automated exported-workflow checks pass; credentials are attached only by the importer. | Recheck the final upload artifact. |
| Clear overview note, top-left, yellow | Requested Notion sticky-note guidance — unavailable | SOURCE NOT VERIFIED | \`Read me — overview and setup\` is colour 2 at \`[-760,-520]\`, has How it works and Setup, and is bounded by tests to 100–300 words. | Visually inspect after fresh import and reconcile with restored official guidance. |
| Concise white section notes | Requested Notion sticky-note guidance — unavailable | SOURCE NOT VERIFIED | Four explanatory section notes use colour 0; tests enforce no more than 50 words each. | Verify colour/word-limit expectations against the restored source. |
| Red note used only for a critical warning | Internal NyxDay quality standard | PASS | General failure note is colour 0. The only red note, \`Required before publishing\`, identifies incomplete configuration that makes public activation unsafe. | Visually inspect placement after import. |
| Privacy notice is visible and clickable | [Form Trigger documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger) | NEEDS MANUAL REVIEW | Form Description contains an \`https://REPLACE_WITH_YOUR_PRIVACY_NOTICE_URL\` anchor. n8n documents \`a\`, \`href\`, \`target\`, and \`rel\` as supported, with HTTP(S)-only URLs. | Replace placeholder with a real public URL and click-test in the importing instance. |
| Form error behavior is not misleading | [Form Trigger documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger) | NEEDS MANUAL REVIEW | Workflow uses response-after-workflow behavior; n8n documents an error response when the workflow errors. SMTP failure is intentionally a stored/retryable internal outcome. | Test validation, Data Table failure, and SMTP failure using synthetic data. |
| Required importing setup is documented | Internal NyxDay quality standard | PASS | SETUP documents table types, IDs, SMTP, recipients, timezone, privacy URL, Slack, and tests. | Follow the clean-import checklist without relying on existing instance configuration. |
| Optional Slack cannot block default flow | Internal NyxDay quality standard | PASS | Slack node is disabled; gating condition is false; SMTP continues after Slack. | Runtime-test only if test credentials are available. |
| Template schedule is publishable and timezone-aware | [Schedule Trigger documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger) | NEEDS MANUAL REVIEW | Workflow uses a 15-minute Schedule Trigger and workflow timezone. n8n requires publication for scheduled execution. | Confirm timezone and schedule after import/publish in isolated testing. |
| Fresh-import acceptance | Internal NyxDay quality standard | NEEDS MANUAL REVIEW | A reproducible checklist is in TESTING.md. | Perform the checklist against a new isolated workflow/Data Table/SMTP setup. |
| Creator Hub title, description, tags, and submission fields | Requested template-guideline source — unavailable | SOURCE NOT VERIFIED | publication.md contains a proposed title, description, categories, tags, credential and cost information. | Compare portal fields and generated text to current Creator Hub requirements before submission. |

## Functional-change guard

This compliance patch intentionally changes only:

- Sticky Note content, colours, and one warning note.
- Privacy placeholder scheme so the documented Form Trigger sanitizer permits the anchor.
- Documentation, compliance record, and static checks.

It does not change inquiry validation, classification, duplicate detection, Data Table operations, notification/retry schedules, routing, or escalation behavior.

## Fresh-import acceptance checklist

1. Import \`workflow.json\` into an isolated project as a new inactive workflow.
2. Create the Data Table using SETUP.md, including all initial-notification fields.
3. Replace every Data Table ID and privacy placeholder; attach test SMTP credentials to all three email nodes.
4. Configure test sender/ordinary/escalation recipients and workflow timezone.
5. Open the Form Trigger test URL. Confirm the privacy link is clickable, acknowledgement is required, and no marketing consent is requested.
6. Submit a synthetic inquiry; verify one row and one internal alert.
7. Re-submit the exact payload; verify duplicate suppression and no second alert.
8. Test an initial SMTP failure, retry success, and terminal third failure.
9. Test a due reminder, Waiting for customer, Resolved, Closed, and stage-three escalation.
10. Confirm the canvas notes remain readable after import. Activate only after all checks pass.

## Readiness decision

**READY AFTER MANUAL CHECKS.** The exported package passes static validation and is documented for import. Submission remains conditional on a clean isolated import, rendered privacy-link verification, and reconciliation against the currently inaccessible official Notion submission/sticky-note guidance.
