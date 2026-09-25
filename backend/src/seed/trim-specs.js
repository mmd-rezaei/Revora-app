/**
 * Derive trim-specific specs so variants are not identical clones.
 * @param {object} base
 * @param {string} trim
 * @param {string} [model]
 */
export function applyTrimVariation(base, trim, model = "") {
  const t = `${trim} ${model}`.toLowerCase();
  const out = { ...base };
  const features = new Set(Array.isArray(base.features) ? base.features : []);

  const bumpHp = (n) => {
    out.horsepower = Math.min(2500, Math.round((out.horsepower || 100) + n));
  };
  const bumpTorque = (n) => {
    out.torque = Math.min(3000, Math.round((out.torque || 120) + n));
  };

  if (/m\d{2,3}|amg|rs\s?\d|gt\s|gts|nismo|hellcat|scat|type r|n line|n\b|turbo|توربو|sport|اسپرت|performance|plaid|competition|track|dark horse|z06|z07/i.test(t)) {
    bumpHp(45);
    bumpTorque(55);
    out.zeroToHundred = Math.max(1.5, Number((out.zeroToHundred - 1.2).toFixed(1)));
    out.topSpeed = Math.min(550, (out.topSpeed || 180) + 15);
    features.add("Performance tune");
  } else if (/plus|پلاس|max|premium|luxury|flagship|elite|touring|limited|calligraphy|mulliner|excellence|high country|platinum|prestige/i.test(t)) {
    bumpHp(12);
    bumpTorque(18);
    features.add("Premium package");
  } else if (/^\s*(base|lx|se|s\b|gl\b|ex\b|111|132|141|micro|economy)\b/i.test(trim) && !/plus|turbo|sport/i.test(t)) {
    bumpHp(-8);
    bumpTorque(-10);
    out.zeroToHundred = Number((out.zeroToHundred + 0.6).toFixed(1));
    features.add("Base trim");
  }

  if (/automatic|اتوماتیک|cvt|dct|pdk|single-speed|e-shift/i.test(t)) {
    out.transmission = out.transmission === "Manual" ? "Automatic" : out.transmission;
    features.add("Automatic gearbox");
  }
  if (/manual|دنده‌ای|mt\b|6-speed manual|6mt/i.test(t)) {
    out.transmission = "Manual";
    features.add("Manual gearbox");
  }

  if (/4wd|4x4|awd|xdrive|quattro|4matic|allgrip|دوکابین/i.test(t)) {
    out.driveType = out.driveType === "FWD" ? "AWD" : out.driveType;
    features.add("All-wheel drive");
  }

  if (/cng|دوگانه‌سوز|gnc|bi-fuel/i.test(t)) {
    out.fuelType = "Petrol";
    bumpHp(-6);
    features.add("CNG dual-fuel");
  }
  if (/hybrid|phev|plug-in|هیبرید|e-tech|recharge/i.test(t)) {
    out.fuelType = /plug|phev|\+|recharge/i.test(t) ? "Plug-in Hybrid" : "Hybrid";
    bumpHp(20);
    features.add("Hybrid powertrain");
  }
  if (/electric|ev\b|e-tron|ioniq|bz4x|eq\d|folgore|برقی|الکتری/i.test(t)) {
    out.fuelType = "Electric";
    out.transmission = "Single-Speed";
    features.add("Electric drive");
  }

  if (/diesel|دیزل|tdi|dci|d \d|cdi/i.test(t)) {
    out.fuelType = "Diesel";
    bumpTorque(35);
    features.add("Diesel engine");
  }

  if (/pickup|وانت|pick-up|truck|padra|shoka|tunland|silverado|f-150|ranger|hilux|j7|t8/i.test(t)) {
    out.bodyType = "Pickup";
  }

  if (/wagon|avant|estate|sw\b|tour/i.test(t)) {
    out.bodyType = "Wagon";
  }

  if (/coupe|coupe|roadster|convertible|cabrio|spider|cielo|volante|rf\b/i.test(t)) {
    out.bodyType = /convertible|roadster|cabrio|spider|volante|rf/i.test(t) ? "Convertible" : "Coupe";
  }

  // Iranian Saipa Pride ladder (111 → 151) and trim letters.
  const prideNum = trim.match(/\b(111|131|132|141|151)\b/);
  if (prideNum) {
    const tier = Number(prideNum[1]);
    bumpHp(Math.round((tier - 111) * 1.5));
    bumpTorque(Math.round((tier - 111) * 2));
    out.weight = Math.round((out.weight || 900) + (tier - 111) * 4);
    features.add(`Pride ${prideNum[1]}`);
  }
  if (/\bsx\b/i.test(trim)) {
    bumpHp(10);
    bumpTorque(12);
    features.add("SX equipment");
  } else if (/\bex\b/i.test(trim)) {
    bumpHp(6);
    bumpTorque(8);
    features.add("EX equipment");
  } else if (/\bsl\b/i.test(trim)) {
    bumpHp(4);
    features.add("SL equipment");
  } else if (/\ble\b/i.test(trim)) {
    bumpHp(-3);
    features.add("LE economy");
  } else if (/\bse\b/i.test(trim)) {
    bumpHp(5);
    features.add("SE special");
  } else if (/\btl\b/i.test(trim)) {
    bumpHp(-5);
    out.zeroToHundred = Number((out.zeroToHundred + 0.4).toFixed(1));
    features.add("TL base");
  }
  if (/صبا|saba/i.test(t)) features.add("Saba sedan");
  if (/نسیم|nasim/i.test(t)) {
    bumpHp(-4);
    features.add("Nasim hatch");
  }
  if (/استیشن|station|estate/i.test(t)) {
    out.bodyType = "Wagon";
    features.add("Station wagon");
  }

  // Peugeot 206 Iran trims (SD vs hatch).
  if (/206\s*sd|sd\s*v/i.test(t)) {
    out.bodyType = "Sedan";
    bumpHp(3);
    features.add("206 SD sedan");
  } else if (/206|تیپ/i.test(t) && /peugeot|پژو/i.test(model)) {
    out.bodyType = "Hatchback";
    features.add("206 hatch");
  }

  out.features = [...features].slice(0, 8);
  return out;
}

/** Stable index from trim label — used to pick a different lead photo per trim. */
export function trimPhotoIndex(trim, count) {
  if (count <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < trim.length; i += 1) {
    hash = (hash * 31 + trim.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
