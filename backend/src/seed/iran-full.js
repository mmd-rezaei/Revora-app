import { carImg } from "./carImages.js";
import { iranianBrands as legacyIranianBrands } from "./iran.js";

/** Cars already in the original iran.js seed — skip duplicates. */
const EXISTING = new Set(
  [
    "iran khodro|peugeot 206|sd v8",
    "iran khodro|peugeot 207i|automatic",
    "iran khodro|peugeot pars|elx",
    "iran khodro|peugeot 2008|cross",
    "iran khodro|samand|elx",
    "iran khodro|runna|plus",
    "iran khodro|dena|plus turbo",
    "iran khodro|dena|plus",
    "iran khodro|tara|automatic",
    "saipa|shahin|g",
    "saipa|quick|r",
    "saipa|quick|s",
    "saipa|saina|s",
    "saipa|pride|111",
    "saipa|pride|132",
    "saipa|tiba|hatchback",
    "saipa|cs35|plus",
  ].map((k) => k.toLowerCase()),
);

const PROFILES = {
  classic: {
    bodyType: "Sedan",
    engine: "1.8L I4",
    displacement: 1.8,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "RWD",
    horsepower: 72,
    torque: 120,
    zeroToHundred: 18,
    topSpeed: 140,
    weight: 1050,
    dimensions: { length: 4400, width: 1620, height: 1440 },
  },
  micro: {
    bodyType: "Hatchback",
    engine: "1.3L I4",
    displacement: 1.3,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 65,
    torque: 95,
    zeroToHundred: 16.5,
    topSpeed: 145,
    weight: 920,
    dimensions: { length: 3595, width: 1595, height: 1470 },
  },
  economyH: {
    bodyType: "Hatchback",
    engine: "M15 1.5L I4",
    displacement: 1.5,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 87,
    torque: 120,
    zeroToHundred: 14.5,
    topSpeed: 165,
    weight: 1050,
    dimensions: { length: 3995, width: 1645, height: 1500 },
  },
  economyS: {
    bodyType: "Sedan",
    engine: "M15 1.5L I4",
    displacement: 1.5,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 87,
    torque: 120,
    zeroToHundred: 14.2,
    topSpeed: 168,
    weight: 1100,
    dimensions: { length: 4240, width: 1640, height: 1480 },
  },
  compactH: {
    bodyType: "Hatchback",
    engine: "TU5 1.6L I4",
    displacement: 1.6,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 105,
    torque: 142,
    zeroToHundred: 11.8,
    topSpeed: 185,
    weight: 1080,
    dimensions: { length: 3835, width: 1652, height: 1433 },
  },
  compactS: {
    bodyType: "Sedan",
    engine: "XU7 1.8L I4",
    displacement: 1.8,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 100,
    torque: 142,
    zeroToHundred: 13,
    topSpeed: 178,
    weight: 1290,
    dimensions: { length: 4430, width: 1700, height: 1440 },
  },
  midS: {
    bodyType: "Sedan",
    engine: "M15 1.5L I4",
    displacement: 1.5,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 150,
    torque: 210,
    zeroToHundred: 10.8,
    topSpeed: 195,
    weight: 1320,
    dimensions: { length: 4660, width: 1785, height: 1495 },
  },
  turboS: {
    bodyType: "Sedan",
    engine: "EF7 Turbo 1.7L TC",
    displacement: 1.7,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 170,
    torque: 240,
    zeroToHundred: 9.2,
    topSpeed: 210,
    weight: 1380,
    dimensions: { length: 4550, width: 1780, height: 1480 },
  },
  suvS: {
    bodyType: "SUV",
    engine: "1.6L Turbo I4",
    displacement: 1.6,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 156,
    torque: 260,
    zeroToHundred: 9.8,
    topSpeed: 190,
    weight: 1380,
    dimensions: { length: 4335, width: 1825, height: 1660 },
  },
  suvM: {
    bodyType: "SUV",
    engine: "2.0L Turbo I4",
    displacement: 2.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 190,
    torque: 280,
    zeroToHundred: 9.5,
    topSpeed: 200,
    weight: 1550,
    dimensions: { length: 4500, width: 1840, height: 1680 },
  },
  pickup: {
    bodyType: "Pickup",
    engine: "2.4L I4",
    displacement: 2.4,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "RWD",
    horsepower: 110,
    torque: 190,
    zeroToHundred: 14,
    topSpeed: 150,
    weight: 1450,
    dimensions: { length: 5200, width: 1750, height: 1800 },
  },
  cng: {
    bodyType: "Sedan",
    engine: "XU7 1.8L CNG",
    displacement: 1.8,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 95,
    torque: 135,
    zeroToHundred: 13.5,
    topSpeed: 170,
    weight: 1320,
    dimensions: { length: 4430, width: 1700, height: 1440 },
  },
  hybrid: {
    bodyType: "SUV",
    engine: "1.5L PHEV",
    displacement: 1.5,
    fuelType: "Plug-in Hybrid",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 220,
    torque: 300,
    zeroToHundred: 8.5,
    topSpeed: 190,
    weight: 1750,
    dimensions: { length: 4700, width: 1860, height: 1680 },
  },
  ev: {
    bodyType: "SUV",
    engine: "Electric Motor",
    displacement: 0,
    fuelType: "Electric",
    transmission: "Single-Speed",
    driveType: "FWD",
    horsepower: 150,
    torque: 250,
    zeroToHundred: 9,
    topSpeed: 160,
    weight: 1650,
    dimensions: { length: 4300, width: 1800, height: 1650 },
  },
};

