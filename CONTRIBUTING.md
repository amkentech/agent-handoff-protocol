# Contributing

Thanks for your interest. This project is a **protocol** — its value comes
from being stable at the core and easy to extend at the edges. Contributions
are welcomed differently depending on which part you're touching.

## The two zones

### Edges — contributions land fast here

These make the protocol usable in more places without changing what it means:

- **Store mappings** — a new column in `protocol/store-contract.md` (Notion,
  GitLab, Azure DevOps, Jira, a plain filesystem...) showing how that store
  provides the five capabilities. Include a worked example in `examples/` if
  you can.
- **Tool install targets** — a new detection + native-location block in
  `bin/install.js` (Windsurf, Codex CLI, Gemini CLI, Antigravity...). Keep it
  zero-dependency and idempotent; never overwrite a filled-in bindings file.
- **Worked examples** — an `examples/<stack>-setup.md` for a stack you
  actually ran the protocol on: SharePoint + Teams, GitHub-only, mixed-store.
  Real examples (with the failure you hit and how the protocol handled it)
  beat hypothetical ones.
- **Templates** — improvements to the prompts and packages in `templates/`
  that you've tested with a real agent.
- **Docs** — clarity fixes anywhere.

For these: open a PR directly. Small and focused merges fastest.

### Core — deliberate changes only

The protocol contract is what every adopter depends on staying stable:

- `protocol/states.md` — the state names and legal transitions
- `protocol/work-item.schema.json` and `protocol/handoff.schema.json`
- The six rules and hard rules in `skills/orchestrated-handoff/SKILL.md`

For these: **open an issue first** describing the real situation the current
contract can't express. Core changes need a concrete failing case, not a
preference. Backwards-incompatible changes require a protocol version bump
and a migration note.

## Ground rules

- **Test what you touch.** Installer changes: run `node bin/install.js` against
  a scratch project with the relevant tool dirs and show the output in the PR.
  Skill/template changes: run them with at least one real agent.
- **No dependencies** in the installer. Plain Node ≥18 only.
- **Match the voice.** Plain English, no hype, specific and bounded. If a
  sentence promises something the protocol can't enforce, cut it or state the
  limit honestly (see the limits table in `examples/confluence-setup.md` for
  the house style).
- **One authoritative home per fact.** Don't duplicate protocol text across
  files — link to it.

## Reporting problems

Open an issue with: what you ran, what you expected, what happened, and your
stack (which agent tools, which store). "The gate rule is ambiguous when X"
is a great issue. So is "my agent read the skill and did Y instead of Z."

## Licensing

By contributing you agree your contributions are licensed under the
repository's MIT license. Keep it simple: don't submit code or text you don't
have the right to contribute.
