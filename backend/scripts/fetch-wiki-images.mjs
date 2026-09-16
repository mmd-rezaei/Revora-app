/** One-off: fetch verified Wikimedia filenames for seed cars. */
const SEARCHES = {
  bmw_m3_g80: "BMW M3 Competition G80",
  bmw_m4_g82: "BMW M4 Competition G82",
  bmw_m5_f90_cs: "BMW M5 CS F90",
  mercedes_c63_w206: "Mercedes-AMG C 63 W206",
  mercedes_amg_gt63: "Mercedes-AMG GT 63 S",
  porsche_992_carrera_s: "Porsche 911 992 Carrera S",
  porsche_992_gt3: "Porsche 911 GT3 992",
  nissan_gtr_r35_nismo: "Nissan GT-R Nismo R35",
  nissan_z_nismo: "Nissan Z Nismo RZ34",
  toyota_supra_a90: "Toyota GR Supra A90",
  toyota_gr_yaris: "Toyota GR Yaris XP210",
  ford_mustang_dark_horse: "Ford Mustang Dark Horse S650",
  ford_gt: "Ford GT 2017",
  ferrari_296_gtb: "Ferrari 296 GTB",
  ferrari_f8_tributo: "Ferrari F8 Tributo",
  lamborghini_huracan_tecnica: "Lamborghini Huracan Tecnica",
  lamborghini_urus_s: "Lamborghini Urus S",
  audi_rs6_c8: "Audi RS6 Avant C8",
  audi_r8_v10: "Audi R8 V10 performance 4S",
  honda_civic_type_r: "Honda Civic Type R FL5",
  honda_nsx_type_s: "Honda NSX Type S",
  tesla_model_s_plaid: "Tesla Model S Plaid",
  corvette_c8_z06: "Chevrolet Corvette Z06 C8",
  ikco_dena_plus_turbo: "IKCO Dena Plus Turbo",
  ikco_dena_plus: "IKCO Dena Plus",
  ikco_tara: "IKCO Tara",
  ikco_samand_soren: "IKCO Samand Soren",
  ikco_peugeot_206: "Peugeot 206 Iran Khodro",
  ikco_peugeot_207i: "Peugeot 207 Iran",
  ikco_peugeot_pars: "Peugeot Pars",
  ikco_peugeot_2008: "Peugeot 2008 II",
  ikco_runna: "IKCO Runna",
  saipa_shahin: "Saipa Shahin",
  saipa_quick_r: "Saipa Quick",
  saipa_quick_s: "Saipa Quick S",
  saipa_saina: "Saipa Saina",
  saipa_pride_111: "Saipa Pride 111",
  saipa_pride_132: "Saipa Pride 132",
  saipa_tiba: "Saipa Tiba",
  saipa_cs35: "Changan CS35 Plus",
  vw_golf_gti_clubsport: "Volkswagen Golf GTI Clubsport Mk8",
  vw_golf_r: "Volkswagen Golf R Mk8",
  peugeot_308_gt: "Peugeot 308 GT P5",
  peugeot_508_pse: "Peugeot 508 PSE",
  renault_megane_rs: "Renault Megane RS Trophy",
  hyundai_i30n: "Hyundai i30 N",
  hyundai_ioniq5n: "Hyundai Ioniq 5 N",
  kia_stinger_gt: "Kia Stinger GT",
  kia_ev6_gt: "Kia EV6 GT",
  lexus_lc500: "Lexus LC 500",
  mazda_mx5_nd: "Mazda MX-5 ND",
  subaru_wrx: "Subaru WRX VB",
  dodge_challenger_hellcat: "Dodge Challenger Hellcat Redeye",
  volvo_s60_polestar: "Volvo S60 Polestar Engineered",
  genesis_g70: "Genesis G70 Sport",
  mclaren_720s: "McLaren 720S",
  aston_martin_vantage: "Aston Martin Vantage 2018",
  jeep_trackhawk: "Jeep Grand Cherokee Trackhawk",
  maserati_mc20: "Maserati MC20",
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
      gsrlimit: "5",
      prop: "imageinfo",
      iiprop: "url|mime",
      iiurlwidth: "1400",
      format: "json",
      origin: "*",
    });
  const res = await fetch(url, {
    headers: { "User-Agent": "REVORA-Seed/1.0 (local dev; contact: dev@revora.local)" },
  });
  const text = await res.text();
  if (!text.startsWith("{")) throw new Error(`API error for "${q}": ${text.slice(0, 120)}`);
  const data = JSON.parse(text);
  const pages = Object.values(data.query?.pages || {});
  const hits = pages
    .filter((p) => p.imageinfo?.[0]?.mime?.startsWith("image/"))
    .map((p) => ({
      file: p.title.replace(/^File:/, ""),
      url: p.imageinfo[0].thumburl || p.imageinfo[0].url,
    }));
  return hits.slice(0, 2);
}

const out = {};
for (const [key, q] of Object.entries(SEARCHES)) {
  try {
    out[key] = await search(q);
    console.log(`OK ${key}: ${out[key].map((h) => h.file).join(" | ") || "NONE"}`);
  } catch (e) {
    console.error(`FAIL ${key}:`, e.message);
    out[key] = [];
  }
  await sleep(2200);
}

console.log("\n--- JSON ---\n");
console.log(JSON.stringify(out, null, 2));