const BRAND_META = {
  "Iran Khodro": {
    country: "Iran",
    description:
      "Iran's largest automaker — Paykan, Peugeot platforms, Samand, Dena, Tara and the cars that built modern Iranian mobility.",
  },
  Saipa: {
    country: "Iran",
    description:
      "High-volume Iranian manufacturer — Pride, Tiba, Quick, Shahin, Changan assembly and city cars on every street.",
  },
  "Pars Khodro": {
    country: "Iran",
    description: "Renault partner in Iran — Tondar 90 family and European crossovers for the domestic market.",
  },
  "Bahman Motor": {
    country: "Iran",
    description: "Suzuki and Mazda distributor — assembling Grand Vitara and Kizashi for Iranian buyers.",
  },
  Dongfeng: {
    country: "China",
    description: "Chinese crossovers sold in Iran through local partners — H30 Cross and S30.",
  },
  "Kerman Motor": {
    country: "Iran",
    description: "Haima brand assembler — S5, S7 and 7X crossovers tuned for Iranian roads.",
  },
  Foton: {
    country: "China",
    description: "Commercial and pickup trucks — Tunland and G7 workhorses on Iranian job sites.",
  },
  Zamyad: {
    country: "Iran",
    description: "Iran's pickup specialist — Nissan-based vans, Shoka, Padra and Zagros commercial fleet.",
  },
  SWM: {
    country: "China",
    description: "SWM crossovers and EVs assembled for Iran — GRE and Enoy electric lineup.",
  },
  Safeer: {
    country: "Iran",
    description: "Seres / Safeer plug-in hybrids — R7 family for Iran's growing EV segment.",
  },
};

function shouldSkip(brand, model, trim) {
  return EXISTING.has(`${brand}|${model}|${trim}`.toLowerCase());
}

function mkCar(brand, model, trim, imageKey, profile, year = 2020, extra = {}) {
  if (shouldSkip(brand, model, trim)) return null;
  const base = PROFILES[profile] || PROFILES.compactS;
  return {
    trim,
    year,
    images: carImg(imageKey),
    ...base,
    ...extra,
    description: `${model} ${trim} — مدل شناخته‌شده بازار ایران در کاتالوگ REVORA.`,
    features: extra.features || ["ABS", "Airbags", "Iranian market spec"],
  };
}

