/**
 * Sync Wikimedia Commons images for REVORA car catalog.
 *
 * Output:
 *   backend/src/seed/carImages.expansion.js
 *
 * Exports:
 *   EXPANSION_IMAGES
 *   wikiExpansion
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { getGlobalImageSearchRegistry } from "../src/seed/global-brand-expansion.js";

import { getIranianImageSearchRegistry } from "../src/seed/iranian-extra-brands.js";

/* -------------------------------------------------------------------------- */
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

const ROOT = process.cwd();

const OUTPUT_FILE = path.resolve(ROOT, "src/seed/carImages.expansion.js");

const WIKI_API = "https://commons.wikimedia.org/w/api.php";

const WIKI_PREFIX = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const TARGET_IMAGES = 6;

const EXTERIOR_TARGET = 4;
const INTERIOR_TARGET = 2;

const REQUEST_TIMEOUT = 15000;

/*
 * Wikimedia starts returning 429 quite quickly when too many
 * searches are fired consecutively.
 */
const REQUEST_DELAY = 1100;

const RATE_LIMIT_DELAY = 5000;

const MAX_RESULTS_PER_QUERY = 30;

/*
 * We intentionally use fewer, better queries instead of
 * generating 15-20 variations for every model.
 */
const MAX_QUERIES_PER_TYPE = 4;

const MAX_CANDIDATES = 150;

const RETRIES = 4;

/* -------------------------------------------------------------------------- */
/* Bad files / terms                                                          */
/* -------------------------------------------------------------------------- */

const BAD_EXTENSIONS = new Set([
  ".svg",
  ".svgz",
  ".pdf",
  ".djvu",
  ".tif",
  ".tiff",
  ".gif",
  ".webm",
  ".ogg",
  ".mp3",
  ".mp4",
]);

const BAD_TERMS = [
  "logo",
  "flag",
  "map",
  "coat of arms",
  "emblem",
  "poster",
  "advertisement",
  "advertising",
  "screenshot",
  "diagram",
  "drawing",
  "illustration",
  "concept art",
  "toy",
  "model car",
  "diecast",
  "hot wheels",
  "lego",
  "bus",
  "truck",
  "motorcycle",
  "motorbike",
  "bicycle",
  "aircraft",
  "airplane",
  "train",
  "tram",
  "ship",
  "boat",
  "coffee",
  "building",
  "street",
  "person",
  "people",
  "portrait",
  "selfie",
];

/* -------------------------------------------------------------------------- */
/* Generic / ambiguous model IDs                                              */
/* -------------------------------------------------------------------------- */

const GENERIC_MODEL_IDS = new Set([
  "x22",
  "x33",
  "x55",
  "x77",
  "t8",
  "t7",
  "j7",
  "fx",
  "c5",
  "c9",
  "s5",
  "s7",
  "s8",
  "7x",
  "8x",
]);

/* -------------------------------------------------------------------------- */
/* Model families                                                             */
/* -------------------------------------------------------------------------- */

const MODEL_FAMILIES = [
  {
    name: "tiggo2",
    tokens: ["tiggo 2", "tiggo2", "tiggo 2 pro", "tiggo2 pro"],
  },

  {
    name: "tiggo4",
    tokens: ["tiggo 4", "tiggo4", "tiggo 4 pro", "tiggo4 pro"],
  },

  {
    name: "tiggo7",
    tokens: ["tiggo 7", "tiggo7", "tiggo 7 pro", "tiggo7 pro"],
  },

  {
    name: "tiggo8",
    tokens: ["tiggo 8", "tiggo8", "tiggo 8 pro", "tiggo8 pro"],
  },

  {
    name: "arrizo5",
    tokens: ["arrizo 5", "arrizo5"],
  },

  {
    name: "arrizo6",
    tokens: ["arrizo 6", "arrizo6"],
  },

  {
    name: "arrizo8",
    tokens: ["arrizo 8", "arrizo8"],
  },

  {
    name: "lamborghini_huracan_sterrato",
    tokens: ["huracan sterrato", "huracán sterrato", "huracan_sterrato"],
  },

  {
    name: "lamborghini_huracan",
    tokens: ["huracan", "huracán"],
  },

  {
    name: "mazda_cx5",
    tokens: ["cx-5", "cx5", "cx 5"],
  },

  {
    name: "mazda_cx30",
    tokens: ["cx-30", "cx30", "cx 30"],
  },

  {
    name: "mazda3",
    tokens: ["mazda 3", "mazda3"],
  },

  {
    name: "mazda2",
    tokens: ["mazda 2", "mazda2"],
  },

  {
    name: "suzuki_swift",
    tokens: ["suzuki swift", "swift"],
  },

  {
    name: "suzuki_vitara",
    tokens: ["suzuki vitara", "vitara"],
  },

  {
    name: "renault_zoe",
    tokens: ["renault zoe", "zoe"],
  },

  {
    name: "renault_arkana",
    tokens: ["renault arkana", "arkana"],
  },

  {
    name: "volvo_xc90",
    tokens: ["volvo xc90", "xc90"],
  },

  {
    name: "volvo_v60",
    tokens: ["volvo v60", "v60"],
  },
];

/* -------------------------------------------------------------------------- */
/* Known aliases                                                              */
/* -------------------------------------------------------------------------- */

