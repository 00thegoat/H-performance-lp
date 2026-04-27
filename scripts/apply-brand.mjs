// Applies the H LLC brand to the snapshot template:
//   - replaces remaining Portuguese / old-brand strings in replica.template.html
//   - replaces Wix brand colors with H LLC palette
//   - swaps Wix custom fonts with the H LLC typography stack
//
// Run with `node scripts/apply-brand.mjs`. Then run `npm run patch` to regenerate.

import { readFileSync, writeFileSync } from "node:fs";

const TPL = "replica.template.html";
let html = readFileSync(TPL, "utf8");
const beforeLen = html.length;

// 1) Direct text replacements (any occurrence, all of them)
const TEXT_REPLACES = [
  // Old PT CTAs that the placeholder system missed
  ["Fale com nossos especialistas!", "Talk to Our Specialists"],
  ["Fale com nossos especialistas", "Talk to Our Specialists"],
  // Old emails — replace anywhere
  ["renato@lavorovitta.com.br", "hperformancebusiness@gmail.com"],
  ["jeferson@lavorovitta.com.br", "hperformancebusiness@gmail.com"],
  // Old visible names that might survive
  ["Eng. Renato Lavorenti", "Talk to Our Team"],
  ["Arq. Jeferson Vitti", "Partnerships"],
  // Old phone numbers (in tel: links and visible text)
  ["(19) 99929.5577", "+1 (202) 510-8649"],
  ["(19) 99707.5797", "+1 (202) 510-8649"],
  ["+5519999295577", "+12025108649"],
  ["+5519997075797", "+12025108649"],
  // Old address parts (just in case)
  [
    "Rua Alfredo Guedes, 937 - Sala 4, Bairro Alto, Piracicaba/SP Cep: 13419-075.",
    "30 Wall Street, New York, NY 10005",
  ],
];

for (const [from, to] of TEXT_REPLACES) {
  const re = new RegExp(
    from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "g"
  );
  const before = html.length;
  html = html.replace(re, to);
  const replaced = (before - html.length + (to.length - from.length) * countOccurrences(html, to)) / Math.max(from.length - to.length, 1);
  // simpler: just count regex matches
  const count = (readFileSync(TPL, "utf8").match(re) || []).length; // not perfect but informative
  if (before !== html.length || count > 0) {
    console.log(`  text: "${from.slice(0, 40)}..." → "${to}" (${count}x)`);
  }
}

function countOccurrences(s, needle) {
  if (!needle) return 0;
  let c = 0,
    i = 0;
  while ((i = s.indexOf(needle, i)) >= 0) {
    c++;
    i += needle.length;
  }
  return c;
}

// 2) Brand color overrides — H LLC palette
//    primary yellow:  #EDFF8B   (replaces Wix navy)
//    strong black:    #000000   (replaces Wix ink)
//    yellow gradient: #8E9953   (used in some hover states)
//
//    All known Wix brand colors found in the snapshot CSS:
//      #07405B  Wix navy (main accent)        → #EDFF8B  H yellow
//      #1B2325  Wix ink  (text/dark)          → #000000  H black
//      #2B328C  Wix deep blue                  → #EDFF8B
//      #5E97FF  Wix light blue                 → #8E9953  yellow gradient
//      #D6DEF5  Wix very light blue (bg tint)  → #FAFAFA  near-white
//      #ED1566  Wix pink                       → #EDFF8B  (rare; reuse yellow)
const COLOR_REPLACES = [
  ["07405B", "EDFF8B"],
  ["07405b", "EDFF8B"],
  ["1B2325", "000000"],
  ["1b2325", "000000"],
  ["2B328C", "EDFF8B"],
  ["2b328c", "EDFF8B"],
  ["5E97FF", "8E9953"],
  ["5e97ff", "8E9953"],
  ["D6DEF5", "FAFAFA"],
  ["d6def5", "FAFAFA"],
  ["ED1566", "EDFF8B"],
  ["ed1566", "EDFF8B"],
  // Wix UI blue used for buttons/links/focus states
  ["116dff", "EDFF8B"],
  ["116DFF", "EDFF8B"],
  ["075cdf", "8E9953"],
  ["075CDF", "8E9953"],
  ["3899ec", "EDFF8B"],
  ["3899EC", "EDFF8B"],
];
for (const [from, to] of COLOR_REPLACES) {
  const re = new RegExp(`#${from}\\b`, "g");
  const before = html.length;
  html = html.replace(re, `#${to}`);
  if (before !== html.length) console.log(`  color: #${from} → #${to}`);
}

