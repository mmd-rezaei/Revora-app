import { carImgForTrim } from "./carImages.js";
import { applyTrimVariation } from "./trim-specs.js";

/** @typedef {[string, string, string, string, string, string, number?]} RawEntry */

export const GLOBAL_PROFILES = {
  micro: {
    bodyType: "Hatchback",
    engine: "1.0L I3",
    displacement: 1.0,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "FWD",
    horsepower: 75,
    torque: 95,
    zeroToHundred: 12.5,
    topSpeed: 165,
    weight: 1050,
    dimensions: { length: 3700, width: 1680, height: 1480 },
  },

  compactH: {
    bodyType: "Hatchback",
    engine: "1.5L Turbo I4",
    displacement: 1.5,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 150,
    torque: 250,
    zeroToHundred: 8.2,
    topSpeed: 210,
    weight: 1320,
    dimensions: { length: 4350, width: 1800, height: 1450 },
  },

  compactS: {
    bodyType: "Sedan",
    engine: "2.0L Turbo I4",
    displacement: 2.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 190,
    torque: 320,
    zeroToHundred: 7.4,
    topSpeed: 230,
    weight: 1450,
    dimensions: { length: 4650, width: 1820, height: 1440 },
  },

  midS: {
    bodyType: "Sedan",
    engine: "2.5L Turbo I4",
    displacement: 2.5,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 280,
    torque: 420,
    zeroToHundred: 5.8,
    topSpeed: 250,
    weight: 1680,
    dimensions: { length: 4900, width: 1860, height: 1450 },
  },

  luxuryS: {
    bodyType: "Sedan",
    engine: "3.0L Twin-Turbo I6",
    displacement: 3.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 380,
    torque: 520,
    zeroToHundred: 4.9,
    topSpeed: 270,
    weight: 1850,
    dimensions: { length: 5050, width: 1900, height: 1455 },
  },

  sportC: {
    bodyType: "Coupe",
    engine: "3.0L Twin-Turbo I6",
    displacement: 3.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "RWD",
    horsepower: 450,
    torque: 550,
    zeroToHundred: 4.2,
    topSpeed: 280,
    weight: 1580,
    dimensions: { length: 4700, width: 1850, height: 1350 },
  },

  sportS: {
    bodyType: "Sedan",
    engine: "3.0L Twin-Turbo I6",
    displacement: 3.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 503,
    torque: 650,
    zeroToHundred: 3.6,
    topSpeed: 290,
    weight: 1750,
    dimensions: { length: 4790, width: 1900, height: 1440 },
  },

  supercar: {
    bodyType: "Coupe",
    engine: "4.0L Twin-Turbo V8",
    displacement: 4.0,
    fuelType: "Petrol",
    transmission: "DCT",
    driveType: "RWD",
    horsepower: 650,
    torque: 800,
    zeroToHundred: 3.0,
    topSpeed: 330,
    weight: 1450,
    dimensions: { length: 4600, width: 1950, height: 1200 },
  },

  suvS: {
    bodyType: "SUV",
    engine: "1.6L Turbo I4",
    displacement: 1.6,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "FWD",
    horsepower: 150,
    torque: 250,
    zeroToHundred: 9.5,
    topSpeed: 190,
    weight: 1380,
    dimensions: { length: 4300, width: 1820, height: 1620 },
  },

  suvM: {
    bodyType: "SUV",
    engine: "2.0L Turbo I4",
    displacement: 2.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 250,
    torque: 350,
    zeroToHundred: 7.2,
    topSpeed: 220,
    weight: 1750,
    dimensions: { length: 4650, width: 1880, height: 1680 },
  },

  suvL: {
    bodyType: "SUV",
    engine: "3.0L Twin-Turbo I6",
    displacement: 3.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 380,
    torque: 520,
    zeroToHundred: 5.5,
    topSpeed: 250,
    weight: 2150,
    dimensions: { length: 5050, width: 2000, height: 1780 },
  },

  pickup: {
    bodyType: "Pickup",
    engine: "3.5L Twin-Turbo V6",
    displacement: 3.5,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "4WD",
    horsepower: 400,
    torque: 640,
    zeroToHundred: 6.5,
    topSpeed: 180,
    weight: 2400,
    dimensions: { length: 5900, width: 2020, height: 1950 },
  },

  wagon: {
    bodyType: "Wagon",
    engine: "2.0L Turbo I4",
    displacement: 2.0,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "AWD",
    horsepower: 250,
    torque: 370,
    zeroToHundred: 6.8,
    topSpeed: 240,
    weight: 1720,
    dimensions: { length: 4750, width: 1850, height: 1460 },
  },

  ev: {
    bodyType: "SUV",
    engine: "Dual-Motor Electric",
    displacement: 0,
    fuelType: "Electric",
    transmission: "Single-Speed",
    driveType: "AWD",
    horsepower: 320,
    torque: 500,
    zeroToHundred: 5.5,
    topSpeed: 200,
    weight: 2100,
    dimensions: { length: 4650, width: 1890, height: 1650 },
  },

  evSport: {
    bodyType: "Sedan",
    engine: "Tri-Motor Electric",
    displacement: 0,
    fuelType: "Electric",
    transmission: "Single-Speed",
    driveType: "AWD",
    horsepower: 650,
    torque: 900,
    zeroToHundred: 3.2,
    topSpeed: 260,
    weight: 2250,
    dimensions: { length: 4900, width: 1920, height: 1450 },
  },

  roadster: {
    bodyType: "Convertible",
    engine: "2.0L Turbo I4",
    displacement: 2.0,
    fuelType: "Petrol",
    transmission: "Manual",
    driveType: "RWD",
    horsepower: 184,
    torque: 205,
    zeroToHundred: 6.5,
    topSpeed: 228,
    weight: 1080,
    dimensions: { length: 3915, width: 1735, height: 1235 },
  },

  muscle: {
    bodyType: "Coupe",
    engine: "6.2L Supercharged V8",
    displacement: 6.2,
    fuelType: "Petrol",
    transmission: "Automatic",
    driveType: "RWD",
    horsepower: 717,
    torque: 880,
    zeroToHundred: 3.5,
    topSpeed: 320,
    weight: 1980,
    dimensions: { length: 5020, width: 1920, height: 1460 },
  },
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Normalize text so comparisons are case-insensitive and whitespace-safe.
 *
 * @param {string} value
 */
function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Remove duplicate strings while preserving their original order.
 *
 * @param {string[]} values
 */
function uniqueStrings(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = normalizeText(value);

    if (!normalized) continue;

    const key = normalized.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

/**
 * Normalize a brand name for search aliases.
 *
 * @param {string} brand
 */
function normalizeBrandName(brand) {
  return normalizeText(brand).replace(/\s+/g, " ").trim();
}

/**
 * Generate common brand aliases.
 *
 * @param {string} brand
 */
function getBrandAliases(brand) {
  const value = normalizeBrandName(brand);
  const lower = value.toLowerCase();

  const aliases = [value];

  const knownAliases = {
    "mercedes-benz": ["Mercedes-Benz", "Mercedes"],
    mercedes: ["Mercedes", "Mercedes-Benz"],

    "aston martin": ["Aston Martin", "Aston-Martin"],

    "land rover": ["Land Rover", "Land-Rover"],

    "alfa romeo": ["Alfa Romeo", "Alfa-Romeo"],

    "rolls-royce": ["Rolls-Royce", "Rolls Royce"],

    "range rover": ["Range Rover"],

    volkswagen: ["Volkswagen", "VW"],
    chevrolet: ["Chevrolet", "Chevy"],
    "general motors": ["General Motors", "GM"],
  };

  if (knownAliases[lower]) {
    aliases.push(...knownAliases[lower]);
  }

  return uniqueStrings(aliases);
}

/**
 * Extract a useful generation/code token from a generation string.
 *
 * Examples:
 *   W214
 *   XV80
 *   G20
 *   KF
 *   P702
 *
 * @param {string} gen
 */
function getGenerationTokens(gen) {
  const value = normalizeText(gen);

  if (!value) return [];

  const tokens = value
    .split(/[\s/,&-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return uniqueStrings(
    tokens.filter((token) => {
      return /[A-Za-z]/.test(token) && /\d/.test(token);
    }),
  );
}

/**
 * Try to remove generation/code information from a search string.
 *
 * @param {string} search
 * @param {string} gen
 */
function removeGenerationFromSearch(search, gen) {
  let result = normalizeText(search);

  if (!result) return "";

  const tokens = getGenerationTokens(gen);

  for (const token of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    result = result
      .replace(new RegExp(`\\b${escaped}\\b`, "gi"), "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return result;
}

/**
 * Remove generic words that are often bad Wikimedia search terms.
 *
 * @param {string} value
 */
function simplifySearch(value) {
  return normalizeText(value)
    .replace(
      /\b(sedan|coupe|convertible|hatchback|wagon|suv|pickup|truck)\b/gi,
      "",
    )
    .replace(/\b(facelift|latest|new|generation)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Create search variants for a global car.
 *
 * @param {{
 *   brand: string,
 *   model: string,
 *   gen: string,
 *   search: string,
 *   profile?: string,
 *   year?: number
 * }} definition
 */
function buildCarSearchVariants(definition) {
  const brand = normalizeBrandName(definition.brand);
  const model = normalizeText(definition.model);
  const gen = normalizeText(definition.gen);
  const search = normalizeText(definition.search);
  const year = definition.year;

  const brandAliases = getBrandAliases(brand);
  const generationTokens = getGenerationTokens(gen);

  const variants = [];

  const add = (...values) => {
    for (const value of values) {
      if (value) variants.push(value);
    }
  };

  /*
   * 1. Original developer-defined search.
   *
   * This remains the highest-priority query because it is the most
   * specific query supplied by global-brand-expansion.js.
   */
  add(search);

  /*
   * 2. Brand aliases + original model.
   *
   * Example:
   * Mercedes-Benz E-Class W214
   * Mercedes E-Class W214
   */
  for (const brandAlias of brandAliases) {
    add(`${brandAlias} ${model} ${gen}`);
  }

  /*
   * 3. Model + generation without the brand.
   *
   * Example:
   * E-Class W214
   * Camry XV80
   * Macan 95B
   */
  add(`${model} ${gen}`);

  /*
   * 4. Generation first.
   *
   * Wikimedia often has file names where the generation code appears
   * before/after the model name.
   */
  for (const generation of generationTokens) {
    add(`${generation} ${brand} ${model}`);

    for (const brandAlias of brandAliases) {
      add(`${generation} ${brandAlias} ${model}`);
    }
  }

  /*
   * 5. Search without generation.
   *
   * This is an important fallback because Wikimedia often has:
   *
   * "Toyota Camry"
   *
   * instead of:
   *
   * "Toyota Camry XV80"
   */
  const searchWithoutGeneration = removeGenerationFromSearch(search, gen);
  const simpleSearch = simplifySearch(searchWithoutGeneration);

  add(searchWithoutGeneration);
  add(simpleSearch);

  for (const brandAlias of brandAliases) {
    add(`${brandAlias} ${model}`);
  }

  /*
   * 6. Plain model-only search.
   *
   * Last-resort query. This is intentionally lower priority because
   * a model name by itself can return unrelated results.
   */
  add(model);

  /*
   * 7. Year-specific variants.
   *
   * Useful for newer cars where Wikimedia uses the model year.
   */
  if (year) {
    for (const brandAlias of brandAliases) {
      add(`${brandAlias} ${model} ${year}`);
    }

    add(`${model} ${year}`);
  }

  /*
   * 8. EV aliases.
   */
  const lowerModel = model.toLowerCase();
  const lowerSearch = search.toLowerCase();

  const isElectric =
    definition.profile === "ev" ||
    definition.profile === "evSport" ||
    /\bev\b/.test(lowerModel) ||
    /\belectric\b/.test(lowerModel) ||
    /\bev\b/.test(lowerSearch) ||
    /\belectric\b/.test(lowerSearch);

  if (isElectric) {
    for (const brandAlias of brandAliases) {
      add(`${brandAlias} ${model} EV`);
      add(`${brandAlias} ${model} Electric`);
    }

    add(`${model} EV`);
    add(`${model} Electric`);
  }

  /*
   * 9. Common special-model aliases.
   */
  if (lowerModel.includes("macan")) {
    add("Porsche Macan");
    add("Porsche Macan Electric");
    add("Porsche Macan EV");
  }

  if (lowerModel.includes("santa fe")) {
    add("Hyundai Santa Fe");
    add("Hyundai Santa Fe SUV");
  }

  if (lowerModel.includes("camry")) {
    add("Toyota Camry");
    add("Toyota Camry Sedan");
  }

  if (lowerModel.includes("corolla")) {
    add("Toyota Corolla");
    add("Toyota Corolla Sedan");
  }

  if (lowerModel.includes("land cruiser")) {
    add("Toyota Land Cruiser");
    add("Toyota Land Cruiser SUV");
  }

  if (lowerModel.includes("f-150")) {
    add("Ford F-150");
    add("Ford F150");
  }

  if (lowerModel.includes("sf90")) {
    add("Ferrari SF90");
    add("Ferrari SF90 Stradale");
    add("Ferrari SF90 Spider");
  }

  if (lowerModel.includes("urus")) {
    add("Lamborghini Urus");
    add("Lamborghini Urus SUV");
  }

  /*
   * Remove duplicates but preserve priority order.
   */
  return uniqueStrings(variants);
}

/* -------------------------------------------------------------------------- */
/* Catalog functions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * @param {object[]} brands
 */
export function collectCarKeys(brands) {
  const set = new Set();

  for (const b of brands) {
    for (const m of b.models || []) {
      for (const g of m.generations || []) {
        for (const c of g.cars || []) {
          set.add(`${b.name}|${m.name}|${c.trim}`.toLowerCase());
        }
      }
    }
  }

  return set;
}

/**
 * @param {Set<string>} existing
 * @param {string} brand
 * @param {string} model
 * @param {string} trim
 * @param {string} imageKey
 * @param {keyof typeof GLOBAL_PROFILES} profile
 * @param {number} year
 * @param {object} extra
 */
export function mkGlobalCar(
  existing,
  brand,
  model,
  trim,
  imageKey,
  profile,
  year = 2024,
  extra = {},
) {
  const key = `${brand}|${model}|${trim}`.toLowerCase();

  if (existing.has(key)) return null;

  const base = GLOBAL_PROFILES[profile] || GLOBAL_PROFILES.compactS;
  const specs = applyTrimVariation(
    {
      ...base,
      features: extra.features || ["Factory spec", "Multi-angle gallery", "REVORA catalog"],
    },
    trim,
    model,
  );

  return {
    trim,
    year,
    images: carImgForTrim(imageKey, trim),
    ...specs,
    ...extra,
    features: specs.features,
    description:
      extra.description ||
      `${brand} ${model} ${trim} — full lineup entry on REVORA with verified gallery images.`,
  };
}

/**
 * @param {RawEntry[]} raw
 */
export function groupIntoBrands(raw, brandMeta = {}) {
  /** @type {Map<string, Map<string, {model: string, gen: string, cars: object[]}>>} */
  const tree = new Map();

  for (const [brand, model, gen, trim, img, profile, year] of raw) {
    const car = mkGlobalCar(new Set(), brand, model, trim, img, profile, year);

    if (!car) continue;

    if (!tree.has(brand)) {
      tree.set(brand, new Map());
    }

    const models = tree.get(brand);
    const modelKey = `${model}::${gen}`;

    if (!models.has(modelKey)) {
      models.set(modelKey, {
        model,
        gen,
        cars: [],
      });
    }

    models.get(modelKey).cars.push(car);
  }

  const brands = [];

  for (const [brandName, modelsMap] of tree) {
    const meta = brandMeta[brandName] || {
      country: "Global",
      description: `${brandName} on REVORA.`,
    };

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
      brands.push({
        name: brandName,
        ...meta,
        models,
      });
    }
  }

  return brands;
}

/**
 * Build brands from raw tuples with dedup against existing catalog keys.
 *
 * @param {RawEntry[]} raw
 * @param {object} brandMeta
 * @param {Set<string>} existingKeys
 */
export function buildBrandsFromRaw(raw, brandMeta, existingKeys) {
  /** @type {Map<string, Map<string, {model: string, gen: string, cars: object[]}>>} */
  const tree = new Map();

  for (const [brand, model, gen, trim, img, profile, year] of raw) {
    const car = mkGlobalCar(
      existingKeys,
      brand,
      model,
      trim,
      img,
      profile,
      year,
    );

    if (!car) continue;

    if (!tree.has(brand)) {
      tree.set(brand, new Map());
    }

    const models = tree.get(brand);
    const modelKey = `${model}::${gen}`;

    if (!models.has(modelKey)) {
      models.set(modelKey, {
        model,
        gen,
        cars: [],
      });
    }

    models.get(modelKey).cars.push(car);
  }

  const brands = [];

  for (const [brandName, modelsMap] of tree) {
    const meta = brandMeta[brandName] || {
      country: "Global",
      description: `${brandName} on REVORA.`,
    };

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
      brands.push({
        name: brandName,
        ...meta,
        models,
      });
    }
  }

  return brands;
}

/**
 * Merge expanded brands into the legacy catalog.
 *
 * @param {object[]} legacy
 * @param {object[]} expanded
 */
export function mergeBrands(legacy, expanded) {
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
          continue;
        }

        const trimSet = new Set(genMatch.cars.map((c) => c.trim.toLowerCase()));

        for (const car of gen.cars) {
          const trimKey = car.trim.toLowerCase();

          if (!trimSet.has(trimKey)) {
            genMatch.cars.push(car);
            trimSet.add(trimKey);
          }
        }
      }
    }
  }

  return [...brandMap.values()];
}

/* -------------------------------------------------------------------------- */
/* Image search registry                                                      */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {{
 *   exterior: string,
 *   interior: string,
 *   queries?: string[],
 *   exteriorQueries?: string[],
 *   interiorQueries?: string[]
 * }} ImageSearchEntry
 */

/**
 * Build the image search registry for global lineups.
 *
 * The existing sync script can continue using:
 *
 *   registry[key].exterior
 *   registry[key].interior
 *
 * while newer code can use:
 *
 *   registry[key].queries
 *   registry[key].exteriorQueries
 *   registry[key].interiorQueries
 *
 * @param {Array<{
 *   brand: string,
 *   model: string,
 *   gen: string,
 *   imgKey: string,
 *   search: string,
 *   profile: string,
 *   year?: number,
 *   trims: string[]
 * }>} defs
 * @param {Set<string>} existing
 * @param {Record<string, ImageSearchEntry>} imageSearches
 */
export function expandLineups(defs, existing, imageSearches) {
  /** @type {RawEntry[]} */
  const raw = [];

  for (const d of defs) {
    const variants = buildCarSearchVariants(d);

    const exteriorQueries = uniqueStrings([
      ...variants,

      /*
       * Exterior-specific fallbacks.
       */
      ...variants.map((query) => `${query} car`),
    ]);

    const interiorBaseQueries = uniqueStrings([
      ...variants,

      /*
       * Interior queries should still contain the actual vehicle
       * name before adding "interior/cockpit".
       */
      ...variants.map((query) => `${query} interior`),
      ...variants.map((query) => `${query} cockpit`),
    ]);

    const interiorQueries = uniqueStrings([
      ...interiorBaseQueries,
      ...variants.map((query) => `${query} interior cockpit`),
      ...variants.map((query) => `${query} dashboard`),
    ]);

    /*
     * Keep the original fields for backward compatibility.
     */
    imageSearches[d.imgKey] = {
      brand: d.brand,
      model: d.model,
      generation: d.gen || "",
      year: d.year || "",

      exterior: variants[0] || d.search,

      interior: `${variants[0] || d.search} interior cockpit`,

      queries: uniqueStrings([...exteriorQueries, ...interiorQueries]),

      exteriorQueries,

      interiorQueries,
    };

    for (const trim of d.trims || []) {
      raw.push([
        d.brand,
        d.model,
        d.gen,
        trim,
        d.imgKey,
        d.profile,
        d.year ?? 2024,
      ]);
    }
  }

  return raw;
}
