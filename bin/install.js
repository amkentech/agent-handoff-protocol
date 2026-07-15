#!/usr/bin/env node
/**
 * agent-handoff-protocol installer
 *
 * Usage:  npx agent-handoff-protocol [target-dir]
 *
 * BMAD-style setup: detects which agent tools the target project uses,
 * installs the orchestrated-handoff skill into each tool's native location,
 * and scaffolds a .orchestrated/ folder (protocol docs + bindings template).
 *
 * The installer is the mechanical half of setup. The judgment half -- the
 * bindings interview (store, channel, roles, escalation) -- is run BY YOUR
 * AGENT afterward: the skill refuses to do work until bindings are complete
 * and interviews the team on first run.
 *
 * Plain Node, no dependencies. Idempotent: re-running refreshes skill files
 * but never overwrites an existing filled-in bindings file.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..");
const TARGET = path.resolve(process.cwd(), process.argv[2] || ".");

function read(rel) {
  return fs.readFileSync(path.join(SRC, rel), "utf8");
}

function write(absPath, content, { overwrite = true } = {}) {
  if (!overwrite && fs.existsSync(absPath)) {
    return { path: absPath, action: "kept (exists)" };
  }
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, "utf8");
  return { path: absPath, action: "written" };
}

function detect() {
  const has = (rel) => fs.existsSync(path.join(TARGET, rel));
  return {
    claude: has(".claude") || has("CLAUDE.md"),
    copilot: has(".github"),
    cursor: has(".cursor") || has(".cursorrules"),
    git: has(".git"),
  };
}

function main() {
  if (!fs.existsSync(TARGET) || !fs.statSync(TARGET).isDirectory()) {
    console.error(`Target is not a directory: ${TARGET}`);
    process.exit(1);
  }

  const skill = read(path.join("skills", "orchestrated-handoff", "SKILL.md"));
  const found = detect();
  const results = [];
  const installedFor = [];

  // --- Per-tool skill installation (native location for each) ---

  // Claude Code: project skill
  if (found.claude) {
    results.push(
      write(
        path.join(TARGET, ".claude", "skills", "orchestrated-handoff", "SKILL.md"),
        skill
      )
    );
    installedFor.push("Claude Code (.claude/skills/)");
  }

  // GitHub Copilot: instructions file
  if (found.copilot) {
    // Strip the Claude-skill YAML frontmatter for the Copilot copy.
    const body = skill.replace(/^---\n[\s\S]*?\n---\n/, "");
    results.push(
      write(
        path.join(
          TARGET,
          ".github",
          "instructions",
          "orchestrated-handoff.instructions.md"
        ),
        '---\napplyTo: "**"\n---\n' + body
      )
    );
    installedFor.push("GitHub Copilot (.github/instructions/)");
  }

  // Cursor: rules file
  if (found.cursor) {
    const body = skill.replace(/^---\n[\s\S]*?\n---\n/, "");
    results.push(
      write(
        path.join(TARGET, ".cursor", "rules", "orchestrated-handoff.mdc"),
        "---\ndescription: Orchestrated-handoff coordination protocol for human-agent teams\nalwaysApply: true\n---\n" +
          body
      )
    );
    installedFor.push("Cursor (.cursor/rules/)");
  }

  // No tool detected: install the generic copy so any agent can be pointed at it.
  if (installedFor.length === 0) {
    results.push(
      write(
        path.join(TARGET, ".orchestrated", "skill", "SKILL.md"),
        skill
      )
    );
    installedFor.push("generic (.orchestrated/skill/ -- point any agent's instructions at it)");
  }

  // --- Shared scaffold: .orchestrated/ (protocol reference + bindings) ---

  const scaffold = [
    ["protocol/states.md", true],
    ["protocol/store-contract.md", true],
    ["protocol/work-item.schema.json", true],
    ["protocol/handoff.schema.json", true],
    ["templates/work-item-prompt.md", true],
    ["templates/handoff-template.md", true],
    ["examples/confluence-setup.md", true],
  ];
  for (const [rel, overwrite] of scaffold) {
    results.push(
      write(path.join(TARGET, ".orchestrated", rel), read(rel), { overwrite })
    );
  }

  // Bindings: NEVER overwrite -- it holds the team's filled-in agreement.
  results.push(
    write(path.join(TARGET, ".orchestrated", "bindings.md"), read(path.join("templates", "bindings.md")), {
      overwrite: false,
    })
  );

  // --- Report ---

  console.log("\nagent-handoff-protocol installer\n");
  console.log(`Target: ${TARGET}\n`);
  console.log("Installed skill for:");
  for (const t of installedFor) console.log(`  - ${t}`);
  console.log("\nFiles:");
  for (const r of results) {
    console.log(`  ${r.action.padEnd(14)} ${path.relative(TARGET, r.path)}`);
  }
  console.log(`
Next step -- run the setup interview (the judgment half):

  Open your agent in this project and say:

      "Run the orchestrated-handoff setup interview."

  The agent will interview your team (work store, notification channel,
  roles, escalation contacts), validate the store against
  .orchestrated/protocol/store-contract.md, and write the completed agreement
  to .orchestrated/bindings.md. The skill refuses to run work items until
  bindings are complete.
`);
}

main();
