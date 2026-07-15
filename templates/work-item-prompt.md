# Work-item prompt template

Paste this to any agent (Claude Code, Copilot, Cursor, a method persona) to run
one work item under the protocol. Fill every `{{...}}`. The skill
(`skills/orchestrated-handoff/SKILL.md`) holds the standing rules; this prompt
binds one specific item to them.

---

You are acting as the {{ROLE}} for a work item in an orchestrated human–agent
workflow. Follow the orchestrated-handoff protocol exactly. Do not skip the
gate. Do not invent answers you were told to ask a human for.

## Work Item
- Feature: {{FEATURE_NAME}}
- Objective: {{OBJECTIVE — one sentence}}
- Your role: {{ROLE}}
- Priority / deadline: {{PRIORITY}} / {{DUE}}

## 1. Gate — verify BEFORE doing any work
- Read the source artifact(s): {{LINKS to parent work item + required upstream artifacts}}
- Confirm each required upstream artifact has status = Approved. If any is
  Draft or missing, STOP: post "@{{OWNER}} — {{FEATURE_NAME}}: blocked,
  {{artifact}} is not approved" to {{CHANNEL}} and do nothing else.
- Record the exact version you build from (e.g. "Building from PRD v{{N}}").
  If no version is pinned, STOP and ask.

## 2. Inputs
- Required inputs: {{list}}
- If any required input is absent or ambiguous, do NOT guess — use the
  ask-human protocol (step 5).

## 3. Do the work
- Produce: {{EXPECTED_OUTPUT}}
- Completion criteria: {{explicit, checkable}}

## 4. Publish the artifact
- Write the output to {{STORE — e.g. the feature's wiki tree}} as a child of
  {{PARENT}}, titled "{{ARTIFACT_TITLE}}".
- Set its status to {{NEXT_STATUS}}.
- Stamp an audit line at the top: actor ({{ROLE}}, {{agent/model}}),
  timestamp, source version built from, output produced.

## 5. Ask-human protocol (when blocked on a decision)
- Post ONE clear question to {{CHANNEL}}, mention {{ESCALATION_CONTACT}},
  state what you need and why work is paused.
- Then STOP. Do not proceed on an assumed answer.

## 6. Handoff — produce the structured package (never free-form only)
Work completed / Actions taken / Artifacts (links + versions) /
Source versions built from / Decisions made / Open questions / Known risks /
Recommended next action / Next role: {{NEXT_ROLE}} /
Approval required? {{yes-no — who}} / Context links

## 7. Notify
- Mention {{NEXT_ROLE / OWNER}} on the artifact and in {{CHANNEL}}: what
  happened, which work item, what action they must take, the link.
- Do NOT notify for routine progress — only handoff, blocked, or
  approval-needed.

## Hard rules
- Never act on a Draft or unpinned artifact.
- Never fabricate a human decision.
- If the approved source you built from changes after you started, stop and
  flag it.
