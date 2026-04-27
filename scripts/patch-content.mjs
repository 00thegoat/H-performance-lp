// Patcher.
// Reads content.json + replica.template.html → writes public/replica.html.
// Run this every time you edit content.json.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const TEMPLATE = "replica.template.html";
const CONTENT = "content.json";
const OUT = "public/replica.html";

if (!existsSync(TEMPLATE) || !existsSync(CONTENT)) {
  console.error(
    `✗ Missing ${TEMPLATE} or ${CONTENT}. Run \`npm run extract\` first.`
  );
  process.exit(1);
}

const tpl = readFileSync(TEMPLATE, "utf8");
const content = JSON.parse(readFileSync(CONTENT, "utf8"));

let out = tpl;
let count = 0;
for (const [key, value] of Object.entries(content)) {
  const placeholder = `{{${key}}}`;
  if (out.includes(placeholder)) {
    // Re-encode common entities to keep HTML safe
    const safe = String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // function form bypasses $-pattern handling (so values like "$2M+" survive)
    out = out.replaceAll(placeholder, () => safe);
    count++;
  }
}

writeFileSync(OUT, out);
console.log(`✓ Patched ${count} fields → ${OUT}`);
console.log(`  Reload http://localhost:3000/ to see changes.`);
