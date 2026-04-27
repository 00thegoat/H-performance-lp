// Replaces all <video> elements in replica.template.html with <img> using
// the video's poster attribute. Also strips video play-button overlays.
// Run after editing, then `npm run patch` to regenerate.

import { readFileSync, writeFileSync } from "node:fs";

const TPL = "replica.template.html";
let html = readFileSync(TPL, "utf8");
const before = html.length;

// 1) Match each <video ... poster="X" ... ></video> (or <video ...></video>) and
//    replace with <img src="X" .../>.  Handles quoted and unquoted poster values.
const videoRe = /<video\b[^>]*?\bposter=("([^"]+)"|([^\s>]+))[^>]*?>(?:[\s\S]*?<\/video>)?/g;

let videoCount = 0;
html = html.replace(videoRe, (match, _q, qval, uval) => {
  const poster = qval || uval;
  videoCount++;
  return (
    `<img src="${poster}" alt="" loading="lazy" ` +
    `style="height:100%;width:100%;object-fit:cover;object-position:center center" />`
  );
});
console.log(`✓ replaced ${videoCount} <video> elements with <img>`);

// 2) Strip the play-button / preview overlay buttons that Wix renders.
//    They have aria-label like "My video.mp4 Reproduzir vídeo" or contain
//    class wixui-media-player or MediaPlayer controls.
const overlayRe = /<button\b[^>]*aria-label="[^"]*Reproduzir[^"]*"[^>]*>[\s\S]*?<\/button>/g;
const beforeStrip = html.length;
html = html.replace(overlayRe, "");
const stripped = beforeStrip - html.length;
if (stripped > 0) console.log(`✓ stripped play-button overlay (${stripped} chars)`);

// Strip wixui-media-overlay-controls if present
const ctrlRe = /<div\b[^>]*\bwixui-media-overlay-controls\b[^>]*>[\s\S]*?<\/div>/g;
const before2 = html.length;
html = html.replace(ctrlRe, "");
const stripped2 = before2 - html.length;
if (stripped2 > 0) console.log(`✓ stripped overlay-controls (${stripped2} chars)`);

writeFileSync(TPL, html);
console.log(`\n✅ ${before} → ${html.length} bytes`);
