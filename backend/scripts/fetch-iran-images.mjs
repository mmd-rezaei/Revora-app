/**
 * Fetch verified Wikimedia images for Iranian-market cars.
 * Writes: backend/src/seed/carImages.iranian.js
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("src/seed/carImages.iranian.js");

/** @type {Record<string, { exterior: string, interior?: string }>} */
const SEARCHES = {
  ikco_paykan: { exterior: "Paykan Iran Khodro", interior: "Paykan interior Iran" },
  ikco_hillman_hunter: { exterior: "Hillman Hunter Iran Peykan" },
  ikco_peugeot_205: { exterior: "Peugeot 205 Iran" },
  ikco_peugeot_405: { exterior: "Peugeot 405 Iran Khodro", interior: "Peugeot 405 interior" },
  ikco_peugeot_rd: { exterior: "Peugeot RD Iran" },
  ikco_peugeot_roa: { exterior: "Peugeot ROA Iran روآ" },
  ikco_peugeot_301: { exterior: "Peugeot 301 Iran" },
  ikco_peugeot_407: { exterior: "Peugeot 407 Iran" },
  ikco_samand: { exterior: "IKCO Samand Iran", interior: "Samand interior Iran" },
  ikco_soren_plus: { exterior: "IKCO Soren Plus Iran", interior: "Soren interior" },
  ikco_runna_lx: { exterior: "IKCO Runna Iran" },
  ikco_dena_ef7: { exterior: "IKCO Dena EF7 Iran" },
  ikco_rira: { exterior: "IKCO Rira Iran" },
  ikco_arisun: { exterior: "IKCO Arisun pickup Iran" },
  ikco_arisun2: { exterior: "IKCO Arisun 2 Iran" },
  pars_tondar_90: { exterior: "Renault Tondar 90 Iran", interior: "Tondar 90 interior" },
  pars_captur: { exterior: "Renault Captur Iran" },
  bahman_grand_vitara: { exterior: "Suzuki Grand Vitara Iran" },
  bahman_kizashi: { exterior: "Suzuki Kizashi" },
  bahman_vitara: { exterior: "Suzuki Vitara Iran Bahman" },
  bahman_swift: { exterior: "Suzuki Swift Iran" },
  bahman_mazda2: { exterior: "Mazda 2 Iran Bahman" },
  bahman_mazda3: { exterior: "Mazda 3 Iran Bahman" },
  bahman_cx5: { exterior: "Mazda CX-5 Iran" },
  bahman_cx30: { exterior: "Mazda CX-30 Iran" },
  dongfeng_h30: { exterior: "Dongfeng H30 Cross Iran" },
  dongfeng_s30: { exterior: "Dongfeng S30 Iran" },
  haima_s5: { exterior: "Haima S5 Iran", interior: "Haima S5 interior" },
  haima_s7: { exterior: "Haima S7 Iran" },
  haima_8s: { exterior: "Haima 8S Iran" },
  haima_7x: { exterior: "Haima 7X Iran Kerman Motor" },
  haima_7x_pro: { exterior: "Haima 7X Pro Iran" },
  foton_tunland: { exterior: "Foton Tunland Iran pickup" },
  foton_g7: { exterior: "Foton G7 pickup" },
  swm_gre: { exterior: "SWM G01 Iran" },
  k112_enoy: { exterior: "Enoy electric SUV Iran" },
  safeer_r7: { exterior: "Seres R7 Iran Safeer" },
  saipa_jyan: { exterior: "Saipa Jyan ژیان" },
  saipa_renault_5: { exterior: "Renault 5 Iran Saipa" },
  saipa_renault_21: { exterior: "Renault 21 Iran Saipa" },
  saipa_zantia: { exterior: "Citroen Xantia Iran Saipa" },
  saipa_rio: { exterior: "Kia Rio Iran Saipa" },
  saipa_cerato: { exterior: "Saipa Cerato Iran" },
  saipa_citroen_c3: { exterior: "Citroen C3 Iran Saipa" },
  saipa_citroen_c5: { exterior: "Citroen C5 Iran Saipa" },
  saipa_ario: { exterior: "Saipa Ario Iran" },
  saipa_atlas: { exterior: "Saipa Atlas Iran اطلس", interior: "Saipa Atlas interior" },
  saipa_sahand: { exterior: "Saipa Sahand Iran سهند" },
  saipa_aria: { exterior: "Saipa Aria Iran آریا" },
  saipa_cadila: { exterior: "Saipa Cadila P90 Iran" },
  saipa_tiba1: { exterior: "Saipa Tiba Iran تیبا" },
  saipa_shahin_plus: { exterior: "Saipa Shahin Plus Iran شاهین" },
  saipa_shahin: { exterior: "Saipa Shahin Iran" },
  saipa_quick_r: { exterior: "Saipa Quick Iran کوییک" },
  saipa_saina: { exterior: "Saipa Saina Iran سaina" },
  saipa_pride_111: { exterior: "Saipa Pride Iran پراید", interior: "Pride interior" },
  saipa_pride_132: { exterior: "Saipa Pride 132 Iran" },
  saipa_tiba: { exterior: "Saipa Tiba 2 Iran" },
  saipa_cs35: { exterior: "Changan CS35 Iran Saipa" },
  changan_cs15: { exterior: "Changan CS15 Iran" },
  changan_cs55: { exterior: "Changan CS55 Plus Iran" },
  changan_unik: { exterior: "Changan Uni-K Iran" },
  changan_eado: { exterior: "Changan Eado Iran" },
  zamyad_nissan_pickup: { exterior: "Zamyad Nissan pickup Iran" },
  zamyad_shoka: { exterior: "Zamyad Shoka Iran شوکا" },
  zamyad_padra: { exterior: "Zamyad Padra Iran پادرا" },
  zamyad_zagros: { exterior: "Zamyad Zagros Iran زاگرس" },
  zamyad_karoon: { exterior: "Zamyad Karoon Iran کارون" },
  mvm_x22: { exterior: "MVM X22 Iran Modiran Khodro" },
  mvm_x33s: { exterior: "MVM X33 S Iran" },
  mvm_x55_pro: { exterior: "MVM X55 Pro Iran" },
  mvm_x77: { exterior: "MVM X77 Iran Tiggo 8" },
  mvm_arrizo5: { exterior: "MVM Arrizo 5 Iran" },
  mvm_arrizo6_pro: { exterior: "MVM Arrizo 6 Pro Iran" },
  mvm_tiggo7_pro: { exterior: "MVM Tiggo 7 Pro Iran" },
  mvm_tiggo8_pro: { exterior: "MVM Tiggo 8 Pro Iran" },
  fownix_fx: { exterior: "Fownix FX Iran فونیکس" },
  fownix_tiggo7: { exterior: "Fownix Tiggo 7 Pro Iran" },
  fownix_arrizo6: { exterior: "Fownix Arrizo 6 GT Iran" },
  kmc_j7: { exterior: "KMC J7 pickup Iran" },
  kmc_t8: { exterior: "KMC T8 pickup Iran" },
  kmc_x5: { exterior: "KMC X5 SUV Iran" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(q) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: q,
      gsrnamespace: "6",
      gsrlimit: "8",
      prop: "imageinfo",
      iiprop: "url|mime",
      format: "json",
      origin: "*",
    });
  const res = await fetch(url, { headers: { "User-Agent": "REVORA-Seed/1.0 (iran-images)" } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages
    .filter((p) => p.imageinfo?.[0]?.mime?.startsWith("image/"))
    .map((p) => p.title.replace(/^File:/, ""));
}

const out = {};

for (const [key, { exterior, interior }] of Object.entries(SEARCHES)) {
  const files = new Set();
  try {
    for (const f of await search(exterior)) files.add(f);
    await sleep(1500);
    if (interior) {
      for (const f of await search(interior)) files.add(f);
      await sleep(1500);
    }
    out[key] = [...files].slice(0, 6);
    console.log(`${key}: ${out[key].length} files`);
  } catch (e) {
    console.warn(`FAIL ${key}:`, e.message);
    out[key] = [];
  }
  await sleep(1200);
}

const lines = [
  "/** Auto-generated by scripts/fetch-iran-images.mjs — verified Wikimedia Iran-market photos. */",
  "/** @type {Record<string, string[]>} */",
  "export const IRANIAN_IMAGES = {",
];

for (const [key, files] of Object.entries(out).sort(([a], [b]) => a.localeCompare(b))) {
  if (!files.length) continue;
  lines.push(`  ${JSON.stringify(key)}: [`);
  for (const f of files) lines.push(`    ${JSON.stringify(f)},`);
  lines.push("  ],");
}
lines.push("};", "");

await fs.writeFile(OUT, lines.join("\n"), "utf8");
console.log(`\nWrote ${OUT}`);
