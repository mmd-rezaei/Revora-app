import { buildBrandsFromRaw, expandLineups } from "./catalog-builder.js";

/** @type {Record<string, { exterior: string, interior: string }>} */
export const iranianImageSearches = {};

const BRAND_META = {
  "Modiran Khodro": {
    country: "Iran",
    description:
      "مدیران خودرو (MVM) — مونتاژ و فروش محصولات چری در ایران؛ تیگو، آریزو و X-Series.",
  },
  Chery: {
    country: "China",
    description:
      "Chery — Tiggo SUVs, Omoda crossovers and Arrizo sedans for global markets.",
  },
  Fownix: {
    country: "Iran",
    description:
      "فونیکس — برند وارداتی/مونتاژ SUV در بازار ایران با تمرکز بر کراس‌اوورهای چینی.",
  },
  "Bahman Motor": {
    country: "Iran",
    description:
      "بهمن موتور — مونتاژ سوزوکی، مزدا و محصولات تجاری برای بازار ایران.",
  },
  "Kerman Motor": {
    country: "Iran",
    description: "کرمان موتور — مونتاژ هایما، KMC و کراس‌اوورهای خانوادگی.",
  },
};

/** @type {Array<{ brand: string, model: string, gen: string, imgKey: string, search: string, profile: string, year?: number, trims: string[] }>} */
const LINEUPS = [
  // ── Modiran Khodro (MVM) ──
  {
    brand: "Modiran Khodro",
    model: "X22",
    gen: "MVM",
    imgKey: "mvm_x22",
    search: "Chery X22 MVM Iran",
    profile: "suvS",
    year: 2018,
    trims: ["دنده‌ای", "اتوماتیک"],
  },
  {
    brand: "Modiran Khodro",
    model: "X33",
    gen: "S",
    imgKey: "mvm_x33s",
    search: "Chery Tiggo 3",
    profile: "suvS",
    year: 2020,
    trims: ["S", "S اتوماتیک", "S پلاس"],
  },
  {
    brand: "Modiran Khodro",
    model: "X55",
    gen: "Pro",
    imgKey: "mvm_x55_pro",
    search: "Chery Tiggo 5x Pro",
    profile: "suvM",
    year: 2022,
    trims: ["Pro", "Pro IE", "Pro اکسلنت"],
  },
  {
    brand: "Modiran Khodro",
    model: "X77",
    gen: "Pro",
    imgKey: "mvm_x77",
    search: "Chery Tiggo 8 Pro",
    profile: "suvL",
    year: 2023,
    trims: ["Pro", "Pro Max", "Pro 7 نفره"],
  },
  {
    brand: "Modiran Khodro",
    model: "Arrizo 5",
    gen: "FL",
    imgKey: "mvm_arrizo5",
    search: "Chery Arrizo 5",
    profile: "compactS",
    year: 2019,
    trims: ["FL", "Turbo", "Sport"],
  },
  {
    brand: "Modiran Khodro",
    model: "Arrizo 6",
    gen: "Pro",
    imgKey: "mvm_arrizo6_pro",
    search: "Chery Arrizo 6 Pro",
    profile: "midS",
    year: 2021,
    trims: ["Pro", "Pro IE", "GT"],
  },
  {
    brand: "Modiran Khodro",
    model: "Tiggo 7",
    gen: "Pro",
    imgKey: "mvm_tiggo7_pro",
    search: "Chery Tiggo 7 Pro",
    profile: "suvM",
    year: 2022,
    trims: ["Pro", "Pro Max", "Pro AWD"],
  },
  {
    brand: "Modiran Khodro",
    model: "Tiggo 8",
    gen: "Pro",
    imgKey: "mvm_tiggo8_pro",
    search: "Chery Tiggo 8 Pro",
    profile: "suvL",
    year: 2023,
    trims: ["Pro", "Pro Max", "Pro 7 نفره"],
  },

  // ── Chery (global) ──
  {
    brand: "Chery",
    model: "Tiggo 2",
    gen: "Pro",
    imgKey: "chery_tiggo2_pro",
    search: "Chery Tiggo 2 Pro",
    profile: "suvS",
    trims: ["Pro", "Pro Max"],
  },
  {
    brand: "Chery",
    model: "Tiggo 4",
    gen: "Pro",
    imgKey: "chery_tiggo4_pro",
    search: "Chery Tiggo 4 Pro",
    profile: "suvS",
    trims: ["Pro", "Pro Hybrid"],
  },
  {
    brand: "Chery",
    model: "Tiggo 7",
    gen: "Pro",
    imgKey: "chery_tiggo7_pro",
    search: "Chery Tiggo 7 Pro",
    profile: "suvM",
    trims: ["Pro", "Pro Max", "Pro Plug-in Hybrid"],
  },
  {
    brand: "Chery",
    model: "Tiggo 8",
    gen: "Pro",
    imgKey: "chery_tiggo8_pro",
    search: "Chery Tiggo 8 Pro",
    profile: "suvL",
    trims: ["Pro", "Pro Max", "Pro e+"],
  },
  {
    brand: "Chery",
    model: "Omoda 5",
    gen: "C5",
    imgKey: "chery_omoda5",
    search: "Chery Omoda 5",
    profile: "suvS",
    trims: ["Comfort", "Luxury", "e5 EV"],
  },
  {
    brand: "Chery",
    model: "Omoda 9",
    gen: "C9",
    imgKey: "chery_omoda9",
    search: "Chery Omoda 9",
    profile: "suvL",
    trims: ["Luxury", "Flagship"],
  },
  {
    brand: "Chery",
    model: "Arrizo 8",
    gen: "Global",
    imgKey: "chery_arrizo8",
    search: "Chery Arrizo 8",
    profile: "midS",
    trims: ["Comfort", "Luxury", "Flagship"],
  },
  {
    brand: "Chery",
    model: "eQ7",
    gen: "EV",
    imgKey: "chery_eq7",
    search: "Chery eQ7 electric SUV",
    profile: "ev",
    trims: ["RWD", "AWD"],
  },

  // ── Fownix (فونیکس) ──
  {
    brand: "Fownix",
    model: "FX",
    gen: "Premium",
    imgKey: "fownix_fx",
    search: "Chery Tiggo 7 Pro",
    profile: "suvM",
    year: 2023,
    trims: ["Premium", "Premium Plus", "AWD"],
  },
  {
    brand: "Fownix",
    model: "Tiggo 7 Pro",
    gen: "Iran",
    imgKey: "fownix_tiggo7",
    search: "Fownix Tiggo 7 Pro Iran",
    profile: "suvM",
    year: 2024,
    trims: ["Pro", "Pro Max"],
  },
  {
    brand: "Fownix",
    model: "Arrizo 6",
    gen: "GT",
    imgKey: "fownix_arrizo6",
    search: "Chery Arrizo 6 GT",
    profile: "midS",
    year: 2024,
    trims: ["GT", "GT Turbo"],
  },

  // ── Bahman Motor expansion ──
  {
    brand: "Bahman Motor",
    model: "Vitara",
    gen: "IV",
    imgKey: "bahman_vitara",
    search: "Suzuki Vitara IV",
    profile: "suvM",
    year: 2016,
    trims: ["GL", "GLX", "AllGrip"],
  },
  {
    brand: "Bahman Motor",
    model: "Swift",
    gen: "AZ",
    imgKey: "bahman_swift",
    search: "Suzuki Swift AZ",
    profile: "compactH",
    year: 2018,
    trims: ["GL", "GLX", "Sport"],
  },
  {
    brand: "Bahman Motor",
    model: "Mazda 2",
    gen: "DJ",
    imgKey: "bahman_mazda2",
    search: "Mazda2 DJ",
    profile: "compactH",
    year: 2015,
    trims: ["دنده‌ای", "اتوماتیک"],
  },
  {
    brand: "Bahman Motor",
    model: "Mazda 3",
    gen: "BP",
    imgKey: "bahman_mazda3",
    search: "Mazda3 BP sedan",
    profile: "compactS",
    year: 2020,
    trims: ["GLX", "GT", "Turbo"],
  },
  {
    brand: "Bahman Motor",
    model: "CX-5",
    gen: "KF",
    imgKey: "bahman_cx5",
    search: "Mazda CX-5 KF",
    profile: "suvM",
    year: 2019,
    trims: ["Touring", "Grand Touring", "Signature"],
  },
  {
    brand: "Bahman Motor",
    model: "CX-30",
    gen: "DM",
    imgKey: "bahman_cx30",
    search: "Mazda CX-30",
    profile: "suvS",
    year: 2021,
    trims: ["Select", "Preferred", "Premium"],
  },

  // ── Kerman Motor expansion ──
  {
    brand: "Kerman Motor",
    model: "KMC J7",
    gen: "Pickup",
    imgKey: "kmc_j7",
    search: "JAC pickup truck",
    profile: "pickup",
    year: 2022,
    trims: ["دیزل", "بنزینی", "دوکابین"],
  },
  {
    brand: "Kerman Motor",
    model: "KMC T8",
    gen: "Pickup",
    imgKey: "kmc_t8",
    search: "KMC T8 pickup",
    profile: "pickup",
    year: 2023,
    trims: ["Pro", "Pro 4x4", "Pro Plus"],
  },
  {
    brand: "Kerman Motor",
    model: "KMC X5",
    gen: "SUV",
    imgKey: "kmc_x5",
    search: "KMC X5 SUV",
    profile: "suvM",
    year: 2023,
    trims: ["Comfort", "Luxury", "Flagship"],
  },
  {
    brand: "Kerman Motor",
    model: "Haima 7X",
    gen: "Pro",
    imgKey: "haima_7x_pro",
    search: "Haima 7X SUV",
    profile: "suvM",
    year: 2024,
    trims: ["Pro", "Pro Turbo", "Pro 7 نفره"],
  },
];

/**
 * @param {Set<string>} existingKeys
 */
export function buildIranianExtra(existingKeys) {
  const raw = expandLineups(LINEUPS, existingKeys, iranianImageSearches);
  return buildBrandsFromRaw(raw, BRAND_META, existingKeys);
}

export const iranianExtraStats = {
  lineupModels: LINEUPS.length,
  estimatedTrims: LINEUPS.reduce((n, l) => n + l.trims.length, 0),
};

/** Image search queries for Wikimedia sync. */
export function getIranianImageSearchRegistry() {
  /** @type {Record<string, { exterior: string, interior: string }>} */
  const registry = {};
  expandLineups(LINEUPS, new Set(), registry);
  return registry;
}
