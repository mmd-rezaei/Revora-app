/** Fetch Wikimedia filenames for Iranian car models. */
const SEARCHES = {
  ikco_paykan: "Paykan Iran Khodro",
  ikco_hillman_hunter: "Hillman Hunter Iran",
  ikco_peugeot_205: "Peugeot 205 Iran",
  ikco_peugeot_405: "Peugeot 405 Iran",
  ikco_peugeot_rd: "Peugeot RD Iran",
  ikco_peugeot_roa: "Peugeot ROA Iran",
  ikco_peugeot_301: "Peugeot 301 Iran",
  ikco_peugeot_407: "Peugeot 407 Iran",
  ikco_samand: "IKCO Samand",
  ikco_soren_plus: "IKCO Soren Plus",
  ikco_runna_lx: "IKCO Runna LX",
  ikco_dena_ef7: "IKCO Dena EF7",
  ikco_rira: "IKCO Rira",
  ikco_arisun: "IKCO Arisun",
  ikco_arisun2: "IKCO Arisun 2",
  pars_tondar_90: "Renault Tondar 90 Iran",
  pars_captur: "Renault Captur Iran",
  bahman_grand_vitara: "Suzuki Grand Vitara Iran",
  bahman_kizashi: "Suzuki Kizashi",
  dongfeng_h30: "Dongfeng H30 Cross",
  dongfeng_s30: "Dongfeng S30",
  haima_s5: "Haima S5",
  haima_s7: "Haima S7",
  haima_8s: "Haima 8S",
  haima_7x: "Haima 7X",
  foton_tunland: "Foton Tunland",
  foton_g7: "Foton G7",
  swm_gre: "SWM G01",
  saipa_jyan: "Saipa Jyan",
  saipa_renault_5: "Renault 5 Iran Saipa",
  saipa_renault_21: "Renault 21 Iran",
  saipa_zantia: "Citroen Xantia Iran",
  saipa_rio: "Kia Rio Iran Saipa",
  saipa_cerato: "Kia Cerato Iran",
  saipa_citroen_c3: "Citroen C3 Iran",
  saipa_citroen_c5: "Citroen C5 Iran",
  saipa_ario: "Saipa Ario",
  saipa_atlas: "Saipa Atlas",
  saipa_sahand: "Saipa Sahand",
  saipa_aria: "Saipa Aria",
  saipa_cadila: "Cadila P90",
  changan_cs15: "Changan CS15",
  changan_cs55: "Changan CS55 Plus",
  changan_unik: "Changan Uni-K",
  changan_eado: "Changan Eado",
  zamyad_nissan_pickup: "Nissan pickup Iran Zamyad",
  zamyad_shoka: "Zamyad Shoka",
  zamyad_padra: "Zamyad Padra",
  zamyad_zagros: "Zamyad Zagros",
  zamyad_karoon: "Zamyad Karoon",
  saipa_tiba1: "Saipa Tiba",
  saipa_shahin_plus: "Saipa Shahin Plus",
  saipa_quick_plus: "Saipa Quick Plus",
  k112_enoy: "Enoy electric Iran",
  safeer_r7: "Seres R7 Iran",
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
      gsrlimit: "3",
      prop: "imageinfo",
      iiprop: "url|mime",
      format: "json",
      origin: "*",
    });
  const res = await fetch(url, { headers: { "User-Agent": "REVORA-Seed/1.0" } });
  const text = await res.text();
  if (!text.startsWith("{")) throw new Error(text.slice(0, 80));
  const data = JSON.parse(text);
  const pages = Object.values(data.query?.pages || {});
  const hit = pages.find((p) => p.imageinfo?.[0]?.mime?.startsWith("image/"));
  return hit ? hit.title.replace(/^File:/, "") : null;
}

const out = {};
for (const [key, q] of Object.entries(SEARCHES)) {
  try {
    out[key] = await search(q);
    console.log(key + ":", out[key] || "NONE");
  } catch (e) {
    console.log("ERR", key, e.message);
    out[key] = null;
  }
  await sleep(2800);
}
console.log("\n" + JSON.stringify(out, null, 2));
