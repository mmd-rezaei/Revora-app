import { catalog } from "../src/seed/catalog.js";

const byImages = new Map();
const bySpecs = new Map();
let broken = 0;

for (const b of catalog) {
  for (const m of b.models) {
    for (const g of m.generations) {
      for (const c of g.cars) {
        const imgKey = (c.images || []).join("|");
        if (!byImages.has(imgKey)) byImages.set(imgKey, []);
        byImages.get(imgKey).push(`${b.name} | ${m.name} | ${c.trim}`);

        const specKey = [c.horsepower, c.engine, c.transmission, c.zeroToHundred, c.weight].join("|");
        const specLabel = `${b.name} | ${m.name} | ${g.name} | ${c.trim}`;
        if (!bySpecs.has(specKey)) bySpecs.set(specKey, []);
        bySpecs.get(specKey).push(specLabel);
      }
    }
  }
}

const dupImages = [...byImages.entries()].filter(([, cars]) => cars.length > 1).sort((a, b) => b[1].length - a[1].length);
const dupSpecs = [...bySpecs.entries()].filter(([, cars]) => cars.length > 1).sort((a, b) => b[1].length - a[1].length);

console.log("=== Duplicate image sets (top 15) ===");
for (const [, cars] of dupImages.slice(0, 15)) {
  console.log(`\n${cars.length} cars share images:`);
  for (const c of cars.slice(0, 8)) console.log(" ", c);
  if (cars.length > 8) console.log(`  ... +${cars.length - 8} more`);
}

console.log("\n=== Duplicate specs (top 10) ===");
for (const [, cars] of dupSpecs.slice(0, 10)) {
  console.log(`\n${cars.length} cars share specs:`);
  for (const c of cars.slice(0, 6)) console.log(" ", c);
}

const iranianBrands = ["Iran Khodro", "Saipa", "Bahman Motor", "Kerman Motor", "Modiran Khodro", "Fownix", "Pars Khodro", "Zamyad", "Foton"];
let iranianDup = 0;
for (const [, cars] of dupImages) {
  if (cars.some((c) => iranianBrands.some((b) => c.startsWith(b)))) iranianDup += cars.length;
}
console.log(`\nIranian cars in duplicate image groups: ~${iranianDup}`);
