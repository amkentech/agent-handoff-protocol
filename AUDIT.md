# agent-handoff-protocol — claims audit

**Repo:** github.com/amkentech/agent-handoff-protocol · npm `agent-handoff-protocol@0.1.0` · MIT
**Purpose of this document:** every claim the repo makes, what kind of claim it
is, and exactly how to check it. Written for anyone who wants to audit the
project before adopting it — the fastest way to trust something is to be told
where to poke it.

---

## 1. Claims you can verify by reading the repo

| Claim | Where it's made | How to verify |
|---|---|---|
| "Without a platform, without replacing any tool" — there is no server, no service, no runtime | README intro | The entire repo is markdown, two JSON Schemas, and one installer script. `git ls-files` — 20 files, nothing executable except `bin/install.js` and the CI scanner. |
| Zero dependencies | SECURITY.md, CONTRIBUTING.md | `package.json` has no `dependencies` key at all. `npm ls --all` after install shows nothing. |
| The six rules are what the README says they are (gate, version pin, structured handoff, ask-don't-guess, action-only notifications, audit) | README bullet list | Read `skills/orchestrated-handoff/SKILL.md` — the six rules plus four hard rules. The README bullets are summaries of those sections, nothing more. |
| The repo contents table is accurate | README "What's in this repo" | Compare the table to `git ls-files`. Every listed path exists; nothing load-bearing is unlisted. |
| MIT licensed, all of it | README, package.json | `LICENSE` file, standard MIT text, no exceptions or dual-license carve-outs anywhere in the repo. |
| Schemas are valid JSON Schema | `protocol/*.schema.json` `$schema` declarations | Both declare draft 2020-12. Validate with any conformant validator, e.g. `npx ajv-cli compile -s protocol/work-item.schema.json --spec=draft2020`. |

## 2. Claims you can verify by running things

| Claim | How to verify |
|---|---|
| `npx agent-handoff-protocol` works from the public registry | Run it in a scratch directory. Published 2026-07-15; verified working from the registry the same day. |
| Installer detects Claude Code / Copilot / Cursor and installs to each tool's native location; falls back to `.orchestrated/skill/` when nothing is detected | Make four scratch dirs — one with `.claude/`, one with `.github/`, one with `.cursor/`, one empty — run the installer in each, check where the skill landed against the README's list. |
| Re-running refreshes the skill but never overwrites a filled-in bindings file | Install, edit `.orchestrated/bindings.md`, run the installer again, diff. |
| The installer is plain Node ≥18 with no dependencies | Read `bin/install.js` — 166 lines, only `node:` built-in imports. |
| CI blocks hidden-content attacks in contributions | Read `scripts/injection-scan.mjs` (zero-dep, ~100 lines). To test it: add a zero-width character, an HTML comment in a skill file, or an unlisted URL on a branch and run `node scripts/injection-scan.mjs` — it fails with file:line findings. The `injection-scan` workflow runs it on every PR. |

## 3. The behavioral claim — the one that matters most

The core claim is: **agents that load this skill follow the rules** — they
refuse to build from unapproved artifacts, they stop and ask instead of
guessing, they produce structured handoffs.

Honest status of that claim:

- The rules are distilled from coordination practices we run on our own
  builds. The failure modes they address (building from stale requirements,
  handoffs nobody announces, agents guessing at decisions) are ones we
  actually hit.
- **The packaged skill has not yet carried a full feature end-to-end** —
  dogfooding a real feature through it is the next milestone, and we'd
  rather say that here than have an auditor discover it.
- Compliance is **instruction-following, not enforcement**. Nothing in the
  protocol can stop an agent that never loaded the skill, and a
  sufficiently confused agent can violate a rule it did load. The repo says
  this in plain text — README design principle 5 and the limits table in
  `examples/confluence-setup.md` §7.

How to audit it: install the skill into your own agent, create a work item
with an upstream artifact still in Draft, and tell the agent to build. A
compliant agent posts a blocked notice and stops. That single test exercises
the gate rule, the state rule, and the notification rule at once. "My agent
read the skill and did Y instead of Z" is explicitly invited as a bug report
(CONTRIBUTING.md).

## 4. Scope and market claims — how they're worded

- **"Works with: Claude Code · GitHub Copilot · Cursor · BMAD personas ·
  spec kits · MCP-compatible agents"** — the sentence ends "anything that
  can read instructions and follow them." That's the whole claim: the skill
  installs into each tool's native instructions location (verifiable, §2),
  and behavior then depends on the agent (bounded, §3). No vendor
  affiliation or endorsement is claimed anywhere.
- **The differentiation paragraph** (README "How this differs") claims other
  agent-coordination projects target narrower problems — same-repo coding
  agents, or human-relayed chat sessions — and this one targets cross-role,
  cross-access-boundary work. It deliberately does not claim to be the only
  or first such project. To audit: survey the space yourself; the closest
  projects we found (2026-07 scan) were file-based two-agent handoffs and
  session-management frameworks, none combining approval gates + version
  pinning + business-store residence + action-only notifications.
- **The problem narrative** ("engineers start from requirements that have
  already changed") is our own experience, offered as motivation — no
  statistics or industry research are cited, so none need auditing.

## 5. Security claims

| Claim | Verifiable how |
|---|---|
| Every PR runs the injection scanner | Public: the `injection-scan` check is visible on any PR and on master pushes (Actions tab). The workflow and scanner are in-repo. |
| Master is protected — PRs need approval plus a passing scan | Branch-protection settings aren't publicly readable, so from outside you can only observe the required check on PRs. Maintainer-verifiable via the repo settings API. |
| npm publishes are manual, from the maintainer's machine, behind passkey 2FA | **Not externally verifiable** — this is a trust statement. npm provenance attestation is not currently enabled; enabling it would make this checkable and is a reasonable ask. |
| Private vulnerability reporting is open | Visit the repo's Security tab — the "Report a vulnerability" flow is enabled. |

One commitment to hold ourselves to: SECURITY.md promises a response to
private reports "within a few days."

## 6. What the repo does NOT claim

Worth listing, because absence of over-claiming is what an audit is really
checking for:

- No enforcement or runtime guarantees — it runs on discipline, and says so.
- No automation — no webhooks, no durable async state, no resume-on-answer.
  The limits table names all four gaps and the symptom that would justify
  building each fix.
- No performance numbers, adoption numbers, or testimonials.
- No compliance/regulatory claims (the audit rule produces a trail; nobody
  claims it satisfies any named standard).
- No claim that the setup interview validates your store *for* you beyond
  checking it against the five-capability contract in
  `protocol/store-contract.md`.

## 7. Auditor's quick runbook

```bash
git clone https://github.com/amkentech/agent-handoff-protocol && cd agent-handoff-protocol
git ls-files                          # inventory matches README table
cat package.json                      # MIT, no dependencies, node>=18
node scripts/injection-scan.mjs       # clean on a fresh clone
mkdir /tmp/scratch && cd /tmp/scratch && npx agent-handoff-protocol   # installer behavior
# then: install the skill into your agent and run the Draft-artifact gate test from §3
```

If anything in this document doesn't match what you find, that's an issue we
want opened.
