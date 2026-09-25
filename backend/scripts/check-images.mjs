/**
 * Report catalog image coverage before seed.
 * Usage: node scripts/check-images.mjs
 */
import { catalog } from "../src/seed/catalog.js";
import { carImg } from "../src/seed/carImages.js";

const PLACEHOLDER = /Car[_%20]icon|Car%20icon/i;

let total = 0;
let missing = 0;
const badKeys = new Set();

for (const brand of catalog) {
  for (const model of brand.models) {
    for (const gen of model.generations) {
      for (const car of gen.cars) {
        total += 1;
        const urls = car.images?.length ? car.images : carImg("");
        const hasReal = urls.some((url) => url && !PLACEHOLDER.test(url));
        if (!hasReal) {
          missing += 1;
        }
      }
    }
  }
}

console.log(JSON.stringify({ total, missing, covered: total - missing, pct: `${(((total - missing) / total) * 100).toFixed(1)}%` }, null, 2));

if (missing > 0) {
  process.exitCode = 1;
}
