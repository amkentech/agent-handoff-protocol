# Work-store contract

The protocol does not care which tool holds the work — it cares that the tool
can do five things. Any system providing these capabilities can be the work
store. Bind your choice in `templates/bindings.md`.

## The five required capabilities

| # | Capability | Why the protocol needs it |
|---|---|---|
| 1 | **Hierarchical container** | Feature parent → artifact children; agents find all context for a feature in one place |
| 2 | **Status on an artifact** | The gate rule reads it; the state model (`states.md`) lives in it |
| 3 | **Version history** | Approval pins a version; downstream records what it built from |
| 4 | **Mention/notify a person** | The event layer — handoff, blocked, approval-needed pings |
| 5 | **Attributable history** | The audit rule: who/what changed it, when |

## Mappings for common stores

| Capability | Confluence | SharePoint | GitHub |
|---|---|---|---|
| Container | Parent page + children | Site / document library folder per feature | Repo folder per feature (e.g. `/work/<feature>/`) or issue + linked artifacts |
| Status | Status lozenge / page property | Metadata column (choice field) | Issue label, or `status` field in a front-matter block |
| Version | Page version history | Version history on the file | Commit SHA (the strongest pin of the three) |
| Mention | @mention on page/comment | @mention in comments / Power Automate ping | @mention in issue/PR comment |
| Audit | Page history + audit line | Version history + audit line | Git history (native and immutable) |

Notes:
- **GitHub** is the natural store when the team is engineering-heavy: commit
  SHAs are exact version pins, git history is a built-in audit log, and every
  coding agent already reads/writes it.
- **Confluence / SharePoint** are the natural store when non-engineering roles
  (PM, design, ops) must author and approve without touching git.
- **Mixed stores are normal** — e.g. PM artifacts in Confluence or SharePoint,
  engineering artifacts in GitHub. That is fine with one rule: each artifact
  has exactly ONE authoritative home, named in the bindings. Cross-store
  handoffs link across; they never duplicate. If state is mirrored anywhere,
  the bindings must say which side wins.

## Explicitly out of contract

The store does not need workflow automation, webhooks, or an API for agents to
poll — those improve the experience but the protocol runs on discipline
without them. When their absence starts to hurt, see the limits table in
`examples/confluence-setup.md`.
