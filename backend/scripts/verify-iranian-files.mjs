/**
 * Quick check: IRANIAN_IMAGES filenames resolve on Wikimedia.
 */
import { wiki } from "../src/seed/carImages.js";
import { IRANIAN_IMAGES } from "../src/seed/carImages.iranian.js";

const broken = [];
let ok = 0;

for (const [key, files] of Object.entries(IRANIAN_IMAGES)) {
  for (const file of files) {
    const url = wiki(file);
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || ct.includes("text/html")) {
        broken.push({ key, file, status: res.status, ct });
      } else {
        ok += 1;
      }
    } catch (err) {
      broken.push({ key, file, status: "ERR", ct: err.message });
    }
    await new Promise((r) => setTimeout(r, 150));
  }
}

console.log(JSON.stringify({ ok, broken: broken.length }, null, 2));
for (const b of broken) {
  console.log(`  [${b.status}] ${b.key}: ${b.file}`);
}
process.exitCode = broken.length ? 1 : 0;
