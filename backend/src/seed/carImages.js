import { EXPANSION_IMAGES, wikiExpansion } from "./carImages.expansion.js";
import { IRANIAN_IMAGES } from "./carImages.iranian.js";
import { trimPhotoIndex } from "./trim-specs.js";

/**
 * Wikimedia image helper
 *
 * Accepts:
 * - Wikimedia filenames
 * - full Wikimedia Special:FilePath URLs
 * - previously malformed / nested URLs
 *
 * Returns a normalized Special:FilePath URL.
 */

export function wiki(fileName, width = 1600) {
  if (typeof fileName !== "string" || !fileName.trim()) {
    return "";
  }

  const prefix = "https://commons.wikimedia.org/wiki/Special:FilePath/";

  let value = fileName.trim();

  // Decode nested URL encoding.
  for (let i = 0; i < 10; i++) {
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

  // Extract filename from Wikimedia URL.
  if (value.includes(prefix)) {
    value = value.substring(value.lastIndexOf(prefix) + prefix.length);
  }

  // Remove query string.
  value = value.split("?")[0];

  // Remove any remaining nested prefix.
  while (value.startsWith(prefix)) {
    value = value.substring(prefix.length);
  }

  value = value.trim();

  if (!value) {
    return "";
  }

  // Normalize spaces.
  value = value.replace(/ /g, "_");

  return `${prefix}${encodeURIComponent(value)}?width=${width}`;
}

/**
 * @type {Record<string, string[]>}
 */
export const CAR_IMAGES = {
  // =========================================================
  // BMW
  // =========================================================

  bmw_m3_g80: [
    wiki("BMW M3 Competition (G80) 1X7A0170.jpg"),
    wiki("BMW M3 COMPETITION (G80) China.jpg"),
  ],

  bmw_m4_g82: [
    wiki("BMW M4 (G82) Competition 1X7A0305.jpg"),
    wiki("BMW M4 (G82) Competition 1X7A6103.jpg"),
  ],

  bmw_m5_f90_cs: [
    wiki("BMW M5 CS F90 at FOS22.jpg"),
    wiki("2021 BMW M5 CS F90.jpg"),
  ],

  // =========================================================
  // Mercedes-Benz
  // =========================================================

  mercedes_c63_w206: [
    wiki("Mercedes-AMG C 63 (W206) IMG 0310.jpg"),
    wiki("Mercedes-AMG C 63 (W206) IMG 0309.jpg"),
  ],

  mercedes_amg_gt63: [
    wiki("Mercedes-AMG GT 63 S, Le Grand-Saconnex (1X7A1869).jpg"),
    wiki("Mercedes-AMG GT 63 S (Facelift) 1X7A7353.jpg"),
  ],

  // =========================================================
  // Porsche
  // =========================================================

  porsche_992_carrera_s: [
    wiki("Porsche 992 Carrera S coupe IMG 5832.jpg"),
    wiki("Porsche 992 Carrera S coupe IMG 5838.jpg"),
  ],

  porsche_992_gt3: [
    wiki("Porsche 992 GT3 with touring package 1X7A6511.jpg"),
    wiki("Porsche 911 GT3 RS (2022) 1X7A7164.jpg"),
  ],

  // =========================================================
  // Nissan
  // =========================================================

  nissan_gtr_r35_nismo: [
    wiki("Nissan GT-R NISMO (4BA-R35) front.jpg"),
    wiki("Nissan GT-R NISMO (4BA-R35) rear.jpg"),
  ],

  nissan_z_nismo: [
    wiki(
      "Nissan 5BA-RZ34 Fairlady Z NISMO (RZ34フェアレディZ nismo (DUNLOP×NISSAN)) (Ent No.-) (24021013411).jpg",
    ),
    wiki(
      "Nissan 5BA-RZ34 Fairlady Z NISMO (RZ34フェアレディZ nismo (DUNLOP×NISSAN)) (Ent No.-) (24021013404).jpg",
    ),
  ],

  // =========================================================
  // Toyota
  // =========================================================

  toyota_supra_a90: [
    wiki("Dülmen, Auto Bertels, Toyota GR Supra -- 2021 -- 9552-4.jpg"),
    wiki("Dülmen, Auto Bertels, Toyota GR Supra -- 2021 -- 9564.jpg"),
  ],

  toyota_gr_yaris: [
    wiki('Toyota GR YARIS RZ"High performance" (3BA-GXPA16).jpg'),
    wiki("Toyota GR YARIS RZ High performance (4BA-GXPA16-AGFGZ(H)) front.jpg"),
  ],

  // =========================================================
  // Ford
  // =========================================================

  ford_mustang_dark_horse: [
    wiki("2024 Ford Mustang Dark Horse.jpg"),
    wiki("Ford Mustang Dark Horse (2024) (53621721110).jpg"),
  ],

  ford_gt: [wiki("2017 Ford GT front.JPG"), wiki("2017 Ford GT rear.JPG")],

  // =========================================================
  // Ferrari
  // =========================================================

  ferrari_296_gtb: [
    wiki("Ferrari 296 GTB 1X7A6377.jpg"),
    wiki("Ferrari 296 GTB 1X7A6379.jpg"),
  ],

  ferrari_f8_tributo: [
    wiki("Ferrari F8 Tributo, GIMS 2019, Le Grand-Saconnex (GIMS1319).jpg"),
    wiki("Ferrari F8 Tributo, GIMS 2019, Le Grand-Saconnex (GIMS1318).jpg"),
  ],

  // =========================================================
  // Lamborghini
  // =========================================================

  lamborghini_huracan_tecnica: [
    wiki("Lamborghini Huracan Tecnica.jpg"),
    wiki("Lamborghini Huracán Tecnica 1X7A7430.jpg"),
  ],

  lamborghini_urus_s: [
    wiki("Lamborghini Urus S 1X7A6796.jpg"),
    wiki("Lamborghini Urus S 1X7A6798.jpg"),
  ],

  // =========================================================
  // Audi
  // =========================================================

  audi_rs6_c8: [
    wiki("Audi RS6 Avant C8 at IAA 2019 IMG 0194.jpg"),
    wiki("Audi RS6 Avant C8 1X7A0305.jpg"),
  ],

  audi_r8_v10: [
    wiki("Audi R8 V10 Plus 5.2 FSI (Typ 4S, 2021) (52566757548).jpg"),
    wiki("Audi R8 V10 Plus 5.2 FSI (Typ 4S, 2022) (52566506794).jpg"),
  ],

  // =========================================================
  // Honda
  // =========================================================

  honda_civic_type_r: [
    wiki("HONDA CIVIC TYPE R FL5 China (2).jpg"),
    wiki("HONDA CIVIC TYPE R FL5 China (3).jpg"),
  ],

  honda_nsx_type_s: [
    wiki("Acura NSX - Flickr - dave 7.jpg"),
    wiki("Acura NSX - Flickr - dave 7 (1).jpg"),
  ],

  // =========================================================
  // Tesla
  // =========================================================

  tesla_model_s_plaid: [
    wiki("Tesla Model S Plaid Autofrühling Ulm IMG 9278.jpg"),
    wiki("2021 Tesla Model S P2 Long Range front right view.jpg"),
  ],

  // =========================================================
  // Chevrolet
  // =========================================================

  corvette_c8_z06: [
    wiki("Chevrolet Corvette Z06 (C8) Miami Metro Area, USA.jpg"),
    wiki("Chevrolet Corvette Z06 (C8) Washington DC Metro Area, USA (3).jpg"),
  ],

  // =========================================================
  // Iran Khodro
  // =========================================================

  ikco_dena_plus_turbo: [
    wiki("Dena Plus Turbo Iran Khodro.jpg"),
    wiki("IKCO Dena Plus 2019 (1398) Tehran front.jpg"),
  ],

  ikco_dena_plus: [
    wiki("Dena Plus 01.jpg"),
    wiki("IKCO Dena Plus 2019 (1398) Tehran front.jpg"),
  ],

  ikco_tara: [wiki("IKCO Tara 001.jpg"), wiki("IKCO Tara 002.jpg")],

  ikco_samand_soren: [
    wiki("Soren ELX.jpg"),
    wiki("IKCO Soren Plus 01 2023-06-30.jpg"),
  ],

  ikco_peugeot_206: [
    wiki("Peugeot 206 SD.jpg"),
    wiki("Peugeot 206 SD 01 2023-06-29.jpg"),
  ],

  ikco_peugeot_207i: [wiki("Peugeot 207i.jpg"), wiki("Peugeot 207i.jpg")],

  ikco_peugeot_pars: [
    wiki("Peugeot Pars 16V Motorcade.jpg"),
    wiki("Peugeot pars iran.jpg"),
  ],

  ikco_peugeot_2008: [
    wiki("2020 Peugeot 2008 Allure Front.jpg"),
    wiki("Peugeot 2008 II 001.jpg"),
  ],

  ikco_runna: [wiki("Runna2.jpg"), wiki("Runna+.jpg")],

  // ---------------------------------------------------------
  // Paykan
  // ---------------------------------------------------------

  ikco_paykan: [
    wiki("Yellow-Paykan-1.jpg"),
    wiki("Yellow-Paykan-2.jpg"),
    wiki("Yellow-Paykan-3.jpg"),
    wiki("Yellow-Paykan-4.jpg"),
    wiki("Yellow-Paykan-Inside-View.jpg"),
  ],

  // ---------------------------------------------------------
  // Hillman Hunter / Paykan
  // ---------------------------------------------------------

  ikco_hillman_hunter: [wiki("Peykan.jpg"), wiki("Yellow-Paykan-2.jpg")],

  // ---------------------------------------------------------
  // Peugeot 205
  // ---------------------------------------------------------

  ikco_peugeot_205: [
    wiki("Peugeot 205 GTI.jpg"),
    wiki("Peugeot 205 front.JPG"),
  ],

  // ---------------------------------------------------------
  // Peugeot 405
  // ---------------------------------------------------------

  ikco_peugeot_405: [
    wiki("Peugeot 405-Mi16 Front.jpg"),
    wiki("Peugeot 405 front.jpg"),
  ],

  // ---------------------------------------------------------
  // Peugeot RD
  // ---------------------------------------------------------

  ikco_peugeot_rd: [wiki("Peugeot RD 01 2025-05-06.jpg")],

  // ---------------------------------------------------------
  // Peugeot ROA
  // ---------------------------------------------------------

  ikco_peugeot_roa: [wiki("Peugeot RD 01 2025-05-06.jpg")],

  // ---------------------------------------------------------
  // Peugeot 301
  // ---------------------------------------------------------

  ikco_peugeot_301: [
    wiki("2017 Peugeot 301 (facelift, front).jpg"),
    wiki("Peugeot 301-C Berlina Front-view.JPG"),
  ],

  // ---------------------------------------------------------
  // Peugeot 407
  // ---------------------------------------------------------

  ikco_peugeot_407: [wiki("Peugeot 407 Coupé.jpg")],

  // ---------------------------------------------------------
  // Samand
  // =========================================================

  ikco_samand: [
    wiki("Samand white.jpg"),
    wiki("2007 Iran Khodro Samand LX silver rear.jpg"),
    wiki("Samand LX in Vantaa side.JPG"),
    wiki("Samand LX in Vantaa rear.JPG"),
    wiki("داخل سمند.jpg"),
    wiki("داخل و بغل سمند lx.jpg"),
  ],

  ikco_soren_plus: [
    wiki("IKCO Soren Plus 01 2023-06-30.jpg"),
    wiki("Soren ELX.jpg"),
  ],

  ikco_runna_lx: [wiki("Runna2.jpg"), wiki("Runna+.jpg")],

  ikco_dena_ef7: [
    wiki("Dena Plus 01.jpg"),
    wiki("IKCO Dena Plus 2019 (1398) Tehran front.jpg"),
  ],

  // ---------------------------------------------------------
  // Rira
  // ---------------------------------------------------------

  ikco_rira: [wiki("Rira ikco Iran khodro.jpg")],

  // ---------------------------------------------------------
  // Arisun
  // ---------------------------------------------------------

  ikco_arisun: [wiki("IKCO Arisun.jpg"), wiki("Arisun pickup Iran.jpg")],

  ikco_arisun2: [wiki("IKCO Arisun 2.jpg"), wiki("Arisun pickup Iran.jpg")],

  // =========================================================
  // Pars Khodro
  // =========================================================

  pars_tondar_90: [
    wiki("Renault Symbol Iran.jpg"),
    wiki("Renault Tondar 90.jpg"),
  ],

  pars_captur: [
    wiki("Renault Captur 001.jpg"),
    wiki("2013 Renault Captur Dynamique S dCi 1.5 Front.jpg"),
  ],

  // =========================================================
  // Bahman
  // =========================================================

  bahman_grand_vitara: [
    wiki("Suzuki Grand Vitara 2.0 2005.jpg"),
    wiki("Suzuki Grand Vitara (2005) front.jpg"),
  ],

  bahman_kizashi: [
    wiki("Suzuki Kizashi 001.jpg"),
    wiki("Suzuki Kizashi Sport SLS 2010.jpg"),
  ],

  // =========================================================
  // Dongfeng
  // =========================================================

  dongfeng_h30: [
    wiki("Dongfeng Fengshen H30 Cross.jpg"),
    wiki("Dongfeng Aeolus H30 Cross.jpg"),
  ],

  dongfeng_s30: [
    wiki("Dongfeng Fengshen S30.jpg"),
    wiki("Dongfeng Aeolus S30.jpg"),
  ],

  // =========================================================
  // Haima
  // =========================================================

  haima_s5: [wiki("Haima S5 001.jpg"), wiki("Haima S5 front.jpg")],

  haima_s7: [wiki("Haima S7 001.jpg"), wiki("Haima S7 front.jpg")],

  haima_8s: [wiki("Haima 8S 001.jpg"), wiki("Haima 8S front.jpg")],

  haima_7x: [wiki("Haima 7X 001.jpg"), wiki("Haima 7X front.jpg")],

  // =========================================================
  // Foton
  // =========================================================

  foton_tunland: [wiki("Foton Tunland.jpg"), wiki("Foton Tunland pickup.jpg")],

  foton_g7: [wiki("Foton G7 pickup.jpg"), wiki("Foton G7.jpg")],

  // =========================================================
  // SWM
  // =========================================================

  swm_gre: [wiki("SWM G01.jpg"), wiki("SWM G01F.jpg")],

  // =========================================================
  // KMC / Enovate
  // =========================================================

  k112_enoy: [wiki("Enovate ME5.jpg"), wiki("Enovate ME5 front.jpg")],

  // =========================================================
  // Seres / Safeer
  // =========================================================

  safeer_r7: [wiki("Seres 7.jpg"), wiki("Seres 7 front.jpg")],

  // =========================================================
  // Saipa / Renault / Citroën
  // =========================================================

  saipa_jyan: [wiki("Citroen Dyane.jpg"), wiki("Citroen Dyane front.jpg")],

  saipa_renault_5: [
    wiki("Renault 5.jpg"),
    wiki("Renault 5 (E5 GTJ) - 7 June 2026.jpg"),
  ],

  saipa_renault_21: [
    wiki("Renault 21 Nevada.jpg"),
    wiki("Renault 21 front 20080131.jpg"),
  ],

  saipa_zantia: [
    wiki("Citroen Xantia front 20080131.jpg"),
    wiki("Citroën Xantia 001.jpg"),
  ],

  saipa_rio: [wiki("Kia Rio 2011 001.jpg"), wiki("Kia Rio (JB) front.jpg")],

  saipa_cerato: [
    wiki("Kia Cerato 2013 001.jpg"),
    wiki("Kia Cerato (YD) front.jpg"),
  ],

  saipa_citroen_c3: [
    wiki("Citroen C3 001.jpg"),
    wiki("Citroën C3 (2009) front.jpg"),
  ],

  saipa_citroen_c5: [
    wiki("Citroen C5 001.jpg"),
    wiki("Citroën C5 (2008) front.jpg"),
  ],

  saipa_ario: [wiki("Saipa Ario.jpg"), wiki("Saipa Ario S300.jpg")],

  saipa_tiba1: [wiki("Saipa Tiba.jpg"), wiki("Saipa Tiba 2.jpg")],

  saipa_shahin_plus: [
    wiki("Saipa Shahin 01 2023-07-03.jpg"),
    wiki("Saipa Shahin 02 2023-07-03.jpg"),
  ],

  saipa_atlas: [wiki("Saipa Atlas.jpg"), wiki("Saipa Atlas front.jpg")],

  saipa_sahand: [wiki("Saipa Sahand.jpg"), wiki("Saipa Sahand front.jpg")],

  saipa_aria: [wiki("Saipa Aria.jpg"), wiki("Saipa Aria front.jpg")],

  saipa_cadila: [wiki("Cadila P90.jpg"), wiki("Cadila P90 front.jpg")],

  // =========================================================
  // Changan
  // =========================================================

  changan_cs15: [wiki("Changan CS15.jpg"), wiki("Changan CS15 front.jpg")],

  changan_cs55: [
    wiki("Changan CS55 Plus.jpg"),
    wiki("Changan CS55 Plus front.jpg"),
  ],

  changan_unik: [wiki("Changan Uni-K.jpg"), wiki("Changan Uni-K front.jpg")],

  changan_eado: [wiki("Changan Eado.jpg"), wiki("Changan Eado front.jpg")],

  // =========================================================
  // Zamyad
  // =========================================================

  zamyad_nissan_pickup: [
    wiki("Nissan Junior pickup.jpg"),
    wiki("Nissan Zamyad pickup.jpg"),
  ],

  zamyad_shoka: [wiki("Zamyad Shoka.jpg"), wiki("Shoka pickup Iran.jpg")],

  zamyad_padra: [wiki("Zamyad Padra.jpg"), wiki("Padra pickup Iran.jpg")],

  zamyad_zagros: [wiki("Zamyad Zagros.jpg"), wiki("Zagros pickup Iran.jpg")],

  zamyad_karoon: [wiki("Zamyad Karoon.jpg"), wiki("Karoon pickup Iran.jpg")],

  // =========================================================
  // Saipa
  // =========================================================

  saipa_shahin: [
    wiki("Saipa Shahin 01 2023-07-03.jpg"),
    wiki("Saipa Shahin 02 2023-07-03.jpg"),
  ],

  saipa_quick_r: [wiki("Saipa Quick.jpg"), wiki("Saipa Quik 001.jpg")],

  saipa_quick_s: [wiki("Saipa Quick.jpg"), wiki("Saipa Quik 001.jpg")],

  saipa_saina: [wiki("Saipa Saina 20170316.jpg"), wiki("Saipa Saina.jpg")],

  saipa_pride_111: [
    wiki("Saipa Pride GLXi sedan.jpg"),
    wiki("Kia Pride front 20071204.jpg"),
  ],

  saipa_pride_132: [
    wiki("Saipa Pride GLXi sedan.jpg"),
    wiki("Kia Pride front 20071204.jpg"),
  ],

  saipa_tiba: [wiki("Saipa Tiba.jpg"), wiki("Saipa Tiba 2.jpg")],

  saipa_cs35: [
    wiki("Changan CS35 Plus facelift IMG005.jpg"),
    wiki("Changan CS35 Plus facelift IMG004.jpg"),
  ],

  // =========================================================
  // Extended Global
  // =========================================================

  vw_golf_gti_clubsport: [
    wiki("Volkswagen Golf VIII GTI Facelift DSC 7803.jpg"),
    wiki("VOLKSWAGEN GOLF GTI (Mk8 CD1) China (8).jpg"),
  ],

  vw_golf_r: [
    wiki("VOLKSWAGEN GOLF R-LINE (Mk8 CD1) China.jpg"),
    wiki("VOLKSWAGEN GOLF R-LINE (Mk8 CD1) China (3).jpg"),
  ],

  peugeot_308_gt: [
    wiki("Peugeot 308 GT P5 Nera Black (5).jpg"),
    wiki("Peugeot 308 GT P5 Nera Black (6).jpg"),
  ],

  peugeot_508_pse: [
    wiki("Face avant - Peugeot 508 SW PSE.jpg"),
    wiki("Peugeot 508 PSE (51179903475).jpg"),
  ],

  renault_megane_rs: [
    wiki("Renault Megane RS Trophy, Paris Motor Show 2018, IMG 0680.jpg"),
    wiki("Renault Megane RS Trophy Filderstadt 1Y7A4867.jpg"),
  ],

  hyundai_i30n: [
    wiki("Hyundai i30 N, IAA 2017, Frankfurt (1Y7A3187).jpg"),
    wiki("2018 Hyundai i30 N Performance T-GDi 2.0.jpg"),
  ],

  hyundai_ioniq5n: [
    wiki("Hyundai Ioniq 5 N IMG 9390.jpg"),
    wiki("Hyundai Ioniq 5 N front.jpg"),
  ],

  kia_stinger_gt: [
    wiki("Kia Stinger GT 2022.jpg"),
    wiki("2023 Kia Stinger GT in HiChroma Red, front right.jpg"),
  ],

  kia_ev6_gt: [wiki("Kia EV6 GT IMG 8171.jpg"), wiki("Kia EV6 GT front.jpg")],

  lexus_lc500: [
    wiki("Lexus LC 500 URZ100 Nightfall Mica.jpg"),
    wiki("Lexus LC.jpg"),
  ],

  mazda_mx5_nd: [
    wiki("Mazda MX-5 ND Wien 26 July 2020 JM (1).jpg"),
    wiki("GIMS 2019, Le Grand-Saconnex (GIMS0566).jpg"),
  ],

  subaru_wrx: [
    wiki("Subaru WRX (VB) Washington DC Metro Area, USA.jpg"),
    wiki("Subaru WRX (VB) Washington DC Metro Area, USA (1).jpg"),
  ],

  dodge_challenger_hellcat: [
    wiki("2019 Dodge Challenger Hellcat Redeye, Cleveland Auto Show.jpg"),
    wiki("2019 Dodge Challenger Hellcat Redeye (2), Cleveland Auto Show.jpg"),
  ],

  volvo_s60_polestar: [
    wiki(
      "Osaka Motor Show 2019 (226) - Volvo S60 T8 Polestar Engineered (5LA-ZB420P).jpg",
    ),
    wiki(
      "Osaka Motor Show 2019 (224) - Volvo S60 T8 Polestar Engineered (5LA-ZB420P).jpg",
    ),
  ],

  genesis_g70: [
    wiki("Genesis G70 Sport IK PE Burleigh Blue (2).jpg"),
    wiki("Genesis G70 Sport IK PE Burleigh Blue (3).jpg"),
  ],

  mclaren_720s: [
    wiki("McLaren 720S, IAA 2017, (1Y7A3405).jpg"),
    wiki("McLaren 720S, IAA 2017, (1Y7A3406).jpg"),
  ],

  aston_martin_vantage: [
    wiki(
      "Aston Martin V8 Vantage, GIMS 2018, Le Grand-Saconnex (1X7A1588).jpg",
    ),
    wiki(
      "Aston Martin V8 Vantage, GIMS 2018, Le Grand-Saconnex (1X7A1589).jpg",
    ),
  ],

  jeep_trackhawk: [
    wiki(
      "Jeep Grand Cherokee Trackhawk (WK2) Washington DC Metro Area, USA.jpg",
    ),
    wiki("Geiger Jeep Trackhawk, TWB 2018, Friedrichshafen (OW1A0528).jpg"),
  ],

  maserati_mc20: [
    wiki("Maserati MC20 IAA 2021 1X7A0087.jpg"),
    wiki("Maserati MC20 Auto Zuerich 2021 IMG 0419.jpg"),
  ],

  // =========================================================
  // Expansion
  // =========================================================

  ...Object.fromEntries(
    Object.entries(EXPANSION_IMAGES).map(([key, files]) => [
      key,
      files.map((file) => wikiExpansion(file)),
    ]),
  ),

  ...Object.fromEntries(
    Object.entries(IRANIAN_IMAGES).map(([key, files]) => [key, files.map((file) => wiki(file))]),
  ),
};

// ===========================================================
// Image aliases
// ===========================================================

/** Only use aliases when models are visually identical rebadges. */
const IMAGE_ALIASES = {
  haima_7x_pro: "haima_7x",
  saipa_quick_s: "saipa_quick_r",
};

// ===========================================================
// carImg
// ===========================================================

const _warnedKeys = new Set();

/** Per-trim gallery: rotates lead photo so trims don't all look identical. */
export function carImgForTrim(key, trim) {
  const urls = carImg(key);
  if (urls.length <= 1) return urls;
  const start = trimPhotoIndex(trim, urls.length);
  return [...urls.slice(start), ...urls.slice(0, start)];
}

export function carImg(key) {
  // Exact image key.
  let urls = CAR_IMAGES[key];

  // Alias.
  if (!urls && IMAGE_ALIASES[key]) {
    const aliasKey = IMAGE_ALIASES[key];
    urls = CAR_IMAGES[aliasKey];
  }

  // Missing image.
  if (!urls?.length) {
    if (!_warnedKeys.has(key)) {
      console.warn(`Missing car image key: ${key}`);
      _warnedKeys.add(key);
    }

    return [wiki("Car icon red.svg")];
  }

  return urls
    .map((value) => {
      if (typeof value !== "string" || !value.trim()) {
        return "";
      }

      const prefix = "https://commons.wikimedia.org/wiki/Special:FilePath/";

      let fileName = value.trim();

      // Decode nested encoding.
      for (let i = 0; i < 10; i++) {
        try {
          const decoded = decodeURIComponent(fileName);

          if (decoded === fileName) {
            break;
          }

          fileName = decoded;
        } catch {
          break;
        }
      }

      // Remove nested Wikimedia prefixes.
      while (fileName.includes(prefix)) {
        fileName = fileName.substring(
          fileName.lastIndexOf(prefix) + prefix.length,
        );
      }

      // Remove query string.
      fileName = fileName.split("?")[0].trim();

      if (!fileName) {
        return "";
      }

      return wiki(fileName);
    })
    .filter(Boolean);
}

// ===========================================================
// Missing image keys
// ===========================================================

export function listMissingImageKeys() {
  return Object.keys(CAR_IMAGES).filter(
    (key) =>
      CAR_IMAGES[key]?.length === 1 &&
      CAR_IMAGES[key][0].includes("Car_icon_red.svg"),
  );
}
