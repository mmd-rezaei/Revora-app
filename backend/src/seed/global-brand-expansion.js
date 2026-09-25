import { buildBrandsFromRaw, expandLineups } from "./catalog-builder.js";

/** @type {Record<string, { exterior: string, interior: string }>} */
export const globalImageSearches = {};

const BRAND_META = {
  BMW: {
    country: "Germany",
    description: "Bayerische Motoren Werke — from 1 Series daily drivers to M division and i electric models.",
  },
  "Mercedes-Benz": {
    country: "Germany",
    description: "Mercedes-Benz — luxury sedans, AMG performance, EQ electric and the full passenger lineup.",
  },
  Audi: { country: "Germany", description: "Audi — Quattro AWD across A/Q/RS lines and e-tron electrification." },
  Porsche: { country: "Germany", description: "Porsche — 911, Cayenne, Macan, Taycan and the complete sports lineup." },
  Toyota: { country: "Japan", description: "Toyota — world's largest automaker from Corolla to Land Cruiser and GR performance." },
  Nissan: { country: "Japan", description: "Nissan — from Leaf EV to GT-R Godzilla and the full global model range." },
  Honda: { country: "Japan", description: "Honda — Civic to Pilot, Type R heritage and hybrid efficiency." },
  Lexus: { country: "Japan", description: "Lexus — Toyota luxury with LS flagship, RX bestseller and F performance." },
  Mazda: { country: "Japan", description: "Mazda — Jinba ittai driving joy from MX-5 to CX-90." },
  Hyundai: { country: "South Korea", description: "Hyundai — Ioniq EVs, Tucson SUVs and N performance division." },
  Kia: { country: "South Korea", description: "Kia — Sportage, EV9 and the full Korean lineup." },
  Ford: { country: "United States", description: "Ford — F-Series, Mustang, Bronco and America's best-selling trucks." },
  Chevrolet: { country: "United States", description: "Chevrolet — Silverado, Camaro, Corvette and the Bowtie lineup." },
  Dodge: { country: "United States", description: "Dodge — muscle cars, Charger, Durango and Hellcat power." },
  Ferrari: { country: "Italy", description: "Ferrari — Maranello supercars from Roma to SF90 and Purosangue." },
  Lamborghini: { country: "Italy", description: "Lamborghini — Sant'Agata V12/V10 supercars and Urus super-SUV." },
  Maserati: { country: "Italy", description: "Maserati — Modena GT elegance from Grecale to MC20 Nettuno V6." },
  McLaren: { country: "United Kingdom", description: "McLaren — Woking carbon-tub supercars from Artura to 750S." },
  "Aston Martin": {
    country: "United Kingdom",
    description: "Aston Martin — British GT glamour: DB12, Vantage, DBS and DBX.",
  },
  Bentley: { country: "United Kingdom", description: "Bentley — Crewe luxury: Continental GT, Flying Spur and Bentayga." },
  Peugeot: { country: "France", description: "Peugeot — French design from 208 city car to 5008 family SUV." },
  Renault: { country: "France", description: "Renault — Clio bestseller, Captur crossover and Alpine-adjacent hot hatches." },
  Volvo: { country: "Sweden", description: "Volvo — Scandinavian safety, Recharge hybrids and EX electric SUVs." },
};

