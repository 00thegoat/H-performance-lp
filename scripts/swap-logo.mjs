// Replaces the Wix wordmark SVG (viewBox "0 0 818.71 129.69") with the
// H Performance logo image. Targets replica.template.html — re-run `npm run patch`
// after to regenerate the snapshot modules.

import { readFileSync, writeFileSync } from "node:fs";

const TPL = "replica.template.html";
const LOGO_SRC = "/images/Logo_white.png";

let html = readFileSync(TPL, "utf8");
const before = html.length;

// Match the entire <svg ...viewBox="0 0 818.71 129.69"...>...</svg> block
// (the wordmark SVG) and replace with an <img>. Use a non-greedy match.
const re = /<svg\b[^>]*viewBox="0 0 818\.71 129\.69"[^>]*>[\s\S]*?<\/svg>/g;

const replacement =
  `<img src="${LOGO_SRC}" alt="H Performance" ` +
  `style="height:100%;width:auto;max-height:48px;object-fit:contain;display:block" />`;

let count = 0;
html = html.replace(re, () => {
  count++;
  return replacement;
});

writeFileSync(TPL, html);
console.log(`✓ swapped ${count} wordmark SVG(s) with <img src="${LOGO_SRC}">`);
console.log(`  size: ${before} → ${html.length} bytes`);
console.log(`\nNow run \`npm run patch\` to regenerate the snapshot modules.`);
