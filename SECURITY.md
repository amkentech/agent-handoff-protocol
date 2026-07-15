# Security

This repo has an unusual threat model, so it's worth being explicit about it.

## Why this repo is different

Two kinds of files here are executed, not just read:

- **`skills/`, `templates/`, `protocol/`, `examples/`** are loaded into AI
  agents' contexts by every team that adopts the protocol. A malicious
  sentence smuggled into one of them — including invisibly, via hidden
  Unicode or HTML comments — is a prompt injection distributed through npm.
- **`bin/install.js`** runs on your machine when you run
  `npx agent-handoff-protocol`. A malicious change there is code execution.

Because of that, changes to those files get adversarial review (see
CONTRIBUTING.md), and CI runs an injection scanner on every pull request
that fails on invisible Unicode, HTML comments in agent-loaded markdown,
encoded blobs, and unlisted URLs.

## Reporting a vulnerability

If you find a way to get an agent to violate the protocol's hard rules, a
weakness in the installer, or anything else with security impact, please
report it privately rather than opening a public issue:

**https://github.com/amkentech/agent-handoff-protocol/security/advisories/new**

Include what you ran, what you expected, and what actually happened. You'll
get a response within a few days, and credit in the fix unless you'd rather
not.

Things that are *documented limits* rather than vulnerabilities — like "an
agent that never loaded the skill ignores the rules" — are listed in
`examples/confluence-setup.md` §7. An issue is the right place to discuss
those.

## Supply chain

- npm publishes are manual, from the maintainer's machine, behind passkey
  two-factor auth. Nothing publishes automatically from CI.
- The installer and the package have **zero runtime dependencies**, on
  purpose. PRs that add one will be declined.
