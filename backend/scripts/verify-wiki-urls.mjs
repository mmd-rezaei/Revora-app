/**
 * HEAD-check Wikimedia image URLs used in the catalog.
 * Usage: node scripts/verify-wiki-urls.mjs [--iranian]
 */
import { CAR_IMAGES } from "../src/seed/carImages.js";
import { catalog } from "../src/seed/catalog.js";

const iranianOnly = process.argv.includes("--iranian");
const iranianBrands = new Set([
  "Iran Khodro", "Saipa", "Bahman Motor", "Kerman Motor", "Modiran Khodro",
  "Fownix", "Pars Khodro", "Zamyad", "Foton", "Haima", "SWM", "Safeer", "Dongfeng", "Changan",
]);

const urls = new Map();
for (const b of catalog) {
  if (iranianOnly && !iranianBrands.has(b.name)) continue;
  for (const m of b.models) {
    for (const g of m.generations) {
      for (const c of g.cars) {
        for (const url of c.images || []) {
          if (!url || url.includes("Car_icon")) continue;
          if (!urls.has(url)) urls.set(url, []);
          urls.get(url).push(`${b.name} | ${m.name} | ${c.trim}`);
        }
      }
    }
  }
}

const broken = [];
let ok = 0;

for (const [url, cars] of urls) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || ct.includes("text/html")) {
      broken.push({ url, status: res.status, ct, sample: cars[0] });
    } else {
      ok += 1;
    }
  } catch (err) {
    broken.push({ url, status: "ERR", ct: err.message, sample: cars[0] });
  }
}

console.log(JSON.stringify({ checked: urls.size, ok, broken: broken.length }, null, 2));
if (broken.length) {
  console.log("\nBroken URLs:");
  for (const b of broken.slice(0, 40)) {
    console.log(`  [${b.status}] ${b.sample}`);
    console.log(`    ${b.url.slice(0, 120)}...`);
  }
  process.exitCode = 1;
}