/** @type {Array<{ brand: string, model: string, gen: string, imgKey: string, search: string, profile: string, year?: number, trims: string[] }>} */
const LINEUPS = [
  // ── BMW ──
  { brand: "BMW", model: "1 Series", gen: "F70", imgKey: "bmw_1series_f70", search: "BMW 1 Series F70", profile: "compactH", trims: ["120", "M135 xDrive"] },
  { brand: "BMW", model: "2 Series", gen: "G42", imgKey: "bmw_2series_g42", search: "BMW 2 Series Coupe G42", profile: "sportC", trims: ["220i", "M240i xDrive"] },
  { brand: "BMW", model: "3 Series", gen: "G20", imgKey: "bmw_3series_g20", search: "BMW 3 Series G20", profile: "compactS", trims: ["320i", "330i", "M340i xDrive"] },
  { brand: "BMW", model: "4 Series", gen: "G22", imgKey: "bmw_4series_g22", search: "BMW 4 Series G22", profile: "sportC", trims: ["430i", "M440i xDrive"] },
  { brand: "BMW", model: "5 Series", gen: "G60", imgKey: "bmw_5series_g60", search: "BMW 5 Series G60", profile: "midS", trims: ["520i", "530e", "M550i xDrive"] },
  { brand: "BMW", model: "7 Series", gen: "G70", imgKey: "bmw_7series_g70", search: "BMW 7 Series G70", profile: "luxuryS", trims: ["740i", "760i xDrive", "i7 xDrive60"] },
  { brand: "BMW", model: "X1", gen: "U11", imgKey: "bmw_x1_u11", search: "BMW X1 U11", profile: "suvS", trims: ["sDrive18i", "xDrive23i", "iX1 xDrive30"] },
  { brand: "BMW", model: "X2", gen: "U10", imgKey: "bmw_x2_u10", search: "BMW X2 U10", profile: "suvS", trims: ["xDrive20i", "M35i xDrive"] },
  { brand: "BMW", model: "X3", gen: "G45", imgKey: "bmw_x3_g45", search: "BMW X3 G45", profile: "suvM", trims: ["xDrive20", "xDrive30", "M50 xDrive"] },
  { brand: "BMW", model: "X4", gen: "G02", imgKey: "bmw_x4_g02", search: "BMW X4 G02", profile: "suvM", trims: ["xDrive30i", "M40i"] },
  { brand: "BMW", model: "X5", gen: "G05", imgKey: "bmw_x5_g05", search: "BMW X5 G05", profile: "suvL", trims: ["xDrive40i", "xDrive50e", "M60i"] },
  { brand: "BMW", model: "X6", gen: "G06", imgKey: "bmw_x6_g06", search: "BMW X6 G06", profile: "suvL", trims: ["xDrive40i", "M60i"] },
  { brand: "BMW", model: "X7", gen: "G07", imgKey: "bmw_x7_g07", search: "BMW X7 G07", profile: "suvL", trims: ["xDrive40i", "M60i"] },
  { brand: "BMW", model: "XM", gen: "G09", imgKey: "bmw_xm_g09", search: "BMW XM G09", profile: "suvL", trims: ["XM", "XM Label Red"] },
  { brand: "BMW", model: "Z4", gen: "G29", imgKey: "bmw_z4_g29", search: "BMW Z4 G29", profile: "roadster", trims: ["sDrive30i", "M40i"] },
  { brand: "BMW", model: "i4", gen: "G26", imgKey: "bmw_i4_g26", search: "BMW i4 G26", profile: "evSport", trims: ["eDrive35", "M50"] },
  { brand: "BMW", model: "iX", gen: "I20", imgKey: "bmw_ix_i20", search: "BMW iX I20", profile: "ev", trims: ["xDrive40", "xDrive50", "M60"] },
  { brand: "BMW", model: "M2", gen: "G87", imgKey: "bmw_m2_g87", search: "BMW M2 G87", profile: "sportC", trims: ["M2", "M2 CS"] },

  // ── Mercedes-Benz ──
  { brand: "Mercedes-Benz", model: "A-Class", gen: "W177", imgKey: "mercedes_a_w177", search: "Mercedes-Benz A-Class W177", profile: "compactH", trims: ["A180", "A35 AMG", "A45 S AMG"] },
  { brand: "Mercedes-Benz", model: "C-Class", gen: "W206", imgKey: "mercedes_c_w206", search: "Mercedes-Benz C-Class W206", profile: "compactS", trims: ["C200", "C300", "C43 AMG"] },
  { brand: "Mercedes-Benz", model: "E-Class", gen: "W214", imgKey: "mercedes_e_w214", search: "Mercedes-Benz E-Class W214", profile: "midS", trims: ["E200", "E300e", "E53 AMG"] },
  { brand: "Mercedes-Benz", model: "S-Class", gen: "W223", imgKey: "mercedes_s_w223", search: "Mercedes-Benz S-Class W223", profile: "luxuryS", trims: ["S450", "S580", "S63 AMG E Performance"] },
  { brand: "Mercedes-Benz", model: "CLA", gen: "C118", imgKey: "mercedes_cla_c118", search: "Mercedes-Benz CLA C118", profile: "compactS", trims: ["CLA200", "CLA35 AMG", "CLA45 S AMG"] },
  { brand: "Mercedes-Benz", model: "GLA", gen: "H247", imgKey: "mercedes_gla_h247", search: "Mercedes-Benz GLA H247", profile: "suvS", trims: ["GLA200", "GLA35 AMG", "GLA45 AMG"] },
  { brand: "Mercedes-Benz", model: "GLB", gen: "X247", imgKey: "mercedes_glb_x247", search: "Mercedes-Benz GLB X247", profile: "suvS", trims: ["GLB200", "GLB35 AMG"] },
  { brand: "Mercedes-Benz", model: "GLC", gen: "X254", imgKey: "mercedes_glc_x254", search: "Mercedes-Benz GLC X254", profile: "suvM", trims: ["GLC200", "GLC300e", "GLC63 AMG"] },
  { brand: "Mercedes-Benz", model: "GLE", gen: "W167", imgKey: "mercedes_gle_w167", search: "Mercedes-Benz GLE W167", profile: "suvL", trims: ["GLE350", "GLE450", "GLE63 AMG"] },
  { brand: "Mercedes-Benz", model: "GLS", gen: "X167", imgKey: "mercedes_gls_x167", search: "Mercedes-Benz GLS X167", profile: "suvL", trims: ["GLS450", "GLS580", "GLS63 AMG"] },
  { brand: "Mercedes-Benz", model: "G-Class", gen: "W463", imgKey: "mercedes_g_w463", search: "Mercedes-Benz G-Class W463", profile: "suvL", trims: ["G500", "G63 AMG"] },
  { brand: "Mercedes-Benz", model: "EQE", gen: "V295", imgKey: "mercedes_eqe_v295", search: "Mercedes-Benz EQE V295", profile: "evSport", trims: ["EQE350+", "EQE53 AMG"] },
  { brand: "Mercedes-Benz", model: "EQS", gen: "V297", imgKey: "mercedes_eqs_v297", search: "Mercedes-Benz EQS V297", profile: "evSport", trims: ["EQS450+", "EQS580", "EQS53 AMG"] },
  { brand: "Mercedes-Benz", model: "SL", gen: "R232", imgKey: "mercedes_sl_r232", search: "Mercedes-Benz SL R232", profile: "roadster", trims: ["SL55 AMG", "SL63 AMG"] },

  // ── Audi ──
  { brand: "Audi", model: "A1", gen: "GB", imgKey: "audi_a1_gb", search: "Audi A1 GB", profile: "compactH", trims: ["30 TFSI", "35 TFSI S line"] },
  { brand: "Audi", model: "A3", gen: "8Y", imgKey: "audi_a3_8y", search: "Audi A3 8Y Sportback", profile: "compactH", trims: ["35 TFSI", "S3", "RS3"] },
  { brand: "Audi", model: "A4", gen: "B9", imgKey: "audi_a4_b10", search: "Audi A4 B9 facelift sedan", profile: "compactS", trims: ["40 TFSI", "45 TFSI quattro", "S4"] },
  { brand: "Audi", model: "A5", gen: "B10", imgKey: "audi_a5_b10", search: "Audi A5 B10", profile: "sportC", trims: ["A5 Sportback", "S5", "RS5"] },
  { brand: "Audi", model: "A6", gen: "C9", imgKey: "audi_a6_c9", search: "Audi A6 C9", profile: "midS", trims: ["A6", "A6 e-tron", "S6"] },
  { brand: "Audi", model: "A7", gen: "C8", imgKey: "audi_a7_c8", search: "Audi A7 Sportback C8", profile: "midS", trims: ["55 TFSI quattro", "S7", "RS7"] },
  { brand: "Audi", model: "A8", gen: "D5", imgKey: "audi_a8_d5", search: "Audi A8 D5", profile: "luxuryS", trims: ["A8 55 TFSI", "S8"] },
  { brand: "Audi", model: "Q2", gen: "GA", imgKey: "audi_q2_ga", search: "Audi Q2", profile: "suvS", trims: ["35 TFSI", "40 TFSI quattro"] },
  { brand: "Audi", model: "Q3", gen: "F3", imgKey: "audi_q3_f3", search: "Audi Q3 F3", profile: "suvS", trims: ["35 TFSI", "RS Q3"] },
  { brand: "Audi", model: "Q4 e-tron", gen: "F4", imgKey: "audi_q4_etron", search: "Audi Q4 e-tron", profile: "ev", trims: ["Q4 40 e-tron", "Q4 50 e-tron quattro", "SQ6 e-tron"] },
  { brand: "Audi", model: "Q5", gen: "FY", imgKey: "audi_q5_fy", search: "Audi Q5 FY", profile: "suvM", trims: ["40 TDI quattro", "SQ5", "Q5 Sportback"] },
  { brand: "Audi", model: "Q7", gen: "4M", imgKey: "audi_q7_4m", search: "Audi Q7 4M", profile: "suvL", trims: ["45 TFSI quattro", "SQ7", "Q7 e-tron"] },
  { brand: "Audi", model: "Q8", gen: "4M", imgKey: "audi_q8_4m", search: "Audi Q8", profile: "suvL", trims: ["55 TFSI quattro", "SQ8", "RS Q8"] },
  { brand: "Audi", model: "e-tron GT", gen: "FW", imgKey: "audi_etron_gt", search: "Audi e-tron GT", profile: "evSport", trims: ["e-tron GT", "RS e-tron GT"] },

  // ── Porsche ──
  { brand: "Porsche", model: "718 Cayman", gen: "982", imgKey: "porsche_718_cayman", search: "Porsche 718 Cayman", profile: "sportC", trims: ["Cayman", "GTS 4.0", "GT4 RS"] },
  { brand: "Porsche", model: "718 Boxster", gen: "982", imgKey: "porsche_718_boxster", search: "Porsche 718 Boxster", profile: "roadster", trims: ["Boxster", "GTS 4.0", "Spyder RS"] },
  { brand: "Porsche", model: "Panamera", gen: "971", imgKey: "porsche_panamera_971", search: "Porsche Panamera 971", profile: "luxuryS", trims: ["Panamera", "Turbo S E-Hybrid", "Panamera GTS"] },
  { brand: "Porsche", model: "Macan", gen: "95B", imgKey: "porsche_macan_95b", search: "Porsche Macan", profile: "suvM", trims: ["Macan", "Macan GTS", "Macan Turbo"] },
  { brand: "Porsche", model: "Macan Electric", gen: "Electric", imgKey: "porsche_macan_ev", search: "Porsche Macan Electric", profile: "ev", trims: ["Macan 4", "Macan Turbo"] },
  { brand: "Porsche", model: "Cayenne", gen: "E3", imgKey: "porsche_cayenne_e3", search: "Porsche Cayenne E3", profile: "suvL", trims: ["Cayenne", "Cayenne S E-Hybrid", "Cayenne Turbo GT"] },
  { brand: "Porsche", model: "Taycan", gen: "J1", imgKey: "porsche_taycan_j1", search: "Porsche Taycan", profile: "evSport", trims: ["Taycan", "Turbo S", "Turismo"] },

  // ── Toyota ──
  { brand: "Toyota", model: "Corolla", gen: "E210", imgKey: "toyota_corolla_e210", search: "Toyota Corolla E210", profile: "compactH", trims: ["1.8 Hybrid", "GR Sport", "Touring"] },
  { brand: "Toyota", model: "Camry", gen: "XV80", imgKey: "toyota_camry_xv80", search: "Toyota Camry XV80", profile: "midS", trims: ["LE", "XSE", "Hybrid"] },
  { brand: "Toyota", model: "RAV4", gen: "XA50", imgKey: "toyota_rav4_xa50", search: "Toyota RAV4 XA50", profile: "suvM", trims: ["LE", "XSE Hybrid", "Adventure"] },
  { brand: "Toyota", model: "Highlander", gen: "XU70", imgKey: "toyota_highlander_xu70", search: "Toyota Highlander XU70", profile: "suvL", trims: ["LE", "XLE", "Platinum Hybrid"] },
  { brand: "Toyota", model: "Land Cruiser", gen: "J300", imgKey: "toyota_landcruiser_j300", search: "Toyota Land Cruiser J300", profile: "suvL", trims: ["GX-R", "GR Sport", "VXR"] },
  { brand: "Toyota", model: "Prius", gen: "XW60", imgKey: "toyota_prius_xw60", search: "Toyota Prius XW60", profile: "compactH", trims: ["LE", "XLE", "Plug-in Hybrid"] },
  { brand: "Toyota", model: "bZ4X", gen: "EA10", imgKey: "toyota_bz4x", search: "Toyota bZ4X", profile: "ev", trims: ["FWD", "AWD"] },
  { brand: "Toyota", model: "GR86", gen: "ZN8", imgKey: "toyota_gr86", search: "Toyota GR86", profile: "sportC", trims: ["GR86", "Premium"] },
  { brand: "Toyota", model: "GR Corolla", gen: "E210", imgKey: "toyota_gr_corolla", search: "Toyota GR Corolla", profile: "compactH", trims: ["Core", "Circuit", "Morizo Edition"] },
  { brand: "Toyota", model: "Hilux", gen: "AN120", imgKey: "toyota_hilux_an120", search: "Toyota Hilux AN120", profile: "pickup", trims: ["SR", "SR5", "GR Sport"] },
  { brand: "Toyota", model: "Crown", gen: "S235", imgKey: "toyota_crown_s235", search: "Toyota Crown S235", profile: "luxuryS", trims: ["XLE", "Limited", "Platinum"] },
  { brand: "Toyota", model: "Yaris Cross", gen: "XP210", imgKey: "toyota_yaris_cross", search: "Toyota Yaris Cross", profile: "suvS", trims: ["Hybrid", "GR Sport"] },

  // ── Nissan ──
  { brand: "Nissan", model: "Altima", gen: "L34", imgKey: "nissan_altima_l34", search: "Nissan Altima L34", profile: "midS", trims: ["SV", "SR", "VC-Turbo"] },
  { brand: "Nissan", model: "Sentra", gen: "B18", imgKey: "nissan_sentra_b18", search: "Nissan Sentra B18", profile: "compactS", trims: ["S", "SR", "SV"] },
  { brand: "Nissan", model: "Maxima", gen: "A36", imgKey: "nissan_maxima_a36", search: "Nissan Maxima A36", profile: "midS", trims: ["SV", "Platinum"] },
  { brand: "Nissan", model: "Rogue", gen: "T33", imgKey: "nissan_rogue_t33", search: "Nissan Rogue T33", profile: "suvM", trims: ["S", "SV", "Platinum"] },
  { brand: "Nissan", model: "Pathfinder", gen: "R53", imgKey: "nissan_pathfinder_r53", search: "Nissan Pathfinder R53", profile: "suvL", trims: ["SV", "SL", "Platinum"] },
  { brand: "Nissan", model: "Armada", gen: "Y62", imgKey: "nissan_armada_y62", search: "Nissan Armada Y62", profile: "suvL", trims: ["SV", "SL", "Platinum"] },
  { brand: "Nissan", model: "Leaf", gen: "ZE1", imgKey: "nissan_leaf_ze1", search: "Nissan Leaf ZE1", profile: "ev", trims: ["S", "SV Plus"] },
  { brand: "Nissan", model: "Ariya", gen: "FE0", imgKey: "nissan_ariya", search: "Nissan Ariya", profile: "ev", trims: ["Engage", "Evolve+", "Platinum+"] },
  { brand: "Nissan", model: "Kicks", gen: "P15", imgKey: "nissan_kicks_p15", search: "Nissan Kicks P15", profile: "suvS", trims: ["S", "SR", "SV"] },
  { brand: "Nissan", model: "Murano", gen: "Z52", imgKey: "nissan_murano_z52", search: "Nissan Murano Z52", profile: "suvM", trims: ["SV", "SL", "Platinum"] },
  { brand: "Nissan", model: "Patrol", gen: "Y63", imgKey: "nissan_patrol_y63", search: "Nissan Patrol Y63", profile: "suvL", trims: ["SE", "Platinum", "Nismo"] },

  // ── Honda ──
  { brand: "Honda", model: "Accord", gen: "CV3", imgKey: "honda_accord_cv3", search: "Honda Accord CV3", profile: "midS", trims: ["LX", "Sport", "Hybrid Touring"] },
  { brand: "Honda", model: "CR-V", gen: "RS", imgKey: "honda_crv_rs", search: "Honda CR-V RS", profile: "suvM", trims: ["EX", "Sport", "Hybrid"] },
  { brand: "Honda", model: "HR-V", gen: "RV", imgKey: "honda_hrv_rv", search: "Honda HR-V RV", profile: "suvS", trims: ["LX", "Sport", "EX-L"] },
  { brand: "Honda", model: "Pilot", gen: "YE", imgKey: "honda_pilot_ye", search: "Honda Pilot YE", profile: "suvL", trims: ["Sport", "Touring", "Elite"] },
  { brand: "Honda", model: "Ridgeline", gen: "YK", imgKey: "honda_ridgeline_yk", search: "Honda Ridgeline pickup", profile: "pickup", trims: ["Sport", "RTL", "Black Edition"] },
  { brand: "Honda", model: "Integra", gen: "DE", imgKey: "honda_integra_de", search: "Honda Integra DE", profile: "compactS", trims: ["A-Spec", "Type S"] },
  { brand: "Honda", model: "Fit", gen: "GR", imgKey: "honda_fit_gr", search: "Honda Fit GR", profile: "compactH", trims: ["LX", "Sport", "RS"] },
  { brand: "Honda", model: "Prologue", gen: "EV", imgKey: "honda_prologue", search: "Honda Prologue EV", profile: "ev", trims: ["EX", "Touring"] },

  // ── Lexus ──
  { brand: "Lexus", model: "IS", gen: "XE30", imgKey: "lexus_is_xe30", search: "Lexus IS XE30", profile: "compactS", trims: ["IS300", "IS500 F Sport"] },
  { brand: "Lexus", model: "ES", gen: "XZ10", imgKey: "lexus_es_xz10", search: "Lexus ES XZ10", profile: "midS", trims: ["ES250", "ES350", "ES300h"] },
  { brand: "Lexus", model: "LS", gen: "XF50", imgKey: "lexus_ls_xf50", search: "Lexus LS XF50", profile: "luxuryS", trims: ["LS500", "LS500h", "LS600h"] },
  { brand: "Lexus", model: "UX", gen: "ZA10", imgKey: "lexus_ux_za10", search: "Lexus UX", profile: "suvS", trims: ["UX200", "UX250h", "UX300e"] },
  { brand: "Lexus", model: "NX", gen: "AZ20", imgKey: "lexus_nx_az20", search: "Lexus NX AZ20", profile: "suvM", trims: ["NX250", "NX350", "NX450h+"] },
  { brand: "Lexus", model: "RX", gen: "AL30", imgKey: "lexus_rx_al30", search: "Lexus RX AL30", profile: "suvL", trims: ["RX350", "RX500h F Sport", "RX450h+"] },
  { brand: "Lexus", model: "GX", gen: "J250", imgKey: "lexus_gx_j250", search: "Lexus GX J250", profile: "suvL", trims: ["Premium", "Overtrail", "Luxury+"] },
  { brand: "Lexus", model: "LX", gen: "J310", imgKey: "lexus_lx_j310", search: "Lexus LX J310", profile: "suvL", trims: ["LX600", "LX600 F Sport"] },
  { brand: "Lexus", model: "RC", gen: "ASC10", imgKey: "lexus_rc_asc10", search: "Lexus RC", profile: "sportC", trims: ["RC300", "RC F", "RC F Track Edition"] },
  { brand: "Lexus", model: "RZ", gen: "XE10", imgKey: "lexus_rz_xe10", search: "Lexus RZ 450e", profile: "ev", trims: ["RZ 300e", "RZ 450e"] },

  // ── Mazda ──
  { brand: "Mazda", model: "Mazda2", gen: "DJ", imgKey: "mazda_2_dj", search: "Mazda2 DJ", profile: "micro", trims: ["Pure", "Homura", "GT"] },
  { brand: "Mazda", model: "Mazda3", gen: "BP", imgKey: "mazda_3_bp", search: "Mazda3 BP", profile: "compactH", trims: ["G20", "G25 Astina", "X20"] },
  { brand: "Mazda", model: "Mazda6", gen: "GJ", imgKey: "mazda_6_gj", search: "Mazda6 GJ", profile: "midS", trims: ["Sport", "Touring", "Atenza"] },
  { brand: "Mazda", model: "CX-3", gen: "DK", imgKey: "mazda_cx3_dk", search: "Mazda CX-3", profile: "suvS", trims: ["Pure", "Evolve", "GT"] },
  { brand: "Mazda", model: "CX-30", gen: "DM", imgKey: "mazda_cx30_dm", search: "Mazda CX-30", profile: "suvS", trims: ["G20", "G25 Astina", "X20"] },
  { brand: "Mazda", model: "CX-5", gen: "KF", imgKey: "mazda_cx5_kf", search: "Mazda CX-5 KF", profile: "suvM", trims: ["Maxx Sport", "Touring", "Akera"] },
  { brand: "Mazda", model: "CX-50", gen: "KH", imgKey: "mazda_cx50_kh", search: "Mazda CX-50", profile: "suvM", trims: ["2.5 S", "Turbo Premium Plus", "Meridian Edition"] },
  { brand: "Mazda", model: "CX-60", gen: "KH", imgKey: "mazda_cx60", search: "Mazda CX-60", profile: "suvM", trims: ["PHEV", "D50e", "Takumi"] },
  { brand: "Mazda", model: "CX-90", gen: "KK", imgKey: "mazda_cx90", search: "Mazda CX-90", profile: "suvL", trims: ["3.3 Turbo", "PHEV Premium Plus"] },
  { brand: "Mazda", model: "MX-30", gen: "DR", imgKey: "mazda_mx30", search: "Mazda MX-30", profile: "ev", trims: ["EV", "R-EV"] },

  // ── Hyundai ──
  { brand: "Hyundai", model: "Elantra", gen: "CN7", imgKey: "hyundai_elantra_cn7", search: "Hyundai Elantra CN7", profile: "compactS", trims: ["SE", "N Line", "Limited"] },
  { brand: "Hyundai", model: "Sonata", gen: "DN8", imgKey: "hyundai_sonata_dn8", search: "Hyundai Sonata DN8", profile: "midS", trims: ["SE", "N Line", "Limited Hybrid"] },
  { brand: "Hyundai", model: "Tucson", gen: "NX4", imgKey: "hyundai_tucson_nx4", search: "Hyundai Tucson NX4", profile: "suvM", trims: ["SE", "N Line", "Hybrid Limited"] },
  { brand: "Hyundai", model: "Santa Fe", gen: "MX5", imgKey: "hyundai_santafe_mx5", search: "Hyundai Santa Fe MX5", profile: "suvL", trims: ["SE", "XRT", "Calligraphy Hybrid"] },
  { brand: "Hyundai", model: "Palisade", gen: "LX2", imgKey: "hyundai_palisade_lx2", search: "Hyundai Palisade LX2", profile: "suvL", trims: ["SE", "SEL", "Calligraphy"] },
  { brand: "Hyundai", model: "Kona", gen: "SX2", imgKey: "hyundai_kona_sx2", search: "Hyundai Kona SX2", profile: "suvS", trims: ["SE", "N Line", "Electric"] },
  { brand: "Hyundai", model: "Ioniq 6", gen: "CE", imgKey: "hyundai_ioniq6", search: "Hyundai Ioniq 6", profile: "evSport", trims: ["SE RWD", "SEL AWD", "N Line"] },
  { brand: "Hyundai", model: "Venue", gen: "QX", imgKey: "hyundai_venue_qx", search: "Hyundai Venue", profile: "suvS", trims: ["SE", "SEL", "Limited"] },

  // ── Kia ──
  { brand: "Kia", model: "Sportage", gen: "NQ5", imgKey: "kia_sportage_nq5", search: "Kia Sportage NQ5", profile: "suvM", trims: ["LX", "EX", "X-Line Hybrid"] },
  { brand: "Kia", model: "Sorento", gen: "MQ4", imgKey: "kia_sorento_mq4", search: "Kia Sorento MQ4", profile: "suvL", trims: ["LX", "EX", "SX Prestige Hybrid"] },
  { brand: "Kia", model: "Telluride", gen: "ON", imgKey: "kia_telluride_on", search: "Kia Telluride", profile: "suvL", trims: ["LX", "EX", "SX Prestige X-Pro"] },
  { brand: "Kia", model: "K5", gen: "DL3", imgKey: "kia_k5_dl3", search: "Kia K5 DL3", profile: "midS", trims: ["LXS", "GT-Line", "GT"] },
  { brand: "Kia", model: "Rio", gen: "YB", imgKey: "kia_rio_yb", search: "Kia Rio YB", profile: "compactH", trims: ["LX", "S", "GT-Line"] },
  { brand: "Kia", model: "Niro", gen: "SG2", imgKey: "kia_niro_sg2", search: "Kia Niro SG2", profile: "suvS", trims: ["EX", "EV Wind", "PHEV SX Touring"] },
  { brand: "Kia", model: "EV9", gen: "EV", imgKey: "kia_ev9", search: "Kia EV9", profile: "ev", trims: ["Light RWD", "Wind AWD", "GT-Line"] },
  { brand: "Kia", model: "Carnival", gen: "KA4", imgKey: "kia_carnival_ka4", search: "Kia Carnival KA4", profile: "suvL", trims: ["LX", "EX", "SX Prestige"] },
  { brand: "Kia", model: "Seltos", gen: "SP2", imgKey: "kia_seltos_sp2", search: "Kia Seltos SP2", profile: "suvS", trims: ["LX", "EX", "X-Line"] },

  // ── Ford ──
  { brand: "Ford", model: "F-150", gen: "P702", imgKey: "ford_f150_p702", search: "Ford F-150 P702", profile: "pickup", trims: ["XL", "XLT", "Raptor"] },
  { brand: "Ford", model: "Ranger", gen: "P703", imgKey: "ford_ranger_p703", search: "Ford Ranger P703", profile: "pickup", trims: ["XL", "XLT", "Raptor"] },
  { brand: "Ford", model: "Explorer", gen: "U625", imgKey: "ford_explorer_u625", search: "Ford Explorer U625", profile: "suvL", trims: ["XLT", "ST", "Platinum"] },
  { brand: "Ford", model: "Bronco", gen: "U725", imgKey: "ford_bronco_u725", search: "Ford Bronco U725", profile: "suvM", trims: ["Base", "Badlands", "Raptor"] },
  { brand: "Ford", model: "Escape", gen: "C520", imgKey: "ford_escape_c520", search: "Ford Escape C520", profile: "suvM", trims: ["SE", "ST-Line", "PHEV"] },
  { brand: "Ford", model: "Maverick", gen: "P758", imgKey: "ford_maverick_p758", search: "Ford Maverick P758", profile: "pickup", trims: ["XL", "XLT", "Lariat Hybrid"] },
  { brand: "Ford", model: "Focus", gen: "C519", imgKey: "ford_focus_st", search: "Ford Focus ST C519", profile: "compactH", trims: ["ST", "ST-Line"] },
  { brand: "Ford", model: "Puma", gen: "B515", imgKey: "ford_puma_b515", search: "Ford Puma crossover", profile: "suvS", trims: ["ST-Line", "ST", "Electric"] },

  // ── Chevrolet ──
  { brand: "Chevrolet", model: "Camaro", gen: "Alpha", imgKey: "chevrolet_camaro", search: "Chevrolet Camaro SS", profile: "muscle", trims: ["LT1", "SS", "ZL1"] },
  { brand: "Chevrolet", model: "Silverado", gen: "T1", imgKey: "chevrolet_silverado_t1", search: "Chevrolet Silverado 1500 2024", profile: "pickup", trims: ["LT", "RST", "ZR2"] },
  { brand: "Chevrolet", model: "Tahoe", gen: "T1", imgKey: "chevrolet_tahoe_t1", search: "Chevrolet Tahoe 2024", profile: "suvL", trims: ["LT", "RST", "High Country"] },
  { brand: "Chevrolet", model: "Suburban", gen: "T1", imgKey: "chevrolet_suburban_t1", search: "Chevrolet Suburban 2024", profile: "suvL", trims: ["LT", "Premier", "High Country"] },
  { brand: "Chevrolet", model: "Equinox", gen: "C1", imgKey: "chevrolet_equinox_c1", search: "Chevrolet Equinox 2024", profile: "suvM", trims: ["LT", "RS", "Activ"] },
  { brand: "Chevrolet", model: "Traverse", gen: "C1", imgKey: "chevrolet_traverse_c1", search: "Chevrolet Traverse 2024", profile: "suvL", trims: ["LT", "RS", "High Country"] },
  { brand: "Chevrolet", model: "Blazer EV", gen: "C1", imgKey: "chevrolet_blazer_ev", search: "Chevrolet Blazer EV", profile: "ev", trims: ["LT", "RS", "SS"] },
  { brand: "Chevrolet", model: "Corvette", gen: "C8", imgKey: "chevrolet_corvette_stingray", search: "Chevrolet Corvette C8 Stingray", profile: "supercar", trims: ["Stingray", "E-Ray", "Z06"] },

  // ── Dodge ──
  { brand: "Dodge", model: "Charger", gen: "LD", imgKey: "dodge_charger_ld", search: "Dodge Charger LD", profile: "muscle", trims: ["SXT", "R/T", "Scat Pack"] },
  { brand: "Dodge", model: "Durango", gen: "WD", imgKey: "dodge_durango_wd", search: "Dodge Durango WD", profile: "suvL", trims: ["GT", "R/T", "SRT Hellcat"] },
  { brand: "Dodge", model: "Hornet", gen: "GLH", imgKey: "dodge_hornet_glh", search: "Dodge Hornet GLH", profile: "suvS", trims: ["GT", "R/T", "PHEV"] },
  { brand: "Dodge", model: "Challenger", gen: "LA", imgKey: "dodge_challenger_sxt", search: "Dodge Challenger SXT", profile: "muscle", trims: ["SXT", "R/T", "Scat Pack"] },

  // ── Ferrari ──
  { brand: "Ferrari", model: "SF90", gen: "F173", imgKey: "ferrari_sf90", search: "Ferrari SF90 Stradale", profile: "supercar", trims: ["Stradale", "Spider", "XX"] },
  { brand: "Ferrari", model: "Roma", gen: "F169", imgKey: "ferrari_roma", search: "Ferrari Roma", profile: "supercar", trims: ["Roma", "Roma Spider"] },
  { brand: "Ferrari", model: "Portofino", gen: "F164", imgKey: "ferrari_portofino", search: "Ferrari Portofino M", profile: "roadster", trims: ["Portofino M"] },
  { brand: "Ferrari", model: "Purosangue", gen: "F175", imgKey: "ferrari_purosangue", search: "Ferrari Purosangue", profile: "suvL", trims: ["Purosangue"] },
  { brand: "Ferrari", model: "812", gen: "F152", imgKey: "ferrari_812", search: "Ferrari 812 Superfast", profile: "supercar", trims: ["Superfast", "GTS", "Competizione"] },

  // ── Lamborghini ──
  { brand: "Lamborghini", model: "Revuelto", gen: "LB744", imgKey: "lamborghini_revuelto", search: "Lamborghini Revuelto", profile: "supercar", trims: ["Revuelto"] },
  { brand: "Lamborghini", model: "Huracán", gen: "Sterrato", imgKey: "lamborghini_huracan_sterrato", search: "Lamborghini Huracan Sterrato", profile: "supercar", trims: ["EVO", "STO", "Sterrato"] },
  { brand: "Lamborghini", model: "Urus", gen: "Performante", imgKey: "lamborghini_urus_performante", search: "Lamborghini Urus Performante", profile: "suvL", trims: ["Urus S", "Urus SE", "Performante"] },

  // ── Maserati ──
  { brand: "Maserati", model: "Ghibli", gen: "M157", imgKey: "maserati_ghibli", search: "Maserati Ghibli M157", profile: "luxuryS", trims: ["GT", "Modena", "Trofeo"] },
  { brand: "Maserati", model: "Quattroporte", gen: "M156", imgKey: "maserati_quattroporte", search: "Maserati Quattroporte M156", profile: "luxuryS", trims: ["GT", "Modena", "Trofeo"] },
  { brand: "Maserati", model: "Levante", gen: "M161", imgKey: "maserati_levante", search: "Maserati Levante", profile: "suvL", trims: ["GT", "Modena", "Trofeo"] },
  { brand: "Maserati", model: "Grecale", gen: "M182", imgKey: "maserati_grecale", search: "Maserati Grecale", profile: "suvM", trims: ["GT", "Modena", "Trofeo Folgore"] },
  { brand: "Maserati", model: "GranTurismo", gen: "M189", imgKey: "maserati_granturismo", search: "Maserati GranTurismo M189", profile: "sportC", trims: ["Modena", "Trofeo", "Folgore"] },

  // ── McLaren ──
  { brand: "McLaren", model: "Artura", gen: "P28", imgKey: "mclaren_artura", search: "McLaren Artura", profile: "supercar", trims: ["Artura", "Artura Spider"] },
  { brand: "McLaren", model: "750S", gen: "P28", imgKey: "mclaren_750s", search: "McLaren 750S", profile: "supercar", trims: ["750S", "750S Spider"] },
  { brand: "McLaren", model: "GT", gen: "P28", imgKey: "mclaren_gt", search: "McLaren GT", profile: "supercar", trims: ["GT", "GTS"] },

  // ── Aston Martin ──
  { brand: "Aston Martin", model: "DB12", gen: "DB12", imgKey: "aston_db12", search: "Aston Martin DB12", profile: "sportC", trims: ["DB12", "DB12 Volante"] },
  { brand: "Aston Martin", model: "DBS", gen: "Superleggera", imgKey: "aston_dbs", search: "Aston Martin DBS Superleggera", profile: "supercar", trims: ["DBS", "DBS Volante"] },
  { brand: "Aston Martin", model: "DBX", gen: "707", imgKey: "aston_dbx707", search: "Aston Martin DBX707", profile: "suvL", trims: ["DBX", "DBX707"] },

  // ── Bentley ──
  { brand: "Bentley", model: "Continental GT", gen: "Third Gen", imgKey: "bentley_continental_gt", search: "Bentley Continental GT third generation", profile: "luxuryS", trims: ["GT V8", "GT Speed", "GTC Mulliner"] },
  { brand: "Bentley", model: "Flying Spur", gen: "Third Gen", imgKey: "bentley_flying_spur", search: "Bentley Flying Spur 2020", profile: "luxuryS", trims: ["Hybrid", "Speed", "Mulliner"] },
  { brand: "Bentley", model: "Bentayga", gen: "Facelift", imgKey: "bentley_bentayga", search: "Bentley Bentayga facelift", profile: "suvL", trims: ["V8", "Azure", "Speed"] },

  // ── Peugeot ──
  { brand: "Peugeot", model: "208", gen: "P21", imgKey: "peugeot_208_p21", search: "Peugeot 208 P21", profile: "compactH", trims: ["Active", "GT", "e-208"] },
  { brand: "Peugeot", model: "2008", gen: "P24", imgKey: "peugeot_2008_p24", search: "Peugeot 2008 P24", profile: "suvS", trims: ["Active", "GT", "e-2008"] },
  { brand: "Peugeot", model: "3008", gen: "P84", imgKey: "peugeot_3008_p84", search: "Peugeot 3008 P84", profile: "suvM", trims: ["Active", "GT", "Hybrid4"] },
  { brand: "Peugeot", model: "5008", gen: "P87", imgKey: "peugeot_5008_p87", search: "Peugeot 5008 II", profile: "suvL", trims: ["Active", "GT", "Hybrid"] },
  { brand: "Peugeot", model: "408", gen: "P54", imgKey: "peugeot_408_p54", search: "Peugeot 408 fastback", profile: "compactS", trims: ["Active", "GT", "Hybrid"] },

  // ── Renault ──
  { brand: "Renault", model: "Clio", gen: "V", imgKey: "renault_clio_v", search: "Renault Clio V", profile: "compactH", trims: ["Evolution", "Techno", "E-Tech Hybrid"] },
  { brand: "Renault", model: "Captur", gen: "II", imgKey: "renault_captur_ii", search: "Renault Captur II", profile: "suvS", trims: ["Evolution", "Techno", "E-Tech Hybrid"] },
  { brand: "Renault", model: "Arkana", gen: "I", imgKey: "renault_arkana", search: "Renault Arkana", profile: "suvS", trims: ["Evolution", "Techno", "E-Tech Hybrid"] },
  { brand: "Renault", model: "Austral", gen: "I", imgKey: "renault_austral", search: "Renault Austral", profile: "suvM", trims: ["Evolution", "Techno", "E-Tech Hybrid"] },
  { brand: "Renault", model: "Rafale", gen: "I", imgKey: "renault_rafale", search: "Renault Rafale", profile: "suvM", trims: ["Evolution", "Techno", "E-Tech Hybrid 4x4"] },
  { brand: "Renault", model: "Zoe", gen: "II", imgKey: "renault_zoe_ii", search: "Renault Zoe II", profile: "ev", trims: ["R110", "R135"] },

  // ── Volvo ──
  { brand: "Volvo", model: "XC40", gen: "CMA", imgKey: "volvo_xc40", search: "Volvo XC40", profile: "suvS", trims: ["B4", "Recharge", "EX40"] },
  { brand: "Volvo", model: "XC60", gen: "SPA", imgKey: "volvo_xc60", search: "Volvo XC60", profile: "suvM", trims: ["B5", "Recharge T8", "Polestar Engineered"] },
  { brand: "Volvo", model: "XC90", gen: "SPA", imgKey: "volvo_xc90", search: "Volvo XC90", profile: "suvL", trims: ["B5", "Recharge T8", "Excellence"] },
  { brand: "Volvo", model: "V60", gen: "SPA", imgKey: "volvo_v60", search: "Volvo V60", profile: "wagon", trims: ["B4", "Cross Country", "Recharge T8"] },
  { brand: "Volvo", model: "V90", gen: "SPA", imgKey: "volvo_v90", search: "Volvo V90 Cross Country", profile: "wagon", trims: ["B5", "Cross Country", "Recharge T8"] },
  { brand: "Volvo", model: "C40", gen: "CMA", imgKey: "volvo_c40", search: "Volvo C40 Recharge", profile: "ev", trims: ["Single Motor", "Twin Motor", "EC40"] },
  { brand: "Volvo", model: "EX30", gen: "SEA", imgKey: "volvo_ex30", search: "Volvo EX30", profile: "ev", trims: ["Core", "Ultra", "Cross Country"] },
  { brand: "Volvo", model: "EX90", gen: "SPA2", imgKey: "volvo_ex90", search: "Volvo EX90", profile: "ev", trims: ["Twin Motor", "Twin Motor Performance"] },
];

/**
 * @param {Set<string>} existingKeys
 */
export function buildGlobalExpansion(existingKeys) {
  const raw = expandLineups(LINEUPS, existingKeys, globalImageSearches);
  return buildBrandsFromRaw(raw, BRAND_META, existingKeys);
}

export const globalExpansionStats = {
  lineupModels: LINEUPS.length,
  estimatedTrims: LINEUPS.reduce((n, l) => n + l.trims.length, 0),
};

/** Image search queries for Wikimedia sync (independent of catalog dedup). */
export function getGlobalImageSearchRegistry() {
  /** @type {Record<string, { exterior: string, interior: string }>} */
  const registry = {};
  expandLineups(LINEUPS, new Set(), registry);
  return registry;
}