// 3) Font overrides
//    The Wix snapshot uses Plus Jakarta Sans + various Wix-loaded variants.
//    We swap the primary font-family keyword to a Frutiger-style stack.
//    "Neue Frutiger" is paid; we use a clean fallback chain that approximates it.
const FONT_REPLACES = [
  // catch font-family declarations using Wix variable fonts
  [
    /font-family:\s*[^;}{]*orig_plus_jakarta_sans_semibold[^;}]*;/gi,
    "font-family: 'Frutiger', 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 600;",
  ],
  [
    /font-family:\s*[^;}{]*orig_plus_jakarta_sans_regular[^;}]*;/gi,
    "font-family: 'Frutiger', 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 400;",
  ],
  [
    /font-family:\s*plus[\s_+]?jakarta[\s_+]?sans[^;}]*;/gi,
    "font-family: 'Frutiger', 'Inter', 'Segoe UI', system-ui, sans-serif;",
  ],
];
for (const [re, repl] of FONT_REPLACES) {
  const before = html.length;
  html = html.replace(re, repl);
  if (before !== html.length) console.log(`  font: applied ${re}`);
}

// 4) Replace social icons (img-9 / img-10 / img-11) with the new SVG icons
const SOCIAL_REPLACES = [
  ["/images/img-9-9a7f54026b.avif", "/images/instagram.svg"],
  ["/images/img-10-475b8d273b.avif", "/images/facebook.svg"],
  ["/images/img-11-d54af5d616.avif", "/images/linkedin.svg"],
];
for (const [from, to] of SOCIAL_REPLACES) {
  const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  const before = html.length;
  html = html.replace(re, to);
  if (before !== html.length) console.log(`  social: ${from} → ${to}`);
}

// 5) Cleanup ALL old-brand URLs and external Wix references
//    Replace href values that reference the old Wix site/CDN with safe placeholders.
const URL_REPLACES = [
  // Video URLs that linger as <a href> wrappers (point to old Wix CDN videos)
  ["https://video.wixstatic.com/video/746aad_39fbb3f6c8c1429fa868c751175bb27c/1080p/mp4/file.mp4", "#"],
  ["https://video.wixstatic.com/video/746aad_59e6afece9454ab0a28e472d13810fec/1080p/mp4/file.mp4", "#"],
  ["https://video.wixstatic.com/video/746aad_e4451ea5bc18428cb8d4dbbc090e5258/1080p/mp4/file.mp4", "#"],
  // Old social media links
  ["https://www.instagram.com/lavorovitta/", "#"],
  ["https://www.facebook.com/lavorovitta/?locale=pt_BR", "#"],
  ["https://www.linkedin.com/company/lavorovitta", "#"],
  // Old root + blog feed
  ["https://www.lavorovitta.com.br/blog-feed.xml", "#"],
  ["https://www.lavorovitta.com.br/", "#"],
  ["https://www.lavorovitta.com.br", "#"],
];
function escapeRe(s) {
  return s.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
for (const [from, to] of URL_REPLACES) {
  const esc = escapeRe(from);
  // match both quoted and unquoted href values
  const re1 = new RegExp(`href="${esc}"`, "g");
  const re2 = new RegExp(`href=${esc}(?=[\\s>])`, "g");
  let count = 0;
  html = html.replace(re1, () => {
    count++;
    return `href="${to}"`;
  });
  html = html.replace(re2, () => {
    count++;
    return `href=${to}`;
  });
  if (count > 0)
    console.log(`  url: ${from.slice(0, 50)}... → ${to} (${count}x)`);
}

// Remove any remaining Wix CDN <link rel="stylesheet"> tags — CSS is already inlined locally
const wixCdnLinkRe = /<link[^>]*\bhref="https:\/\/static\.parastorage\.com[^"]*"[^>]*\/?>/g;
const beforeLinks = html.length;
html = html.replace(wixCdnLinkRe, "");
const removedLinks = beforeLinks - html.length;
if (removedLinks > 0) console.log(`  removed Wix CDN <link> tags (${removedLinks} chars)`);

writeFileSync(TPL, html);
console.log(`\n✅ brand applied. ${beforeLen} → ${html.length} bytes`);
console.log(`Run \`npm run patch\` to regenerate the snapshot modules.`);
