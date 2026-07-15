# Work-item and artifact state model

The protocol's shared vocabulary. Every work item and every governing artifact
carries exactly one of these states. Tools may render them however they like
(Confluence status lozenge, label, JSON field) — the names and transitions are
the contract.

## States

| State | Meaning |
|---|---|
| `Draft` | Being authored or revised. Nobody downstream may build from it. |
| `Ready` | Complete from the author's side; awaiting review/approval. |
| `Approved` | A human (or an authorized automated check) approved it. Pins a specific version. Downstream work may start. |
| `In Progress` | An assigned human or agent is actively working from it. |
| `Waiting for Input` | Paused on an ask-human question. |
| `Blocked` | Cannot proceed — missing/unapproved dependency, failure, or conflict. |
| `Completed` | Work finished and handed off. |
| `Cancelled` | Abandoned; recorded, never deleted. |

## Legal transitions

```
Draft → Ready → Approved → In Progress → Completed
                     ↑            ↓
                   Draft ← (approved source must change)
In Progress → Waiting for Input → In Progress
In Progress → Blocked → Ready | In Progress
any state → Cancelled
```

## The two rules that make the model work

1. **Approval pins a version.** `Approved` is meaningless without a recorded
   version number ("Approved for build: v7"). Downstream actors build from the
   pinned version, and record which version they built from.

2. **Editing an approved artifact demotes it.** Any change to an `Approved`
   artifact sets it back to `Draft` and requires notifying every downstream
   consumer (old version → new version, what changed). A living document that
   changes silently under a builder's feet is the protocol's primary failure
   mode; this rule is what prevents it.