/** @type {Array<[string, string, string, string, string, string, number?]>} */
function buildRawEntries() {
  const e = [];
  const push = (...row) => e.push(row);

  // ── Paykan & Hunter ──
  for (const t of ["پیکان", "دلوکس", "جوانان", "کار", "استیشن"]) {
    push("Iran Khodro", "Paykan", "Classic", t, "ikco_paykan", "classic", 1985);
  }
  push("Iran Khodro", "Paykan", "Classic", "وانت", "ikco_paykan", "pickup", 1990);
  push("Iran Khodro", "Hillman Hunter", "Classic", "هیلمن هانتر", "ikco_hillman_hunter", "classic", 1967);

  // ── Peugeot (Iran Khodro) ──
  push("Iran Khodro", "Peugeot 205", "205", "205", "ikco_peugeot_205", "compactH", 1998);
  for (const t of ["405", "GL", "GLX", "SLX", "دوگانه‌سوز"]) {
    push("Iran Khodro", "Peugeot 405", "405", t, "ikco_peugeot_405", t.includes("دوگانه") ? "cng" : "compactS", 2000);
  }
  for (const t of ["RD", "RDi", "RDX"]) push("Iran Khodro", "Peugeot RD", "RD", t, "ikco_peugeot_rd", "compactS", 2005);
  push("Iran Khodro", "Peugeot ROA", "ROA", "روآ", "ikco_peugeot_roa", "compactS", 1997);
  push("Iran Khodro", "Peugeot Pars", "Pars", "LX", "ikco_peugeot_pars", "compactS", 2018);
  push("Iran Khodro", "Peugeot Pars", "Pars", "سال", "ikco_peugeot_pars", "compactS", 2019);
  for (const t of ["206", "تیپ 1", "تیپ 2", "تیپ 3", "تیپ 4", "تیپ 5", "تیپ 6"]) {
    push("Iran Khodro", "Peugeot 206", "206", t, "ikco_peugeot_206", "compactH", 2010);
  }
  for (const t of ["206 SD", "SD V1", "SD V2", "SD V10"]) {
    push("Iran Khodro", "Peugeot 206", "206", t, "ikco_peugeot_206", "compactH", 2015);
  }
  for (const t of ["207i", "207i پانوراما", "207i صندوقدار"]) {
    push("Iran Khodro", "Peugeot 207i", "207i", t, "ikco_peugeot_207i", "compactH", 2020);
  }
  push("Iran Khodro", "Peugeot 407", "407", "407", "ikco_peugeot_407", "midS", 2012);
  push("Iran Khodro", "Peugeot 301", "301", "301", "ikco_peugeot_301", "compactS", 2016);

  // ── Samand / Soren ──
  for (const t of ["سمند", "X7", "LX", "SE", "EF7", "سریر"]) {
    push("Iran Khodro", "Samand", "Samand", t, "ikco_samand", "compactS", 2015);
  }
  push("Iran Khodro", "Samand", "Samand", "LX دوگانه‌سوز", "ikco_samand", "cng", 2016);
  for (const t of ["سورن", "ELX سال", "توربو", "پلاس", "پلاس TU5P"]) {
    push("Iran Khodro", "Soren", "Soren", t, "ikco_soren_plus", "compactS", 2020);
  }

  // ── Runna / Dena / Tara / others ──
  push("Iran Khodro", "Runna", "Runna", "LX", "ikco_runna_lx", "compactS", 2018);
  push("Iran Khodro", "Runna", "Runna", "پلاس پانوراما", "ikco_runna", "compactS", 2022);
  push("Iran Khodro", "Dena", "Dena Family", "EF7", "ikco_dena_ef7", "compactS", 2016);
  push("Iran Khodro", "Dena", "Dena Family", "پلاس توربو دنده‌ای", "ikco_dena_plus_turbo", "turboS", 2023);
  push("Iran Khodro", "Dena", "Dena Family", "پلاس توربو اتوماتیک", "ikco_dena_plus_turbo", "turboS", 2024);
  push("Iran Khodro", "Dena", "Dena Family", "جوانان", "ikco_dena_plus", "compactS", 2018);
  push("Iran Khodro", "Tara", "Tara", "دستی", "ikco_tara", "compactS", 2023);
  push("Iran Khodro", "Rira", "Rira", "ری‌را", "ikco_rira", "midS", 2025);
  push("Iran Khodro", "Arisun", "Arisun", "آریسان", "ikco_arisun", "pickup", 2015);
  push("Iran Khodro", "Arisun", "Arisun", "آریسان 2", "ikco_arisun2", "pickup", 2020);
  push("Iran Khodro", "Bardo", "Bardo", "وانت باردو", "ikco_arisun", "pickup", 2018);

  // ── Pars Khodro / Renault ──
  for (const t of ["تندر 90", "تندر 90 اتوماتیک", "تندر پلاس", "تندر پلاس اتوماتیک", "تندر پیکاپ"]) {
    push("Pars Khodro", "Tondar", "90", t, "pars_tondar_90", t.includes("پیکاپ") ? "pickup" : "compactS", 2018);
  }
  push("Pars Khodro", "Captur", "Captur", "Captur", "pars_captur", "suvS", 2020);

  // ── Bahman / Suzuki ──
  push("Bahman Motor", "Grand Vitara", "Grand Vitara", "گرند ویتارا", "bahman_grand_vitara", "suvM", 2012);
  push("Bahman Motor", "Kizashi", "Kizashi", "کیزاشی", "bahman_kizashi", "midS", 2011);

  // ── Dongfeng ──
  push("Dongfeng", "H30 Cross", "H30", "H30 Cross", "dongfeng_h30", "suvS", 2019);
  push("Dongfeng", "S30", "S30", "S30", "dongfeng_s30", "compactS", 2018);

  // ── Haima ──
  for (const [model, key, trim] of [
    ["S5", "haima_s5", "S5"],
    ["S5 Plus", "haima_s5", "S5 پلاس"],
    ["S5 Pro", "haima_s5", "S5 پرو"],
    ["S7", "haima_s7", "S7"],
    ["S7 Turbo", "haima_s7", "S7 توربو"],
    ["S7 Plus", "haima_s7", "S7 پلاس"],
    ["8S", "haima_8s", "8S"],
    ["7X", "haima_7x", "7X"],
  ]) {
    push("Kerman Motor", `Haima ${model}`, model, trim, key, "suvM", 2021);
  }

  // ── Foton ──
  push("Foton", "Tunland", "Tunland", "تونلند", "foton_tunland", "pickup", 2019);
  push("Foton", "Tunland", "Tunland", "تونلند دیزل", "foton_tunland", "pickup", 2020);
  push("Foton", "G7", "G7", "G7", "foton_g7", "pickup", 2021);

  // ── SWM / Safeer ──
  push("SWM", "GRE", "GRE", "Luna GRE", "swm_gre", "suvM", 2022);
  push("SWM", "K112", "K112", "K112", "swm_gre", "suvS", 2023);
  push("SWM", "Enoy", "Enoy", "Enoy", "k112_enoy", "ev", 2024);
  push("Safeer", "R7", "R7", "R7", "safeer_r7", "hybrid", 2024);
  push("Safeer", "R7", "R7", "R7 پلاگین هیبرید", "safeer_r7", "hybrid", 2024);

  // ── Saipa classics ──
  push("Saipa", "Jyan", "Jyan", "ژیان", "saipa_jyan", "classic", 1978);
  for (const t of ["5", "5 دو در", "5 چهار در"]) push("Saipa", "Renault 5", "5", t, "saipa_renault_5", "micro", 1985);
  push("Saipa", "Renault 21", "21", "21", "saipa_renault_21", "compactS", 1990);
  push("Saipa", "Pride", "Base", "پراید", "saipa_pride_111", "micro", 2005);
  for (const t of ["صبا", "نسیم", "استیشن"]) push("Saipa", "Pride", "Base", t, "saipa_pride_111", "micro", 2000);

  // Pride 111/131/132/141/151 programmatic
  for (const s of ["", "EX", "LE", "SE", "SL", "SX"]) {
    push("Saipa", "Pride", "111", `111${s ? ` ${s}` : ""}`, "saipa_pride_111", "micro", 2015);
  }
  for (const s of ["", "EX", "LE", "SE", "SL", "SX", "TL"]) {
    push("Saipa", "Pride", "131", `131${s ? ` ${s}` : ""}`, "saipa_pride_111", "micro", 2014);
  }
  for (const s of ["", "EX", "LE", "SE", "SL", "SX"]) {
    push("Saipa", "Pride", "132", `132${s ? ` ${s}` : ""}`, "saipa_pride_132", "micro", 2014);
  }
  for (const s of ["", "EX", "LE", "SE", "SL", "SX"]) {
    push("Saipa", "Pride", "141", `141${s ? ` ${s}` : ""}`, "saipa_pride_111", "micro", 2013);
  }
  for (const s of ["", "SE"]) push("Saipa", "Pride", "151", `151${s ? ` ${s}` : ""}`, "saipa_pride_111", "micro", 2012);

  push("Saipa", "Xantia", "Xantia", "زانتیا", "saipa_zantia", "compactS", 2001);
  push("Saipa", "Xantia", "Xantia", "1800", "saipa_zantia", "compactS", 2002);
  push("Saipa", "Xantia", "Xantia", "2000", "saipa_zantia", "compactS", 2003);
  push("Saipa", "Rio", "Rio", "ریو", "saipa_rio", "compactH", 2006);
  push("Saipa", "Rio", "Rio", "مونتاژ", "saipa_rio", "compactH", 2008);
  for (const t of ["سراتو", "1600", "1600 آپشنال", "2000", "2000 آپشنال", "نیوفیس", "YD"]) {
    push("Saipa", "Cerato", "Cerato", t, "saipa_cerato", "compactS", 2015);
  }
  push("Saipa", "Citroen C3", "C3", "C3", "saipa_citroen_c3", "compactH", 2014);
  push("Saipa", "Citroen C3", "C3", "C3-XR", "saipa_citroen_c3", "suvS", 2016);
  push("Saipa", "Citroen C5", "C5", "C5", "saipa_citroen_c5", "midS", 2012);
  push("Saipa", "Ario", "Ario", "آریو", "saipa_ario", "compactS", 2010);
  push("Saipa", "Ario", "Ario", "S300", "saipa_ario", "compactS", 2012);

  // Tiba
  for (const t of ["تیبا", "EX", "SX", "SL", "دوگانه‌سوز"]) {
    push("Saipa", "Tiba", "Tiba 1", t, "saipa_tiba1", "economyH", 2012);
  }
  for (const t of ["تیبا 2", "EX", "پلاس"]) push("Saipa", "Tiba", "Tiba 2", t, "saipa_tiba", "economyH", 2018);

  // Saina
  for (const t of ["EX", "SX", "اتوماتیک"]) push("Saipa", "Saina", "S", t, "saipa_saina", "economyS", 2020);

  // Quick
  for (const t of ["کوییک", "دنده‌ای", "R پلاس", "G", "پلاس اتوماتیک"]) {
    push("Saipa", "Quick", "Quick", t, t.includes("R") ? "saipa_quick_r" : "saipa_quick_r", "economyH", 2021);
  }

  // Shahin
  for (const t of ["شاهین", "دنده‌ای", "اتوماتیک", "پلاس اتوماتیک"]) {
    push("Saipa", "Shahin", "G", t, t.includes("پلاس") ? "saipa_shahin_plus" : "saipa_shahin", "midS", 2022);
  }

  push("Saipa", "Atlas", "Atlas", "اطلس", "saipa_atlas", "suvS", 2023);
  push("Saipa", "Sahand", "Sahand", "سهند", "saipa_sahand", "suvS", 2023);
  push("Saipa", "Sahand", "Sahand", "S", "saipa_sahand", "suvS", 2024);
  push("Saipa", "Aria", "Aria", "آریا", "saipa_aria", "midS", 2024);
  push("Saipa", "Aria", "Aria", "دنده‌ای", "saipa_aria", "midS", 2024);
  push("Saipa", "Aria", "Aria", "اتوماتیک", "saipa_aria", "midS", 2024);
  push("Saipa", "Cadila", "P90", "P90", "saipa_cadila", "pickup", 2022);
  push("Saipa", "Cadila", "P90", "SP0", "saipa_cadila", "pickup", 2023);

  // Changan
  push("Saipa", "Changan CS15", "CS15", "CS15", "changan_cs15", "suvS", 2020);
  push("Saipa", "Changan CS35", "CS35", "CS35", "saipa_cs35", "suvS", 2019);
  push("Saipa", "Changan CS35", "CS35", "دنده‌ای", "saipa_cs35", "suvS", 2019);
  push("Saipa", "Changan CS35", "CS35", "اتوماتیک", "saipa_cs35", "suvS", 2020);
  push("Saipa", "Changan CS55", "CS55", "CS55 Plus", "changan_cs55", "suvM", 2022);
  push("Saipa", "Changan Uni-K", "Uni-K", "Uni-K", "changan_unik", "suvM", 2023);
  push("Saipa", "Changan Eado", "Eado", "Eado", "changan_eado", "compactS", 2021);
  push("Saipa", "Sinogold", "Sinogold", "سینوگلد", "k112_enoy", "ev", 2023);
  push("Saipa", "Sinogold", "Sinogold", "الکتریکی", "k112_enoy", "ev", 2024);

  // Zamyad pickups
  for (const t of ["وانت نیسان", "دوگانه‌سوز", "دیزل", "دوکابین"]) {
    push("Zamyad", "Nissan Pickup", "Z24", t, "zamyad_nissan_pickup", "pickup", 2015);
  }
  for (const t of ["شوکا", "بنزینی", "دوگانه‌سوز"]) push("Zamyad", "Shoka", "Shoka", t, "zamyad_shoka", "pickup", 2016);
  push("Zamyad", "Padra", "Padra", "پادرا", "zamyad_padra", "pickup", 2018);
  push("Zamyad", "Padra", "Padra", "پلاس", "zamyad_padra", "pickup", 2020);
  push("Zamyad", "Zagros", "Zagros", "زاگرس", "zamyad_zagros", "pickup", 2019);
  push("Zamyad", "Karoon", "Karoon", "کارون", "zamyad_karoon", "pickup", 2017);

  return e;
}

