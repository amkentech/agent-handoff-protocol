## What this changes

<!-- One or two sentences. Which zone: edge (mappings, install targets,
examples, templates, docs) or core (states, schemas, skill rules)?
Core changes need an issue first — link it here. -->

## How it was tested

<!-- Skill/template changes: which agent did you run it with, and what did
it actually do? Installer changes: paste the output of `node bin/install.js`
against a scratch project. Docs-only: say so. -->

## Security declaration

The files in `skills/`, `templates/`, `protocol/` and `examples/` are
executed by other people's agents, and `bin/install.js` runs on other
people's machines — so every PR declares:

- [ ] No invisible or bidirectional Unicode characters, no HTML comments in
      agent-loaded markdown, no encoded (base64 or similar) content
- [ ] Any new URL in agent-loaded files is added to
      `scripts/url-allowlist.txt` in this PR, with the reason explained above
- [ ] Every change can be explained in plain English — nothing in this diff
      does something other than what it appears to do