const KEY_ALIASES = {
  bahman_swift: ["Suzuki Swift", "Suzuki Swift AZ", "Swift AZ"],

  bahman_vitara: ["Suzuki Vitara", "Suzuki Vitara IV", "Vitara IV"],

  bahman_mazda2: ["Mazda 2", "Mazda2", "Mazda2 DJ"],

  bahman_mazda3: ["Mazda 3", "Mazda3", "Mazda3 BP"],

  bahman_cx5: ["Mazda CX-5", "Mazda CX5", "Mazda CX-5 KF"],

  bahman_cx30: ["Mazda CX-30", "Mazda CX30"],

  kmc_t8: ["KMC T8", "JAC T8", "JAC T8 pickup", "JAC T8 truck"],

  kmc_j7: ["KMC J7", "JAC J7", "JAC J7 sedan"],

  kmc_x5: ["KMC X5", "KMC X5 SUV", "JAC JS5", "JAC JS5 SUV"],

  haima_7x_pro: ["Haima 7X", "Haima 7X Pro"],

  mvm_x22: ["MVM X22", "Chery Tiggo 3X", "Chery X22"],

  mvm_x33s: ["MVM X33S", "Chery Tiggo 3", "Chery Tiggo 3X"],

  mvm_x55_pro: [
    "MVM X55 Pro",
    "MVM X55",
    "Chery X55 Pro",
    "Chery Tiggo 5X Pro",
    "Chery Tiggo 5X",
    "Chery Omoda 5",
  ],

  mvm_arrizo5: ["MVM Arrizo 5", "Chery Arrizo 5", "Arrizo 5"],

  mvm_arrizo6_pro: ["MVM Arrizo 6 Pro", "Chery Arrizo 6 Pro", "Arrizo 6 Pro"],

  mvm_tiggo7_pro: ["MVM Tiggo 7 Pro", "Chery Tiggo 7 Pro", "Tiggo 7 Pro"],

  mvm_tiggo8_pro: ["MVM Tiggo 8 Pro", "Chery Tiggo 8 Pro", "Tiggo 8 Pro"],

  fownix_fx: ["Fownix FX", "Chery Omoda 5", "Omoda 5", "Chery Omoda C5"],

  fownix_tiggo7: ["Fownix Tiggo 7 Pro", "Chery Tiggo 7 Pro"],

  fownix_arrizo6: ["Fownix Arrizo 6 GT", "Chery Arrizo 6 GT"],

  chery_tiggo2_pro: [
    "Chery Tiggo 2 Pro",
    "Chery Tiggo2 Pro",
    "Tiggo 2 Pro",
    "Tiggo2 Pro",
  ],

  chery_tiggo4_pro: [
    "Chery Tiggo 4 Pro",
    "Chery Tiggo4 Pro",
    "Tiggo 4 Pro",
    "Tiggo4 Pro",
  ],

  chery_tiggo7_pro: ["Chery Tiggo 7 Pro", "Tiggo 7 Pro", "Tiggo7 Pro"],

  chery_tiggo8_pro: ["Chery Tiggo 8 Pro", "Tiggo 8 Pro", "Tiggo8 Pro"],

  lamborghini_huracan_sterrato: [
    "Lamborghini Huracan Sterrato",
    "Lamborghini Huracán Sterrato",
    "Huracan Sterrato",
  ],
};

/* -------------------------------------------------------------------------- */
/* Utility                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[_/\\-]+/g, " ")
    .replace(/[()[\]{}.,:;'"+*=!?|`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value = "") {
  return normalizeText(value).replace(/\s+/g, "");
}

function uniqueStrings(values) {
  return [
    ...new Set(
      values
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getExtension(filename = "") {
  const clean = filename.split("?")[0].trim();
  const match = clean.match(/\.[a-z0-9]{2,6}$/i);

  return match ? match[0].toLowerCase() : "";
}

function cleanFilename(filename = "") {
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function filenameFromUrl(url = "") {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/");

    return decodeURIComponent(parts[parts.length - 1] || "");
  } catch {
    return cleanFilename(url.split("/").pop()?.split("?")[0] || "");
  }
}

/* -------------------------------------------------------------------------- */
/* Wikimedia URL helper                                                       */
/* -------------------------------------------------------------------------- */

function wikiExpansion(fileName, width = 1600) {
  if (typeof fileName !== "string" || !fileName.trim()) {
    return "";
  }

  let value = fileName.trim();

  for (let i = 0; i < 10; i += 1) {
    try {
      const decoded = decodeURIComponent(value);

      if (decoded === value) {
        break;
      }

      value = decoded;
    } catch {
      break;
    }
  }

  if (value.includes("Special:FilePath/")) {
    value = value.substring(
      value.lastIndexOf("Special:FilePath/") + "Special:FilePath/".length,
    );
  }

  value = value.split("?")[0].trim();

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);

      value = url.pathname.split("/").pop() || "";
    } catch {
      value = value.split("/").pop() || "";
    }
  }

  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep original.
  }

  value = value.trim();

  if (!value) {
    return "";
  }

  value = value.replace(/ /g, "_");

  return `${WIKI_PREFIX}${encodeURIComponent(value)}?width=${width}`;
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

function getRegistry() {
  const globalRegistry = getGlobalImageSearchRegistry?.() || {};

  const iranianRegistry = getIranianImageSearchRegistry?.() || {};

  return {
    ...globalRegistry,
    ...iranianRegistry,
  };
}

function normalizeRegistryEntry(key, entry) {
  if (typeof entry === "string") {
    return {
      key,
      brand: "",
      model: "",
      generation: "",
      year: "",
      aliases: [],
      exterior: entry,
      interior: "",
      queries: [entry],
      exteriorQueries: [entry],
      interiorQueries: [],
    };
  }

  if (!entry || typeof entry !== "object") {
    return {
      key,
      brand: "",
      model: "",
      generation: "",
      year: "",
      aliases: [],
      exterior: key,
      interior: "",
      queries: [key],
      exteriorQueries: [key],
      interiorQueries: [],
    };
  }

  return {
    key,

    brand: entry.brand || "",
    model: entry.model || "",

    generation: entry.generation || entry.gen || "",

    year: entry.year || "",

    aliases: uniqueStrings([
      ...(Array.isArray(entry.aliases) ? entry.aliases : []),
    ]),

    exterior: entry.exterior || "",
    interior: entry.interior || "",

    queries: uniqueStrings([
      ...(Array.isArray(entry.queries) ? entry.queries : []),

      entry.exterior,
      entry.interior,
    ]),

    exteriorQueries: uniqueStrings([
      ...(Array.isArray(entry.exteriorQueries) ? entry.exteriorQueries : []),

      entry.exterior,
    ]),

    interiorQueries: uniqueStrings([
      ...(Array.isArray(entry.interiorQueries) ? entry.interiorQueries : []),

      entry.interior,
    ]),
  };
}

