---
name: orchestrated-handoff
description: Coordination protocol for human–AI-agent teams working across different tools. Gates work on approved artifacts, pins versions, structures handoffs, asks humans instead of guessing, and notifies only when action is needed. Use whenever an agent picks up, performs, or hands off a work item in a multi-agent workflow.
---

# Orchestrated Handoff

## Purpose — why this protocol exists (read first)

Work is done by a mix of humans and AI agents spread across different tools —
Claude Code, GitHub Copilot, Cursor, spec kits, method personas — and by default
none of them talk to each other. When one finishes, nobody is told, the output
gets buried in a doc, and the next person or agent rebuilds context from
scattered pages and chat threads. Engineers start from requirements that have
already changed. Discovery eats hours of meeting time.

Your job is not just to complete a task — it is to make the work **legible**
and **hand it off cleanly**, so that:

- The next human or agent never rebuilds context from scattered sources.
- A human always knows what happened, what's waiting on them, and what needs a decision.
- No one ever builds from an unapproved or stale version.
- A human stays accountable and in control; you execute, but you escalate real decisions.
- Async work replaces meetings wherever an answer needs only one owner —
  live meetings are reserved for genuine disagreement.

When a step is ambiguous, choose the action that best preserves context, keeps
the human informed, and makes the handoff clean. When in doubt, ask a human
rather than guess.

## The six rules

### 1. Inbox rule — how you find your work

Work meant for you is any work item whose status is `Ready` and whose assigned
role matches yours. Query the shared work store (wiki tree, work-items folder,
or coordination service) for those items. Never pull work in `Draft` or work
assigned to another role.

### 2. Gate rule — before you do ANY work

- Read the work item and every required upstream artifact.
- Confirm each required upstream artifact has status = `Approved`.
- If any is `Draft` or missing: **STOP.** Post a blocked notice
  ("blocked: <artifact> is not approved") to the notification channel,
  set the work item to `Blocked`, and do nothing else.
- Record the exact **version** of each source you build from
  (e.g. "Building from PRD v7"). If no version is pinned, STOP and ask.

### 3. Handoff contract — what you produce when done

Publish your output artifact to the shared store, attached to its parent work
item, then produce a structured handoff package (see
`templates/handoff-template.md`) containing:

- Work completed
- Actions taken
- Artifacts produced (links + versions)
- Decisions made
- Open questions
- Known risks
- Recommended next action
- Next role / recipient
- Approval required before next step (yes/no — who)
- Context links

Free-form chat may support the handoff; it is never the system of record.

### 4. Ask-human protocol — when blocked on a decision

- Post ONE clear question to the notification channel, mention the escalation
  contact, state what you need and why work is paused.
- Then **STOP**. Do not proceed on an assumed answer. Never fabricate a human
  decision. Resume only when the answer is provided.

### 5. State + notify rule

- On completing a handoff: set the artifact/work-item status to the next state
  (see `protocol/states.md`) and notify the next role — what happened, which
  work item, what action they must take, the link.
- If an already-`Approved` artifact you produced must change: set it back to
  `Draft`, make the change, re-approve at the new version, and notify every
  downstream consumer that their source moved (old version → new version, what
  changed).
- Do NOT notify for routine progress. Only: handoff completed, blocked,
  or approval needed.

### 6. Audit rule

Stamp every published artifact with an audit line: actor (role + agent/model),
timestamp, source versions built from, output produced. Every meaningful action
must answer: who/what did it, what changed, when, from which inputs, and
whether a human approved it.

## Hard rules (never break these)

- Never act on a `Draft` or unpinned artifact.
- Never fabricate a human decision.
- If an approved source changes after you started, stop and flag it.
- Move context across a handoff, never privilege: operate only with your own
  role's access; do not assume the access of the human or agent who handed
  work to you.

## Bindings

This skill is tool-agnostic. It binds to a concrete stack through a filled-in
bindings file — default location `.handoff/bindings.md` in the project (the
installer scaffolds it); teams may agree a different authoritative home in the
setup interview. Bindings cover which store is the work tree, which channel
gets notifications, and who the escalation contacts are. A worked example for
Confluence + Teams/Slack lives in `examples/confluence-setup.md`.

## First-run setup — interview, don't assume

If no completed bindings file exists (or any binding below is missing), do NOT
proceed with work. Run setup instead: interview the user with the questions
below, ONE at a time, adapting follow-ups to their answers. Then write the
completed bindings file to the agreed location and read it back to the user
for confirmation.

1. **Work store** — "Where should work items and artifacts live: Confluence,
   SharePoint, GitHub, or something else?" Check the answer against
   `protocol/store-contract.md` (container, status, version, mention, audit).
   If a capability is missing, say which one and how to cover it — never
   silently accept a store that can't hold the protocol.
2. **Location** — the specific space / site / repo, and the feature-tree
   convention (parent = feature, children = artifacts).
3. **Status mechanism** — how states will be rendered in that store (lozenge,
   metadata column, label, front-matter field).
4. **Version pin convention** — how "Approved for build: vN" will be recorded
   (page version, file version, commit SHA).
5. **Notification channel** — Teams or Slack, and which channel. Confirm the
   rule: action-needed messages only.
6. **Roles** — which human and agent roles are in play, and who owns each.
7. **Escalation contacts** — per role: who gets the ask-human questions.
8. **Access model** — who/what can read and write where. Confirm the rule:
   handoffs move context, never privilege.
9. **Bindings home** — where the completed bindings file itself lives (it is
   an artifact too: one authoritative copy, one named owner, changes announced
   like any approved-artifact change).

Setup is complete only when every question has an answer and the user has
confirmed the written bindings. Re-run setup whenever a binding is found to be
stale or contradicted by the actual stack — degrade loud, never guess.
