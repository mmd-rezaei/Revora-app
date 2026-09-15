function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function styleFromConfig(config = {}) {
  let style = 62;
  const exterior = config.exterior || {};
  const wheels = config.wheels || {};
  const interior = config.interior || {};

  const stylePicks = [
    exterior.bodyKit,
    exterior.spoiler,
    exterior.hood,
    wheels.design,
    interior.seats,
    interior.trim,
  ];

  for (const pick of stylePicks) {
    if (pick && !["Stock", "Standard", "None", "Off"].includes(pick)) {
      style += 4;
    }
  }

  if (wheels.size && wheels.size !== '19"') style += 2;
  if (interior.ambientLighting && interior.ambientLighting !== "Off") style += 2;

  return style;
}

export function validateExclusiveGroups(parts) {
  const used = new Map();
  for (const part of parts) {
    if (!part.exclusiveGroup) continue;
    if (used.has(part.exclusiveGroup)) {
      return {
        ok: false,
        message: `${used.get(part.exclusiveGroup).name} cannot be combined with ${part.name}`,
      };
    }
    used.set(part.exclusiveGroup, part);
  }
  return { ok: true };
}

export function calculatePerformance(car, parts = [], config = {}) {
  const exclusive = validateExclusiveGroups(parts);
  if (!exclusive.ok) {
    const error = new Error(exclusive.message);
    error.status = 400;
    throw error;
  }

  let horsepower = Number(car.horsepower);
  let torque = Number(car.torque);
  let weight = Number(car.weight);
  let handling = 68;
  let braking = 68;
  let reliability = 86;
  let extraZero = 0;
  let extraTop = 0;
  let extraStyle = 0;

  for (const part of parts) {
    const effects = part.effects || {};
    horsepower += effects.horsepower || 0;
    torque += effects.torque || 0;
    weight += effects.weight || 0;
    handling += effects.handling || 0;
    braking += effects.braking || 0;
    reliability += effects.reliability || 0;
    extraZero += effects.zeroToHundred || 0;
    extraTop += effects.topSpeed || 0;
    extraStyle += effects.style || 0;
  }

  const stockRatio = car.horsepower / Math.max(car.weight, 1);
  const tunedRatio = horsepower / Math.max(weight, 1);
  const powerWeightGain = tunedRatio / Math.max(stockRatio, 0.001);

  let zeroToHundred = car.zeroToHundred / Math.pow(powerWeightGain, 0.38);
  zeroToHundred += extraZero;
  zeroToHundred -= (braking - 68) * 0.008;

  let topSpeed = car.topSpeed * Math.pow(horsepower / Math.max(car.horsepower, 1), 0.16);
  topSpeed += extraTop;

  const style = styleFromConfig(config) + extraStyle;

  horsepower = clamp(Math.round(horsepower), 50, 2500);
  torque = clamp(Math.round(torque), 50, 3000);
  weight = clamp(Math.round(weight), 600, 4000);
  zeroToHundred = clamp(Math.round(zeroToHundred * 100) / 100, 1.6, 20);
  topSpeed = clamp(Math.round(topSpeed), 80, 520);
  handling = clamp(Math.round(handling), 1, 100);
  braking = clamp(Math.round(braking), 1, 100);
  reliability = clamp(Math.round(reliability), 1, 100);
  const styleScore = clamp(Math.round(style), 1, 100);

  const performanceScore = clamp(
    Math.round(
      (horsepower / 850) * 38 +
        ((8.5 - zeroToHundred) / 6.5) * 36 +
        (topSpeed / 340) * 26,
    ),
    1,
    100,
  );

  const overall = clamp(
    Math.round(performanceScore * 0.35 + handling * 0.25 + braking * 0.2 + styleScore * 0.2),
    1,
    100,
  );

  return {
    calculatedPerformance: {
      horsepower,
      torque,
      zeroToHundred,
      topSpeed,
      weight,
      handling,
      braking,
      reliability,
    },
    scores: {
      performance: performanceScore,
      handling,
      braking,
      style: styleScore,
      overall,
    },
  };
}
