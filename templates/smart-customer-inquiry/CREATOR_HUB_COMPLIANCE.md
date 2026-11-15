# Creator Hub compliance audit — v1.1.2

Reviewed: 2026-11-15. This audit records submission readiness; it is not n8n approval.

## Guideline sources and scope

Primary references were read in full from the repository:

- docs/n8n-template-submission-guidelines.md — local copy; source URL/revision date aren't recorded in that file. The supplied historical source URL is https://n8n.notion.site/Template-submission-guidelines-9959894476734da3b402c90b124b1f77.
- docs/n8n-sticky-note-guidelines.md — local copy; source URL/revision date aren't recorded in that file. The supplied historical source URL is https://n8n.notion.site/Add-sticky-notes-to-templates-2aa5b6e0c94f8058b0aefddd02655887.

Both local copies are treated as authoritative for this review. Their unrecorded revision dates are an ambiguity, not a failure. “Mandatory” below means an explicit guideline instruction; “recommended” means wording such as consider, where practical, or optional.

## Requirement inventory

| Requirement | Official source section | Implementation evidence | Status | Remaining action |
| --- | --- | --- | --- | --- |
| **Mandatory:** solve a specific practical problem with substantive reusable logic | Submission: Solve a useful problem | Inquiry intake, validation, deduplication, durable tracking, routing, retry, reminder, and escalation form a complete small-business queue. README identifies audience/outcome. | PASS | None. |
| **Mandatory:** review AI-assisted content and test its claims before submission | Submission: Review AI-assisted submissions | Static checks cover JSON/nodes/logic; runtime checklist covers every branch. | NEEDS MANUAL VALIDATION | Run clean-import acceptance using the exact final JSON. |
| **Mandatory:** original work / respect licenses | Submission: Submit original work | NyxDay-authored MIT repository; no third-party workflow or asset is included. | NEEDS MANUAL VALIDATION | Submitter confirms provenance and authority to publish. |
| **Mandatory:** descriptive node names and understandable execution path | Submission: Make the workflow understandable | Operational nodes use purpose names; intake and scheduled processing are separated left-to-right. | PASS | Visual import check remains prudent. |
| **Mandatory:** one overview and section notes for workflows with 4+ nodes | Submission: Make understandable; Sticky: overview and sections | One overview plus eleven concise white grouping/setup notes are exported. | PASS | Verify rendered canvas after import. |
| **Mandatory:** yellow overview at top-left, 100–300 words, How it works + Setup headings | Sticky: Add the main overview note | Colour 2, position [-760,-520], 169 words; automated test verifies position, colour, headings, and word range. | PASS | None. |
| **Recommended:** overview Customization heading | Sticky: Add the main overview note | Essential customization is in Setup and nearby notes; no separate Customization heading is needed. | NOT APPLICABLE | None. |
| **Mandatory:** white section notes, under 50 words, explain groups | Sticky: Group nodes with section notes | All explanatory/setup notes use colour 0 and automated tests enforce fewer than 50 words. | PASS | Verify visual grouping after import. |
| **Mandatory:** red warning only for one critical setup/risk and placed over its node | Sticky: Highlight a critical setup step | One red note sits over Customer inquiry form and warns only about the privacy URL before public use. | PASS | Verify no overlap problem after import. |
| **Mandatory:** document credentials, resources, dependencies, configuration, limitations | Submission: Make understandable | Main/section notes and SETUP name table, SMTP, Slack, privacy, timezone, retries, status, and limitations. No sub-workflows/community nodes. | PASS | None. |
| **Mandatory:** remove credentials, private IDs, customer data, pinned data | Submission: Remove secrets and personal data | Tests reject credentials/secrets/private endpoints; workflow has empty pinData and generic placeholders. | PASS | Re-run tests against the exact upload artifact. |
| **Mandatory:** fresh-import exact JSON, configure from instructions, test branches/failures/repeats, confirm notes | Submission: Test template before submitting | TESTING and in-canvas note provide a synthetic, clean-import acceptance path. | NEEDS MANUAL VALIDATION | Perform it in an isolated n8n project. |
| **Mandatory:** state tested release/version-specific restrictions accurately | Submission: Test template before submitting | Setup states n8n 2.45.0+ and reports prior operator import on 2.46.7; v1.1.2 runtime validation is clearly pending. | PASS | Record the exact v1.1.2 runtime version/date after test. |
| **Mandatory:** no undocumented local files, pinned data, community nodes, or hidden dependencies | Submission: Test template before submitting; Community nodes | Only built-in nodes; no filesystem node, community node, sub-workflow, or pin data. | PASS | None. |
| **Mandatory:** complete submission metadata and review portal content | Submission checklist | publication.md supplies title, description, integrations, credentials, cost, tags, categories, license, audience, and repository placeholder. | NEEDS MANUAL VALIDATION | Compare to current portal fields and replace repository URL before submission. |
| **Recommended:** walkthrough video for complex/beginner workflow | Sticky: Add a walkthrough video | Written instructions are complete; no video is required. | NOT APPLICABLE | Optional future enhancement. |