/* -------------------------------------------------------------------------- */
/* Identity                                                                   */
/* -------------------------------------------------------------------------- */

function inferIdentityFromKey(key) {
  const cleanKey = String(key || "")
    .replace(/[_-]+/g, " ")
    .trim();

  const parts = cleanKey.split(/\s+/);

  if (!parts.length) {
    return {
      brand: "",
      model: "",
      generation: "",
    };
  }

  const prefix = parts[0].toLowerCase();

  if (prefix === "bahman") {
    return {
      brand: "Bahman Motor",
      model: parts.slice(1).join(" "),
      generation: "",
    };
  }

  if (prefix === "mvm") {
    return {
      brand: "Modiran Khodro",
      model: parts.slice(1).join(" "),
      generation: "",
    };
  }

  if (prefix === "fownix") {
    return {
      brand: "Fownix",
      model: parts.slice(1).join(" "),
      generation: "",
    };
  }

  if (prefix === "kmc") {
    return {
      brand: "Kerman Motor",
      model: parts.slice(1).join(" "),
      generation: "",
    };
  }

  return {
    brand: "",
    model: parts.join(" "),
    generation: "",
  };
}

function getIdentity(entry) {
  const inferred = inferIdentityFromKey(entry.key);

  const brand = entry.brand || inferred.brand || "";

  let model = entry.model || inferred.model || "";

  const generation = entry.generation || inferred.generation || "";

  if (!model) {
    model = entry.exterior || entry.interior || entry.key || "";
  }

  const raw = [brand, model, generation].filter(Boolean).join(" ");

  const modelNormalized = normalizeText(model);

  const aliases = uniqueStrings([
    ...(KEY_ALIASES[entry.key] || []),
    ...(entry.aliases || []),

    brand && model ? `${brand} ${model}` : "",

    brand && model && generation ? `${brand} ${model} ${generation}` : "",

    entry.exterior,
    ...(entry.exteriorQueries || []),
  ]);

  return {
    raw,

    normalized: normalizeText(raw),
    compact: compactText(raw),

    brand: normalizeText(brand),

    model: modelNormalized,

    modelCompact: compactText(modelNormalized),

    generation: normalizeText(generation),

    key: normalizeText(entry.key || ""),

    generic: GENERIC_MODEL_IDS.has(compactText(modelNormalized)),

    aliases,
  };
}

/* -------------------------------------------------------------------------- */
/* Special model rules                                                        */
/* -------------------------------------------------------------------------- */

function getTiggoNumber(text) {
  const normalized = normalizeText(text);

  const match = normalized.match(/\btiggo\s*([2-9])\b/);

  return match ? match[1] : null;
}

function isX55Identity(identity) {
  return identity.modelCompact === "x55" || identity.key.includes("x55");
}

function isT8Identity(identity) {
  return identity.modelCompact === "t8" || identity.key.includes("t8");
}

function isJ7Identity(identity) {
  return identity.modelCompact === "j7" || identity.key.includes("j7");
}

/* -------------------------------------------------------------------------- */
/* Strict candidate identity                                                  */
/* -------------------------------------------------------------------------- */

