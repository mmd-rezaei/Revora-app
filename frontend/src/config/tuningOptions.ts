import type { VehicleConfiguration } from "@/lib/tuning/types";

export const exteriorCategories = [
  { key: "bodyKit", label: "Body kit", options: ["Stock", "Sport Package", "M Performance", "Widebody"] },
  { key: "frontBumper", label: "Front bumper", options: ["Stock", "Aggressive Splitter", "Carbon Lip", "Sport Front"] },
  { key: "rearDiffuser", label: "Rear diffuser", options: ["Stock", "Carbon Diffuser", "Race Diffuser"] },
  { key: "spoiler", label: "Spoiler / wing", options: ["None", "Trunk Lip", "GT Wing", "Active Spoiler"] },
  { key: "hood", label: "Hood", options: ["Stock", "Carbon Hood", "Vented Hood"] },
  { key: "sideSkirts", label: "Side skirts", options: ["Stock", "Sport Skirts", "Carbon Skirts"] },
  { key: "mirrors", label: "Mirrors", options: ["Body Color", "Carbon", "Gloss Black"] },
  { key: "grille", label: "Grille", options: ["Stock", "Blackout", "Carbon Mesh"] },
  { key: "exhaustTips", label: "Exhaust tips", options: ["Stock", "Chrome Quad", "Black Quad", "Titanium"] },
  { key: "headlights", label: "Headlights", options: ["OEM", "LED Upgrade", "Laser"] },
  { key: "taillights", label: "Taillights", options: ["OEM", "Smoked", "Sequential LED"] },
] as const;

export const wheelStudioOptions = {
  design: ["Stock", "BBS FI-R", "HRE P101", "Vossen HF-5", "Rotiform LAS-R", "Forged Monoblock"],
  size: ['18"', '19"', '20"', '21"', '22"'],
  width: ["8.0J", "8.5J", "9.0J", "9.5J", "10.0J"],
  offset: ["ET35", "ET40", "ET45", "ET50"],
  finish: ["Silver", "Gunmetal", "Gloss Black", "Bronze", "Diamond Cut"],
  tireType: ["All-Season", "Performance Summer", "Track Semi-Slick", "Drag Radial"],
  caliperColor: ["Red", "Yellow", "Blue", "Black", "Gold"],
  brakePackage: ["Standard", "Sport", "Big Brake Kit", "Carbon Ceramic"],
} as const;

export const interiorCategories = [
  { key: "seats", label: "Seats", options: ["OEM", "Sport", "Bucket", "Racing Harness"] },
  { key: "seatMaterial", label: "Seat material", options: ["Leather", "Alcantara", "Leather/Alcantara"] },
  { key: "steeringWheel", label: "Steering wheel", options: ["OEM", "Sport", "Carbon", "Flat-bottom"] },
  { key: "dashboard", label: "Dashboard", options: ["OEM", "Carbon", "Alcantara"] },
  { key: "trim", label: "Trim", options: ["Aluminum", "Carbon Fiber", "Open Pore Wood", "Piano Black"] },
  { key: "headliner", label: "Headliner", options: ["Standard", "Alcantara", "Carbon"] },
  { key: "seatBelts", label: "Seat belts", options: ["Standard", "Racing Red", "Yellow", "Blue"] },
  { key: "floorMats", label: "Floor mats", options: ["Standard", "All-Weather", "Carbon Logo"] },
  { key: "ambientLighting", label: "Ambient lighting", options: ["Off", "White", "Red", "Blue", "Multi-Color"] },
  { key: "color", label: "Interior color", options: ["Black", "Cognac", "Red/Black", "All White", "Navy Blue"] },
] as const;

export const vehicleConfigurationOptions: Record<keyof VehicleConfiguration, string[]> = {
  aspiration: ["Naturally Aspirated", "Turbocharged", "Supercharged", "Hybrid"],
  transmission: ["Automatic", "Manual", "DCT", "Sequential"],
  drivetrain: ["FWD", "RWD", "AWD"],
  suspension: ["Comfort", "Sport", "Track"],
  brakes: ["Standard", "Sport", "Carbon Ceramic"],
};

export const defaultVehicleConfig: VehicleConfiguration = {
  aspiration: "Naturally Aspirated",
  transmission: "Automatic",
  drivetrain: "RWD",
  suspension: "Sport",
  brakes: "Standard",
};

export const performanceCategoryLabels: Record<string, string> = {
  ecu: "ECU / Software",
  intake: "Intake",
  exhaust: "Exhaust",
  downpipe: "Downpipe",
  intercooler: "Intercooler",
  turbo: "Turbo",
  supercharger: "Supercharger",
  cooling: "Cooling",
  fuel: "Fuel System",
  drivetrain: "Drivetrain",
  suspension: "Suspension",
  brakes: "Brakes",
  wheels: "Wheels",
  tires: "Tires",
};
