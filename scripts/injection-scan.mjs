#!/usr/bin/env node
/**
 * injection-scan.mjs — zero-dependency content scanner for this repo.
 *
 * The files in skills/, templates/, protocol/ and examples/ are loaded into
 * AI agents' contexts by every adopter. A malicious change to them is a
 * prompt injection distributed through npm. This scanner catches the
 * vectors that don't survive human review of a rendered diff:
 *
 *   1. Invisible / bidirectional Unicode characters (anywhere in the repo)
 *   2. HTML comments in agent-loaded markdown (invisible when rendered,
 *      read by agents)
 *   3. Long base64-like blobs (encoded payloads)
 *   4. URLs in agent-loaded files that aren't on the allowlist
 *      (scripts/url-allowlist.txt, prefix match)
 *
 * Exits 1 with a file:line report if anything trips. Plain Node >= 18.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SKIP_DIRS = new Set([".git", "node_modules", ".github"]);
const AGENT_DIRS = ["skills", "templates", "protocol", "examples"];

// Characters that are invisible or reorder text. None of them belong in
// this repo. (Plain ASCII plus normal accented text never trips this.)
const INVISIBLE = new RegExp(
  "[" +
    "\\u00AD" + // soft hyphen
    "\\u200B-\\u200F" + // zero-width space/joiner/non-joiner, LRM, RLM
    "\\u202A-\\u202E" + // bidi embedding/override
    "\\u2060-\\u2064" + // word joiner, invisible operators
    "\\u2066-\\u2069" + // bidi isolates
    "\\uFEFF" + // zero-width no-break space / BOM
    "\\uFFF9-\\uFFFB" + // interlinear annotation
    "\\u{E0000}-\\u{E007F}" + // tag characters
  "]",
  "u"
);

const BASE64_BLOB = /[A-Za-z0-9+/]{80,}={0,2}/;
const URL_RE = /(?:https?:|data:)[^\s)\]"'`>]+/g;

const allowlist = readFileSync(join(ROOT, "scripts", "url-allowlist.txt"), "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(full);
    } else {
      yield full;
    }
  }
}

const findings = [];

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join("/");
  const inAgentDir = AGENT_DIRS.some((d) => rel.startsWith(d + "/"));
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, i) => {
    const where = `${rel}:${i + 1}`;

    if (INVISIBLE.test(line)) {
      const ch = line.match(INVISIBLE)[0];
      const code = "U+" + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
      findings.push(`${where}  invisible/bidi character ${code}`);
    }

    if (BASE64_BLOB.test(line)) {
      findings.push(`${where}  base64-like blob (${line.match(BASE64_BLOB)[0].length} chars)`);
    }

    if (inAgentDir) {
      if (rel.endsWith(".md") && line.includes("<!--")) {
        findings.push(`${where}  HTML comment in agent-loaded markdown`);
      }
      for (const url of line.match(URL_RE) ?? []) {
        if (!allowlist.some((prefix) => url.startsWith(prefix))) {
          findings.push(`${where}  URL not on allowlist: ${url}`);
        }
      }
    }
  });
}

if (findings.length) {
  console.error("injection-scan: FAIL\n");
  for (const f of findings) console.error("  " + f);
  console.error(
    "\nIf a finding is legitimate (e.g. a real URL a doc needs), add it to" +
      "\nscripts/url-allowlist.txt in the same PR and explain why in the PR body."
  );
  process.exit(1);
}

console.log("injection-scan: clean");