function passesStrictIdentity(candidate, identity) {
  const text = normalizeText(`${candidate.filename} ${candidate.title}`);

  /*
   * --------------------------------------------------------
   * Tiggo numbered models
   * --------------------------------------------------------
   *
   * If target is Tiggo 4 and candidate explicitly says
   * Tiggo 7/8/9, reject it immediately.
   */

  const targetTiggo =
    getTiggoNumber(identity.raw) || getTiggoNumber(identity.key);

  const candidateTiggo = getTiggoNumber(text);

  if (targetTiggo && candidateTiggo && targetTiggo !== candidateTiggo) {
    return false;
  }

  /*
   * --------------------------------------------------------
   * X55
   * --------------------------------------------------------
   */

  if (isX55Identity(identity)) {
    const forbidden = ["regina", "sj x55", "x55 doors"];

    if (forbidden.some((term) => containsTerm(text, term))) {
      return false;
    }

    /*
     * X55 Pro is NOT Tiggo 7/8/9.
     */
    if (/\btiggo\s*[789]\b/i.test(text)) {
      return false;
    }

    /*
     * Valid real-world names.
     */
    const valid = ["mvm x55", "chery x55", "tiggo 5x", "omoda 5", "x55"];

    if (!valid.some((term) => containsTerm(text, term))) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * KMC / JAC T8
   * --------------------------------------------------------
   */

  if (isT8Identity(identity)) {
    if (!containsTerm(text, "t8")) {
      return false;
    }

    if (!containsTerm(text, "kmc") && !containsTerm(text, "jac")) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * KMC / JAC J7
   * --------------------------------------------------------
   */

  if (isJ7Identity(identity)) {
    if (!containsTerm(text, "j7")) {
      return false;
    }

    if (!containsTerm(text, "kmc") && !containsTerm(text, "jac")) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * Huracan Sterrato
   * --------------------------------------------------------
   */

  if (
    identity.key.includes("huracan_sterrato") ||
    identity.key.includes("huracan sterrato")
  ) {
    if (!containsTerm(text, "huracan") && !containsTerm(text, "huracán")) {
      return false;
    }

    if (!containsTerm(text, "sterrato")) {
      return false;
    }

    const forbidden = ["performante", "evo", "sto", "tecnica", "tecnico"];

    if (forbidden.some((term) => containsTerm(text, term))) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * Mazda CX-5
   * --------------------------------------------------------
   */

  if (identity.key.includes("cx5") || identity.modelCompact === "cx5") {
    if (!containsTerm(text, "cx5") && !containsTerm(text, "cx 5")) {
      return false;
    }

    if (containsTerm(text, "cx30") || containsTerm(text, "cx 30")) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * Mazda CX-30
   * --------------------------------------------------------
   */

  if (identity.key.includes("cx30") || identity.modelCompact === "cx30") {
    if (!containsTerm(text, "cx30") && !containsTerm(text, "cx 30")) {
      return false;
    }

    if (containsTerm(text, "cx5") || containsTerm(text, "cx 5")) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * Suzuki Swift
   * --------------------------------------------------------
   */

  if (identity.key.includes("swift")) {
    if (!containsTerm(text, "swift")) {
      return false;
    }

    if (
      !containsTerm(text, "suzuki") &&
      !containsTerm(text, "swift az") &&
      !containsTerm(text, "swift glx") &&
      !containsTerm(text, "swift sport")
    ) {
      return false;
    }

    return true;
  }

  /*
   * --------------------------------------------------------
   * Suzuki Vitara
   * --------------------------------------------------------
   */

  if (identity.key.includes("vitara")) {
    return containsTerm(text, "vitara");
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* Model family                                                               */
/* -------------------------------------------------------------------------- */

function findModelFamily(identity) {
  const haystack = `${identity.normalized} ${identity.key}`;

  const compactHaystack = compactText(haystack);

  for (const family of MODEL_FAMILIES) {
    if (
      family.tokens.some((token) => {
        const normalized = normalizeText(token);

        return (
          haystack.includes(normalized) ||
          compactHaystack.includes(compactText(normalized))
        );
      })
    ) {
      return family;
    }
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Query generation                                                           */
/* -------------------------------------------------------------------------- */

function buildQueries(entry, type) {
  const identity = getIdentity(entry);

  const source =
    type === "interior" ? entry.interiorQueries : entry.exteriorQueries;

  const queries = [];

  /*
   * Primary registry queries.
   */
  for (const query of source || []) {
    if (!query) {
      continue;
    }

    queries.push(query);
  }

  /*
   * Explicit aliases.
   *
   * We don't generate "car", "vehicle",
   * "exterior", "cockpit", "dashboard"
   * for every single alias because that creates
   * too many Wikimedia requests.
   */
  for (const alias of identity.aliases) {
    if (alias) {
      queries.push(alias);
    }
  }

  /*
   * Structured identity.
   */
  if (identity.brand && identity.model) {
    const structured = [identity.brand, identity.model, identity.generation]
      .filter(Boolean)
      .join(" ");

    queries.push(structured);
  }

  /*
   * Add a few highly useful type-specific queries.
   */
  const primary = queries.find(Boolean) || identity.raw || entry.key;

  if (type === "interior") {
    queries.push(`${primary} interior`);
    queries.push(`${primary} dashboard`);
    queries.push(`${primary} cockpit`);
  } else {
    queries.push(`${primary} exterior`);
    queries.push(`${primary} car`);
  }

  return uniqueStrings(queries).slice(0, MAX_QUERIES_PER_TYPE);
}

/* -------------------------------------------------------------------------- */
/* Wikimedia API                                                              */
/* -------------------------------------------------------------------------- */

async function fetchJson(url, options = {}) {
  let lastError = null;

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,

        signal: controller.signal,

        headers: {
          Accept: "application/json",

          ...(options.headers || {}),
        },
      });

      clearTimeout(timeout);

      /*
       * Wikimedia rate limit.
       */
      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("retry-after"));

        const delay =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : RATE_LIMIT_DELAY * attempt;

        lastError = new Error("HTTP 429");

        if (attempt < RETRIES) {
          console.warn(
            `      Wikimedia rate limit (429), waiting ${delay}ms...`,
          );

          await sleep(delay);
          continue;
        }

        throw lastError;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);

      lastError = error;

      if (attempt < RETRIES) {
        const delay = 1200 * attempt;

        await sleep(delay);
      }
    }
  }

  throw lastError || new Error("Request failed");
}

async function searchWikimedia(query) {
  const params = new URLSearchParams({
    action: "query",

    generator: "search",

    gsrsearch: query,

    gsrnamespace: "6",

    gsrlimit: String(MAX_RESULTS_PER_QUERY),

    prop: "imageinfo",

    iiprop: "url|mime|size",

    iiurlwidth: "1600",

    format: "json",

    origin: "*",
  });

  const url = `${WIKI_API}?${params.toString()}`;

  const data = await fetchJson(url);

  const pages = Object.values(data?.query?.pages || {});

  return pages
    .map((page) => {
      const info = page?.imageinfo?.[0] || {};

      const title = page?.title || "";

      const url = info?.thumburl || info?.url || "";

      return {
        title,

        url,

        mime: info?.mime || "",

        width: info?.width || 0,

        height: info?.height || 0,

        filename: title.replace(/^File:/i, ""),
      };
    })
    .filter((item) => item.title && item.url);
}

/* -------------------------------------------------------------------------- */
/* Candidate helpers                                                          */
/* -------------------------------------------------------------------------- */

function containsTerm(text, term) {
  const normalizedText = normalizeText(text);

  const normalizedTerm = normalizeText(term);

  if (!normalizedTerm) {
    return false;
  }

  return (
    normalizedText.includes(normalizedTerm) ||
    compactText(normalizedText).includes(compactText(normalizedTerm))
  );
}

function hasAnyTerm(text, terms) {
  return terms.some((term) => containsTerm(text, term));
}

/* -------------------------------------------------------------------------- */
/* Bad candidate                                                              */
/* -------------------------------------------------------------------------- */

function isBadCandidate(candidate) {
  const filename = candidate.filename || "";

  const title = candidate.title || "";

  const text = normalizeText(`${filename} ${title}`);

  const extension = getExtension(filename);

  if (BAD_EXTENSIONS.has(extension)) {
    return true;
  }

  if (BAD_TERMS.some((term) => containsTerm(text, term))) {
    return true;
  }

  if (candidate.mime && !candidate.mime.startsWith("image/")) {
    return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* Model family protection                                                    */
/* -------------------------------------------------------------------------- */

function violatesModelFamily(candidate, identity) {
  const text = normalizeText(`${candidate.filename} ${candidate.title}`);

  /*
   * First use strict model identity.
   */
  if (!passesStrictIdentity(candidate, identity)) {
    return true;
  }

  const family = findModelFamily(identity);

  if (!family) {
    return false;
  }

  /*
   * Lamborghini special handling.
   */
  if (family.name === "lamborghini_huracan_sterrato") {
    const forbidden = ["performante", "evo", "sto", "tecnica", "tecnico"];

    if (forbidden.some((term) => containsTerm(text, term))) {
      return true;
    }
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* Automotive evidence                                                        */
/* -------------------------------------------------------------------------- */

function hasStrongAutomotiveEvidence(candidate, identity) {
  const text = normalizeText(`${candidate.filename} ${candidate.title}`);

  const automotiveTerms = [
    "car",
    "automobile",
    "automotive",
    "vehicle",
    "sedan",
    "suv",
    "coupe",
    "hatchback",
    "wagon",
    "estate",
    "pickup",
    "crossover",
    "sports car",
    "sportscar",
    "turbo",
    "awd",
    "4wd",
    "4x4",
    "glx",
    "gls",
    "gt",
    "gti",
    "rs",
    "amg",

    "bmw",
    "mercedes",
    "audi",
    "porsche",
    "toyota",
    "nissan",
    "mazda",
    "suzuki",
    "chery",
    "mvm",
    "lamborghini",
    "volvo",
    "renault",
    "hyundai",
    "kia",
    "jac",
    "kmc",
    "fownix",
    "haima",

    "tiggo",
    "arrizo",
    "swift",
    "vitara",

    "x55",
    "x22",
    "x33",
    "x77",
    "t8",
    "j7",

    "cx5",
    "cx 5",
    "cx30",
    "cx 30",
  ];

  if (automotiveTerms.some((term) => containsTerm(text, term))) {
    return true;
  }

  if (identity.brand && containsTerm(text, identity.brand)) {
    return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* Model evidence                                                             */
/* -------------------------------------------------------------------------- */

function hasExactModelEvidence(candidate, identity) {
  const text = normalizeText(`${candidate.filename} ${candidate.title}`);

  /*
   * Exact model first.
   */
  if (identity.model && containsTerm(text, identity.model)) {
    return true;
  }

  /*
   * Exact aliases.
   */
  for (const alias of identity.aliases) {
    if (containsTerm(text, alias)) {
      return true;
    }
  }

  /*
   * Compact model.
   */
  const compactModel = compactText(identity.model);

  if (compactModel && compactText(text).includes(compactModel)) {
    return true;
  }

  /*
   * Model-specific relaxed evidence.
   */

  if (identity.key.includes("chery_tiggo")) {
    const target = getTiggoNumber(identity.raw);

    const candidateNumber = getTiggoNumber(text);

    if (target && candidateNumber === target) {
      return true;
    }
  }

  if (isT8Identity(identity) && containsTerm(text, "t8")) {
    return true;
  }

  if (isJ7Identity(identity) && containsTerm(text, "j7")) {
    return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* Short model guard                                                          */
/* -------------------------------------------------------------------------- */

function passesShortModelGuard(candidate, identity) {
  if (!identity.generic) {
    return true;
  }

  const text = normalizeText(`${candidate.filename} ${candidate.title}`);

  if (!hasStrongAutomotiveEvidence(candidate, identity)) {
    return false;
  }

  /*
   * X55
   */
  if (identity.modelCompact === "x55") {
    if (
      !hasAnyTerm(text, ["mvm x55", "chery x55", "tiggo 5x", "omoda 5", "x55"])
    ) {
      return false;
    }

    if (containsTerm(text, "regina") || containsTerm(text, "sj x55")) {
      return false;
    }

    return true;
  }

  /*
   * T8
   */
  if (identity.modelCompact === "t8") {
    return containsTerm(text, "kmc t8") || containsTerm(text, "jac t8");
  }

  /*
   * J7
   */
  if (identity.modelCompact === "j7") {
    return containsTerm(text, "kmc j7") || containsTerm(text, "jac j7");
  }

  /*
   * X22 / X33 / X77
   */
  if (["x22", "x33", "x77"].includes(identity.modelCompact)) {
    return hasAnyTerm(text, [identity.modelCompact, "mvm", "chery", "tiggo"]);
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* Image classification                                                       */
/* -------------------------------------------------------------------------- */

function isInteriorCandidate(candidate) {
  const text = normalizeText(`${candidate.title} ${candidate.filename}`);

  const terms = [
    "interior",
    "cockpit",
    "dashboard",
    "dash",
    "steering wheel",
    "steering",
    "cabin",
    "salon",
    "front seats",
    "rear seats",
    "instrument panel",
    "instrument cluster",
    "center console",
    "console",
  ];

  return terms.some((term) => containsTerm(text, term));
}

/* -------------------------------------------------------------------------- */
/* Candidate scoring                                                          */
/* -------------------------------------------------------------------------- */

function scoreCandidate(candidate, entry, identity, query, type) {
  if (isBadCandidate(candidate)) {
    return -Infinity;
  }

  if (violatesModelFamily(candidate, identity)) {
    return -Infinity;
  }

  if (!passesShortModelGuard(candidate, identity)) {
    return -Infinity;
  }

  const title = `${candidate.title} ${candidate.filename}`;

  const normalizedTitle = normalizeText(title);

  const normalizedQuery = normalizeText(query);

  let score = 0;

  /*
   * Exact query.
   */
  if (normalizedQuery && normalizedTitle.includes(normalizedQuery)) {
    score += 30;
  }

  /*
   * Model evidence.
   */
  if (hasExactModelEvidence(candidate, identity)) {
    score += 50;
  } else {
    score -= 10;
  }

  /*
   * Brand.
   */
  if (identity.brand && containsTerm(normalizedTitle, identity.brand)) {
    score += 25;
  }

  /*
   * Alias.
   */
  const aliasMatched = identity.aliases.some((alias) =>
    containsTerm(normalizedTitle, alias),
  );

  if (aliasMatched) {
    score += 30;
  }

  /*
   * Generation.
   */
  if (
    identity.generation &&
    containsTerm(normalizedTitle, identity.generation)
  ) {
    score += 15;
  }

  /*
   * Automotive.
   */
  if (hasStrongAutomotiveEvidence(candidate, identity)) {
    score += 15;
  } else {
    score -= 15;
  }

  /*
   * Interior.
   */
  if (type === "interior") {
    if (isInteriorCandidate(candidate)) {
      score += 50;
    } else {
      /*
       * Don't completely reject it.
       *
       * Some Wikimedia filenames are just
       * "IMG_1234.jpg" even when the photo
       * is actually the dashboard/interior.
       */
      score -= 5;
    }
  }

  /*
   * Exterior.
   */
  if (type === "exterior") {
    if (isInteriorCandidate(candidate)) {
      score -= 60;
    }

    if (
      hasAnyTerm(normalizedTitle, [
        "front",
        "side",
        "rear",
        "road",
        "parked",
        "driving",
        "street",
      ])
    ) {
      score += 8;
    }
  }

  /*
   * Resolution.
   */
  if (candidate.width && candidate.width < 500) {
    score -= 20;
  }

  if (candidate.height && candidate.height < 300) {
    score -= 20;
  }

  /*
   * Large images.
   */
  if (candidate.width >= 1200) {
    score += 5;
  }

  /*
   * Exact compact model bonus.
   */
  const modelCompact = compactText(identity.model);

  if (modelCompact && compactText(normalizedTitle).includes(modelCompact)) {
    score += 20;
  }

  /*
   * Generic models require a slightly higher
   * confidence.
   */
  if (identity.generic && score < 45) {
    return -Infinity;
  }

  return score;
}

/* -------------------------------------------------------------------------- */
/* Candidate collection                                                       */
/* -------------------------------------------------------------------------- */

async function collectCandidates(entry, type) {
  const queries = buildQueries(entry, type);

  const identity = getIdentity(entry);

  const all = [];

  console.log(`    ${type}: ${queries.length} queries`);

  for (const query of queries) {
    try {
      const results = await searchWikimedia(query);

      console.log(`      "${query}" -> ${results.length}`);

      for (const result of results) {
        const score = scoreCandidate(result, entry, identity, query, type);

        if (score === -Infinity) {
          continue;
        }

        all.push({
          ...result,
          query,
          score,
        });
      }
    } catch (error) {
      console.warn(
        `      Query failed: ${query} -> ${error?.message || error}`,
      );
    }

    if (all.filter((item) => item.score >= 75).length >= TARGET_IMAGES + 2) {
      break;
    }

    await sleep(REQUEST_DELAY);
  }

  /*
   * Deduplicate.
   */
  const map = new Map();

  for (const candidate of all) {
    const key = candidate.url || candidate.title;

    const existing = map.get(key);

    if (!existing || candidate.score > existing.score) {
      map.set(key, candidate);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CANDIDATES);
}

/* -------------------------------------------------------------------------- */
/* Selection                                                                  */
/* -------------------------------------------------------------------------- */

function selectImages(candidates, target, type) {
  const selected = [];

  const used = new Set();

  for (const candidate of candidates) {
    if (selected.length >= target) {
      break;
    }

    const key = candidate.url || candidate.title;

    if (used.has(key)) {
      continue;
    }

    const interior = isInteriorCandidate(candidate);

    if (type === "interior" && !interior) {
      /*
       * Don't reject immediately if
       * score is high enough.
       *
       * Some Wikimedia images have
       * poor filenames.
       */
      if (candidate.score < 100) {
        continue;
      }
    }

    if (type === "exterior" && interior) {
      continue;
    }

    used.add(key);
    selected.push(candidate);
  }

  return selected;
}

/* -------------------------------------------------------------------------- */
/* Fallback selection                                                         */
/* -------------------------------------------------------------------------- */

function fillRemainingImages(selected, exteriorCandidates, interiorCandidates) {
  const result = [...selected];

  const used = new Set(result.map((item) => item.url || item.title));

  /*
   * First prefer exterior candidates.
   *
   * This is safer than inserting unrelated
   * interior images.
   */
  const pool = [...exteriorCandidates, ...interiorCandidates]
    .filter((candidate) => {
      const key = candidate.url || candidate.title;

      return !used.has(key);
    })
    .sort((a, b) => b.score - a.score);

  for (const candidate of pool) {
    if (result.length >= TARGET_IMAGES) {
      break;
    }

    const key = candidate.url || candidate.title;

    if (used.has(key)) {
      continue;
    }

    /*
     * Never accept a weak candidate
     * just to reach 4 images.
     */
    if (candidate.score < 55) {
      continue;
    }

    used.add(key);
    result.push(candidate);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Car sync                                                                   */
/* -------------------------------------------------------------------------- */

async function syncCar(key, rawEntry) {
  const entry = normalizeRegistryEntry(key, rawEntry);

  const identity = getIdentity(entry);

  console.log("");
  console.log(`→ ${key}`);

  console.log(
    `  identity: ${[identity.brand, identity.model, identity.generation]
      .filter(Boolean)
      .join(" ")}`,
  );

  if (identity.aliases.length) {
    console.log(`  aliases: ${identity.aliases.slice(0, 8).join(" | ")}`);
  }

  const exteriorCandidates = await collectCandidates(entry, "exterior");

  const interiorCandidates = await collectCandidates(entry, "interior");

  const exterior = selectImages(
    exteriorCandidates,
    EXTERIOR_TARGET,
    "exterior",
  );

  const interior = selectImages(
    interiorCandidates,
    INTERIOR_TARGET,
    "interior",
  );

  /*
   * Start with the desired 2+2.
   */
  let selected = [...exterior, ...interior];

  /*
   * If we have less than four,
   * use additional VALID candidates.
   */
  if (selected.length < TARGET_IMAGES) {
    selected = fillRemainingImages(
      selected,
      exteriorCandidates,
      interiorCandidates,
    );
  }

  /*
   * Final URL dedupe.
   */
  const unique = [];

  const seen = new Set();

  for (const candidate of selected) {
    const url = candidate.url;

    if (!url || seen.has(url)) {
      continue;
    }

    seen.add(url);
    unique.push(candidate);
  }

  const finalCandidates = unique.slice(0, TARGET_IMAGES);

  const images = finalCandidates
    .map((candidate) =>
      wikiExpansion(candidate.filename || filenameFromUrl(candidate.url)),
    )
    .filter(Boolean);

  console.log(`  result: ${images.length}/${TARGET_IMAGES}`);

  for (const candidate of finalCandidates) {
    console.log(`    ${candidate.score.toFixed(1)} | ${candidate.filename}`);
  }

  if (images.length < TARGET_IMAGES) {
    console.warn(`  PARTIAL ${key}: ${images.length}/${TARGET_IMAGES}`);
  }

  return {
    images,

    exteriorCount: exterior.length,

    interiorCount: interior.length,
  };
}

/* -------------------------------------------------------------------------- */
/* Existing output                                                            */
/* -------------------------------------------------------------------------- */

async function loadExisting() {
  try {
    await fs.access(OUTPUT_FILE);
  } catch {
    return {};
  }

  try {
    const url = `${pathToFileURL(OUTPUT_FILE).href}?t=${Date.now()}`;

    const module = await import(url);

    return {
      ...(module.EXPANSION_IMAGES || {}),
    };
  } catch (error) {
    console.warn("");

    console.warn("⚠ Could not import existing carImages.expansion.js.");

    console.warn(`  ${error?.message || error}`);

    console.warn("  Existing generated images will not be preserved.");

    return {};
  }
}

/* -------------------------------------------------------------------------- */
/* CLI                                                                        */
/* -------------------------------------------------------------------------- */

function parseOnlyArgument() {
  const arg = process.argv.find((value) => value.startsWith("--only="));

  if (!arg) {
    return [];
  }

  return arg
    .slice("--only=".length)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function printHelp() {
  console.log(`
REVORA Wikimedia image sync

Usage:

  node scripts/sync-catalog-images.mjs

Only selected cars:

  node scripts/sync-catalog-images.mjs --only=car_key,car_key

Examples:

  node scripts/sync-catalog-images.mjs --only=mvm_x55_pro

  node scripts/sync-catalog-images.mjs --only=kmc_t8

  node scripts/sync-catalog-images.mjs --only=bahman_swift

  node scripts/sync-catalog-images.mjs --only=bahman_vitara

  node scripts/sync-catalog-images.mjs --only=chery_tiggo2_pro,chery_tiggo4_pro

Output:

  src/seed/carImages.expansion.js
`);
}

/* -------------------------------------------------------------------------- */
/* Output                                                                     */
/* -------------------------------------------------------------------------- */

async function writeOutput(imagesMap) {
  const keys = Object.keys(imagesMap).sort((a, b) => a.localeCompare(b));

  const lines = [];

  lines.push("/** Auto-generated by scripts/sync-catalog-images.mjs */");

  lines.push("");

  lines.push(
    'const WIKI_PREFIX = "https://commons.wikimedia.org/wiki/Special:FilePath/";',
  );

  lines.push("");

  lines.push(
    "/** Convert a Wikimedia filename/URL into a clean Special:FilePath URL. */",
  );

  lines.push("export function wikiExpansion(fileName, width = 1600) {");

  lines.push('  if (typeof fileName !== "string" || !fileName.trim()) {');

  lines.push('    return "";');

  lines.push("  }");

  lines.push("");

  lines.push("  let value = fileName.trim();");

  lines.push("");

  lines.push("  for (let i = 0; i < 10; i += 1) {");

  lines.push("    try {");

  lines.push("      const decoded = decodeURIComponent(value);");

  lines.push("");

  lines.push("      if (decoded === value) {");

  lines.push("        break;");

  lines.push("      }");

  lines.push("");

  lines.push("      value = decoded;");

  lines.push("    } catch {");

  lines.push("      break;");

  lines.push("    }");

  lines.push("  }");

  lines.push("");

  lines.push('  if (value.includes("Special:FilePath/")) {');

  lines.push(
    '    value = value.substring(value.lastIndexOf("Special:FilePath/") + "Special:FilePath/".length);',
  );

  lines.push("  }");

  lines.push("");

  lines.push('  value = value.split("?")[0].trim();');

  lines.push("");

  lines.push("  if (/^https?:\\/\\//i.test(value)) {");

  lines.push("    try {");

  lines.push("      const url = new URL(value);");

  lines.push('      value = url.pathname.split("/").pop() || "";');

  lines.push("    } catch {");

  lines.push('      value = value.split("/").pop() || "";');

  lines.push("    }");

  lines.push("  }");

  lines.push("");

  lines.push("  try {");

  lines.push("    value = decodeURIComponent(value);");

  lines.push("  } catch {");

  lines.push("    // Keep original filename.");

  lines.push("  }");

  lines.push("");

  lines.push("  value = value.trim();");

  lines.push("");

  lines.push('  if (!value) return "";');

  lines.push("");

  lines.push('  value = value.replace(/ /g, "_");');

  lines.push("");

  lines.push(
    "  return `${WIKI_PREFIX}${encodeURIComponent(value)}?width=${width}`;",
  );

  lines.push("}");

  lines.push("");

  lines.push("/** @type {Record<string, string[]>} */");

  lines.push("export const EXPANSION_IMAGES = {");

  for (const key of keys) {
    const images = Array.isArray(imagesMap[key]) ? imagesMap[key] : [];

    if (!images.length) {
      continue;
    }

    lines.push(`  ${JSON.stringify(key)}: [`);

    for (const image of images) {
      lines.push(`    ${JSON.stringify(image)},`);
    }

    lines.push("  ],");

    lines.push("");
  }

  lines.push("};");

  lines.push("");

  await fs.writeFile(OUTPUT_FILE, `${lines.join("\n")}\n`, "utf8");
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    return;
  }

  const registry = getRegistry();

  const registryKeys = Object.keys(registry);

  if (!registryKeys.length) {
    throw new Error("Image search registry is empty.");
  }

  const only = parseOnlyArgument();

  const selectedKeys = only.length
    ? only.filter((key) => registry[key])
    : registryKeys;

  const unknownKeys = only.filter((key) => !registry[key]);

  if (unknownKeys.length) {
    console.warn("");

    console.warn("⚠ Unknown keys:");

    for (const key of unknownKeys) {
      console.warn(`  - ${key}`);
    }
  }

  console.log("");

  console.log("============================================================");

  console.log("REVORA Wikimedia Catalog Image Sync");

  console.log("============================================================");

  console.log(`Registry keys: ${registryKeys.length}`);

  console.log(`Selected: ${selectedKeys.length}`);

  console.log(`Target images/car: ${TARGET_IMAGES}`);

  console.log(`Exterior target: ${EXTERIOR_TARGET}`);

  console.log(`Interior target: ${INTERIOR_TARGET}`);

  console.log(`Request delay: ${REQUEST_DELAY}ms`);

  console.log("============================================================");

  const existing = await loadExisting();

  const resultMap = {
    ...existing,
  };

  let processed = 0;
  let complete = 0;
  let partial = 0;
  let failed = 0;
  let totalImages = 0;

  const partialCars = [];

  const forceRefresh = process.argv.includes("--force");

  for (const key of selectedKeys) {
    processed += 1;

    const existingCount = Array.isArray(resultMap[key]) ? resultMap[key].length : 0;

    if (!forceRefresh && existingCount >= TARGET_IMAGES) {
      console.log(`→ ${key} (skipped — ${existingCount}/${TARGET_IMAGES} images)`);
      complete += 1;
      totalImages += existingCount;
      continue;
    }

    try {
      const result = await syncCar(key, registry[key]);

      /*
       * Preserve existing data only when
       * the new search completely failed.
       */
      if (result.images.length) {
        resultMap[key] = result.images;
        await writeOutput(resultMap);
      }

      totalImages += result.images.length;

      if (result.images.length >= TARGET_IMAGES) {
        complete += 1;
      } else {
        partial += 1;

        partialCars.push(`${key}: ${result.images.length}/${TARGET_IMAGES}`);
      }
    } catch (error) {
      failed += 1;

      console.error("");

      console.error(`✗ Failed: ${key}`);

      console.error(error?.stack || error?.message || error);
    }
  }

  /*
   * Remove empty values.
   */
  for (const key of Object.keys(resultMap)) {
    if (!Array.isArray(resultMap[key]) || !resultMap[key].length) {
      delete resultMap[key];
    }
  }

  /*
   * Global duplicate detection.
   */
  const imageOwners = new Map();

  for (const [key, images] of Object.entries(resultMap)) {
    for (const image of images) {
      const owners = imageOwners.get(image) || [];

      owners.push(key);

      imageOwners.set(image, owners);
    }
  }

  const duplicates = [...imageOwners.entries()].filter(
    ([, owners]) => owners.length > 1,
  );

  await writeOutput(resultMap);

  console.log("");

  console.log("============================================================");

  console.log("SYNC COMPLETE");

  console.log("============================================================");

  console.log(`Registry keys: ${registryKeys.length}`);

  console.log(`Processed: ${processed}`);

  console.log(`Updated / complete: ${complete}`);

  console.log(`Partial: ${partial}`);

  console.log(`Failed: ${failed}`);

  console.log(`Total images in selected cars: ${totalImages}`);

  console.log(`Global duplicates: ${duplicates.length}`);

  console.log(`Output: ${OUTPUT_FILE}`);

  if (partialCars.length) {
    console.log("");

    console.log("Partial cars:");

    for (const item of partialCars) {
      console.log(`  - ${item}`);
    }
  }

  if (duplicates.length) {
    console.log("");

    console.log("Duplicate images:");

    for (const [image, owners] of duplicates) {
      console.log(`  - ${owners.join(", ")} -> ${image}`);
    }
  }

  console.log("============================================================");
}

main().catch((error) => {
  console.error("");
  console.error("SYNC FAILED");
  console.error(error?.stack || error?.message || error);

  process.exitCode = 1;
});