## Self-contained setup coverage

Essential setup now appears on the imported canvas; repository files remain the detailed reference.

| Setup instruction | In-workflow location | Detail retained in |
| --- | --- | --- |
| n8n 2.45+, built-in nodes, required Data Table/SMTP, optional Slack | Overview + 5 · SMTP and optional Slack | SETUP Quick start requirements |
| Table name, ID discovery, all 10 Data Table replacements | 6 · Data Table connection | SETUP Mandatory setup |
| Every required column and exact type | Schema 1–4 notes | SETUP Table schema |
| SMTP credential and all three email nodes/recipients | 5 · SMTP and optional Slack | SETUP Mandatory setup |
| Privacy URL, click test, non-marketing acknowledgement | Red Required before public use note + overview | SETUP/CONFIGURATION |
| Timezone, priority rules, duplicate window, reminders/retries | Overview + 7 · Test before activation | CONFIGURATION |
| Slack activation | 5 · SMTP and optional Slack | SETUP Optional Slack alerts |
| Synthetic intake, record/email, duplicate, reminder, status-stop test, activation | 7 · Test before activation | TESTING |

## Functional-change guard

This audit patch changes only Sticky Notes, layout metadata, documentation, and static compliance tests. It does not alter form mapping, validation, classification, deduplication, Data Table operations, notification routing, retry timing, reminder stages, escalation, or status processing.

## Canvas layout audit

The canvas uses white background sections A–K: capture/validate, schedule preparation, duplicate checks, storage/audit, priority routing, initial notifications, scheduled scan, due reminders, reminder outcome, initial-alert retry, and retry outcome. The intake lane runs left-to-right across the top; scheduled processing occupies two rows below it. Configuration, schema, and test notes remain in a separate left reference area, while the red privacy warning sits over the Form Trigger.

Automated layout checks verify every listed functional node anchor is inside its intended section with title clearance, that the A–K rectangles do not overlap, and that every section note remains below 50 words. This is coordinate-based verification only; visual import inspection remains required.

## AI review disposition

The tested repository workflow remains authoritative. An AI-generated workflow/annotation export was reviewed but not adopted because it changed functional Form Trigger fields, webhook metadata, node IDs, positions, response text, and other tested implementation details.

| AI review concern | Resolution | Evidence |
| --- | --- | --- |
| Generic email values trigger n8n warnings | Replaced with syntactically valid configuration values: configure-sender@example.com, configure-internal-recipient@example.com, and configure-escalation-recipient@example.com. | Workflow, SETUP, CONFIGURATION, and automated SMTP-placeholder test. |
| Exported credentials/identifiers | No credential IDs, names, or credential objects are present. | Existing secret/private-endpoint test plus raw JSON review. |
| Canvas clarity and annotations | Retained the tested self-contained notes; refined only setup grouping and critical privacy warning. | Overview, white setup/schema notes, and red Form Trigger warning. |
| Multiple Data Tables | Rejected as inaccurate. This template uses one customer_inquiries Data Table and 10 nodes that operate on it. | Data Table setup note, SETUP, and workflow locators. |
| AI-generated workflow replacement | Rejected. | Functional-baseline regression check excludes presentation notes but locks every operational node, parameter, connection, setting, and activation state. |

## Manual fresh-import and visual verification

1. Import workflow.json into an isolated inactive project.
2. Follow only the canvas notes: create customer_inquiries with Schema 1–4, replace all Data Table IDs, attach test SMTP to all three email nodes, replace recipients and privacy host/path.
3. Open the Form Trigger test URL. Confirm notes are readable, no note hides an operational node, and the privacy link opens.
4. Submit synthetic data; verify one stored record and internal email. Re-submit exactly to verify suppression.
5. Set next_reminder_due_at in the past to test a reminder; confirm Resolved and Closed skip.
6. Test initial-alert retry success and terminal failure, reminder failure recovery, and escalation with test-only recipients.
7. Recheck the exported JSON, portal metadata, and template preview immediately before submission.

## Final readiness decision

**READY AFTER MANUAL CHECKS.** All static and canvas-content requirements from the supplied local guidelines are addressed. Remaining blockers are the guideline-required clean import/runtime branch test, imported-canvas visual inspection, privacy-link click test after a real URL is inserted, provenance confirmation, and portal metadata review.
