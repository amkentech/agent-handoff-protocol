# Agent Handoff Protocol

**A coordination protocol for human–AI-agent teams working across different tools.**

Your PM's agent drafts requirements in Claude Code. Your engineers use GitHub
Copilot. Someone's running a spec kit, someone else a method framework. None of
them talk to each other. Nobody knows when a handoff happened, work starts from
stale documents, and humans babysit every seam.

This protocol fixes the seams — without a platform, without replacing any tool
you use. It is a set of rules any agent can follow, in any stack:

- **Gate** — no agent builds from an unapproved or unpinned artifact.
- **Version pin** — "Approved" always names an exact version; edits to approved
  artifacts demote them and re-notify downstream.
- **Structured handoff** — responsibility transfers as a package (work done,
  decisions, risks, open questions, next action), never as a chat thread.
- **Ask, don't guess** — blocked agents ask a human one clear question and stop.
- **Action-only notifications** — humans hear about handoffs, blocks, and
  approvals. Never routine noise.
- **Audit** — every artifact says who/what made it, from which inputs, and who
  approved it.

## What's in this repo

| Path | What it is |
|---|---|
| `skills/orchestrated-handoff/SKILL.md` | The protocol as an agent skill (Claude Code skill format; usable as instructions for any agent) |
| `protocol/states.md` | The shared state model and legal transitions |
| `protocol/store-contract.md` | The 5 capabilities any work store must provide — with Confluence, SharePoint, and GitHub mappings |
| `protocol/work-item.schema.json` | Work item — the protocol's primary object |
| `protocol/handoff.schema.json` | The handoff package — the system of record for transfers |
| `templates/work-item-prompt.md` | Paste-ready prompt to run one work item under the protocol |
| `templates/handoff-template.md` | Markdown handoff package |
| `templates/bindings.md` | Bind the protocol to YOUR stack (store, channel, roles) |
| `examples/confluence-setup.md` | Worked example: Confluence + Teams/Slack, zero new infrastructure |

## Design principles

1. **The work item is the primary object.** Conversations, artifacts, decisions,
   and agent activity attach to the work — not the other way around.
2. **Vendor-neutral by structure.** No single model, vendor, or tool owns the
   workflow. Agents from different vendors coordinate by following the same
   protocol, not by sharing a platform.
3. **Humans stay accountable.** Agents execute; humans keep visibility,
   authority, and approval rights. Every work item has a human owner.
4. **Context moves, privilege doesn't.** A handoff transfers artifacts and
   context. Each actor operates with its own role's access.
5. **Degrade gracefully, automate on pain.** The protocol runs on a wiki and a
   chat channel with zero new infrastructure. Automation (event webhooks,
   durable async state, attention dashboards) is worth adding only when the
   manual mode's specific failure shows up.

## How this differs from other agent-coordination projects

Most agent-coordination tools solve one of two narrower problems: coding
agents sharing a repo without conflicts (file-based agent-to-agent handoff),
or chat-session frameworks where a human relays messages between agent
conversations. This protocol targets the seam they leave open: **work that
crosses roles and access boundaries** — a PM who lives in Confluence or
SharePoint handing approved, version-pinned work to engineers and coding
agents who live in GitHub, with humans notified only when action is needed.
Work lives in your real tools, survives any single session, and carries its
approval state and audit trail with it.

## Getting started

```
npx agent-handoff-protocol
```

Run it in your project. The installer detects which agent tools you use and
installs the skill in each one's native location:

- Claude Code → `.claude/skills/orchestrated-handoff/SKILL.md`
- GitHub Copilot → `.github/instructions/orchestrated-handoff.instructions.md`
- Cursor → `.cursor/rules/orchestrated-handoff.mdc`
- No tool detected → `.orchestrated/skill/SKILL.md` (point any agent at it)

It also scaffolds `.orchestrated/` with the protocol reference and a bindings
template. Re-running refreshes the skill but never overwrites your filled-in
bindings.

Then open your agent and say **"Run the orchestrated-handoff setup
interview."** The agent interviews your team (work store, notification
channel, roles, escalation contacts), validates the store against the
capability contract, and writes the completed agreement to
`.orchestrated/bindings.md`. The skill refuses to run work items until
bindings are complete.

Finally, run one real feature through it: create the work item, let the first
agent gate-check, work, hand off, and watch the notification land.

Manual alternative: copy `skills/orchestrated-handoff/` into your agents'
instructions location and fill in `templates/bindings.md` yourself.

## Works with

Claude Code · GitHub Copilot · Cursor · BMAD Method personas · spec kits ·
custom and MCP-compatible agents — anything that can read instructions and
follow them.

## Contributing

Extensions land fast (new store mappings, new tool install targets, worked
examples); core protocol changes need an issue with a concrete failing case
first. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
