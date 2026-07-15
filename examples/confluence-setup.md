# Worked example: Confluence + Teams/Slack, zero new infrastructure

How to run the protocol today with tools most teams already have. No service,
no database — the wiki is the work store and the chat tool is the event
channel. This is deliberately the degraded-but-working mode: it runs on
discipline. When the discipline starts breaking (silent edits to approved
pages, missed pings), that is the signal to automate — not before.

## 1. The feature tree

One parent page per feature. Every artifact produced for that feature
(discovery notes, PRD, implementation plan, review report) is a child page.
Agents read context from the tree and publish outputs into it.

```
Feature: {{name}}            ← parent (status lozenge + Handoff block)
├── Discovery notes
├── PRD                      ← status lozenge + pinned version
├── Implementation plan
└── Review report
```

## 2. Status on every governing page

Use Confluence's status lozenge (`/status`) at the top of each page:
`DRAFT` → `READY` → `APPROVED`. These map to `protocol/states.md`.

## 3. Pin the version at approval

When the approver flips a page to `APPROVED`, they add one line in a
**Handoff block** at the top:

> **Approved for build:** v7 · 2026-07-14 · @approver

Confluence page history already tracks every edit; this line names which
version is the contract.

## 4. Gate the downstream agent

Add to the downstream agent's instructions (wherever your skills live):

> Do not begin implementation until the source page status = APPROVED. Build
> from the pinned version in the Handoff block. Record the version you built
> from in your output.

## 5. Change-after-approval

If an `APPROVED` page must change:

1. Flip status back to `DRAFT`.
2. Make the edit; re-approve at the new version.
3. **@mention the downstream owner on the page** with a one-line change note:
   "v7 → v9, changed X, please re-pull."

The @mention is the one native push notification you already have — it reaches
Confluence/email/Teams with zero build. It is the event layer, free.

## 6. Roll-up dashboard

Put a **Page Properties Report** macro on the feature parent (or a space
overview page) so child statuses render as a glanceable table. That is the
human attention view, native.

## 7. Known limits of this mode (and what fixes them)

| Limit | Symptom | Fix when it hurts |
|---|---|---|
| Runs on discipline | Someone edits an approved page silently | Webhook: auto-demote to DRAFT + auto-notify downstream |
| Pull, not push | Agents must be told to check their inbox | Scheduled "check your inbox" run per agent |
| No async resume | An agent's question dies with its session | Durable state + resume-on-answer (a coordination service) |
| No conflict diffing | Two stakeholders' answers silently contradict | A reconciler step across collected answers |

Each fix is worth building only after its symptom shows up.