function groupIntoBrands(raw) {
  /** @type {Map<string, Map<string, Map<string, object[]>>>} */
  const tree = new Map();

  for (const [brand, model, gen, trim, img, profile, year] of raw) {
    const car = mkCar(brand, model, trim, img, profile, year);
    if (!car) continue;
    if (!tree.has(brand)) tree.set(brand, new Map());
    const models = tree.get(brand);
    const modelKey = `${model}::${gen}`;
    if (!models.has(modelKey)) models.set(modelKey, { model, gen, cars: [] });
    models.get(modelKey).cars.push(car);
  }

  const brands = [];
  for (const [brandName, modelsMap] of tree) {
    const meta = BRAND_META[brandName] || { country: "Iran", description: `${brandName} on REVORA.` };
    const models = [];
    for (const { model, gen, cars } of modelsMap.values()) {
      if (!cars.length) continue;
      models.push({
        name: model,
        generations: [
          {
            name: gen,
            yearStart: Math.min(...cars.map((c) => c.year)),
            cars,
          },
        ],
      });
    }
    if (models.length) {
      brands.push({ name: brandName, ...meta, models });
    }
  }
  return brands;
}

function mergeBrands(legacy, expanded) {
  const brandMap = new Map(structuredClone(legacy).map((b) => [b.name, b]));
  for (const brand of expanded) {
    if (!brandMap.has(brand.name)) {
      brandMap.set(brand.name, brand);
      continue;
    }
    const existing = brandMap.get(brand.name);
    for (const model of brand.models) {
      const match = existing.models.find((m) => m.name === model.name);
      if (!match) {
        existing.models.push(model);
        continue;
      }
      for (const gen of model.generations) {
        const genMatch = match.generations.find((g) => g.name === gen.name);
        if (!genMatch) {
          match.generations.push(gen);
        } else {
          genMatch.cars.push(...gen.cars);
        }
      }
    }
  }
  return [...brandMap.values()];
}

const expandedBrands = groupIntoBrands(buildRawEntries());

/** Legacy seed cars + new user-list additions (duplicates skipped). */
export const iranianBrands = mergeBrands(legacyIranianBrands, expandedBrands);

export const iranCatalogStats = {
  brands: iranianBrands.length,
  cars: iranianBrands.reduce(
    (n, b) => n + b.models.reduce((m, mo) => m + mo.generations.reduce((g, ge) => g + ge.cars.length, 0), 0),
    0,
  ),
  skippedDuplicates: EXISTING.size,
  addedFromUserList: expandedBrands.reduce(
    (n, b) => n + b.models.reduce((m, mo) => m + mo.generations.reduce((g, ge) => g + ge.cars.length, 0), 0),
    0,
  ),
};
