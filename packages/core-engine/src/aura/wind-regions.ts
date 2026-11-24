import { AustralianState, PostcodeResolution, WindRegion } from "./types";

interface PostcodeRule {
  min: number;
  max: number;
  state: AustralianState;
  suburb: string;
  windRegion: WindRegion;
  leadTimeWeeks: number;
}

const POSTCODE_REGISTRY: PostcodeRule[] = [
  // Australian Capital Territory placed before NSW catch-all 2051-2999
  { min: 2600, max: 2618, state: "ACT", suburb: "Canberra Central", windRegion: "A", leadTimeWeeks: 3 },
  { min: 2900, max: 2920, state: "ACT", suburb: "Tuggeranong & Gungahlin", windRegion: "A", leadTimeWeeks: 3 },

  // New South Wales
  { min: 2000, max: 2050, state: "NSW", suburb: "Sydney CBD & Inner East", windRegion: "A", leadTimeWeeks: 3 },
  { min: 2088, max: 2090, state: "NSW", suburb: "Mosman & Neutral Bay", windRegion: "A", leadTimeWeeks: 3 },
  { min: 2095, max: 2107, state: "NSW", suburb: "Northern Beaches Coastal", windRegion: "B", leadTimeWeeks: 4 },
  { min: 2230, max: 2234, state: "NSW", suburb: "Cronulla & Sutherland", windRegion: "B", leadTimeWeeks: 3 },
  { min: 2051, max: 2999, state: "NSW", suburb: "Greater New South Wales", windRegion: "A", leadTimeWeeks: 4 },

  // Victoria
  { min: 3000, max: 3050, state: "VIC", suburb: "Melbourne Metro", windRegion: "A", leadTimeWeeks: 3 },
  { min: 3141, max: 3144, state: "VIC", suburb: "Toorak & Armadale", windRegion: "A", leadTimeWeeks: 3 },
  { min: 3186, max: 3195, state: "VIC", suburb: "Brighton & Bayside Coastal", windRegion: "B", leadTimeWeeks: 4 },
  { min: 3051, max: 3999, state: "VIC", suburb: "Regional Victoria", windRegion: "A", leadTimeWeeks: 4 },

  // Queensland
  { min: 4000, max: 4199, state: "QLD", suburb: "Brisbane Metro", windRegion: "B", leadTimeWeeks: 3 },
  { min: 4200, max: 4299, state: "QLD", suburb: "Gold Coast Coastal", windRegion: "B", leadTimeWeeks: 3 },
  { min: 4550, max: 4575, state: "QLD", suburb: "Sunshine Coast Coastal", windRegion: "B", leadTimeWeeks: 4 },
  { min: 4680, max: 4799, state: "QLD", suburb: "Central Queensland Coastal", windRegion: "C", leadTimeWeeks: 5 },
  { min: 4800, max: 4899, state: "QLD", suburb: "North Queensland Cyclonic", windRegion: "C", leadTimeWeeks: 6 },
  { min: 4300, max: 4999, state: "QLD", suburb: "Queensland Inland", windRegion: "B", leadTimeWeeks: 4 },

  // Western Australia
  { min: 6000, max: 6199, state: "WA", suburb: "Perth Metro", windRegion: "A", leadTimeWeeks: 4 },
  { min: 6200, max: 6599, state: "WA", suburb: "South West WA", windRegion: "B", leadTimeWeeks: 4 },
  { min: 6600, max: 6699, state: "WA", suburb: "Mid West Coastal", windRegion: "C", leadTimeWeeks: 6 },
  { min: 6700, max: 6799, state: "WA", suburb: "Pilbara Severe Cyclonic", windRegion: "D", leadTimeWeeks: 7 },
  { min: 6800, max: 6999, state: "WA", suburb: "Western Australia Regional", windRegion: "B", leadTimeWeeks: 5 },

  // South Australia
  { min: 5000, max: 5199, state: "SA", suburb: "Adelaide Metro", windRegion: "A", leadTimeWeeks: 3 },
  { min: 5200, max: 5799, state: "SA", suburb: "Regional South Australia", windRegion: "A", leadTimeWeeks: 4 },

  // Tasmania
  { min: 7000, max: 7499, state: "TAS", suburb: "Tasmania", windRegion: "A", leadTimeWeeks: 4 },
];

export function resolvePostcode(postcodeRaw: string): PostcodeResolution {
  const numericStr = postcodeRaw.trim().replace(/\D/g, "");
  const code = parseInt(numericStr, 10);

  if (isNaN(code) || numericStr.length !== 4) {
    return {
      postcode: postcodeRaw.trim() || "2000",
      suburb: "Sydney Metro (Default)",
      state: "NSW",
      windRegion: "A",
      regionDescription: "Region A: Normal Inland Wind Zone (AS/NZS 4505:2012)",
      leadTimeWeeks: 3,
    };
  }

  if (numericStr.startsWith("08") || numericStr.startsWith("09")) {
    return {
      postcode: numericStr,
      suburb: "Darwin Coastal Area",
      state: "NT",
      windRegion: "C",
      regionDescription: "Region C: Cyclonic Wind Zone (AS/NZS 4505:2012)",
      leadTimeWeeks: 6,
    };
  }

  for (const rule of POSTCODE_REGISTRY) {
    if (code >= rule.min && code <= rule.max) {
      const descriptions: Record<WindRegion, string> = {
        A: "Region A: Normal Temperate Wind Zone",
        B: "Region B: Intermediate Coastal Wind Zone",
        C: "Region C: Tropical Cyclonic Wind Zone",
        D: "Region D: Severe Cyclonic Wind Zone",
      };
      return {
        postcode: numericStr,
        suburb: rule.suburb,
        state: rule.state,
        windRegion: rule.windRegion,
        regionDescription: descriptions[rule.windRegion],
        leadTimeWeeks: rule.leadTimeWeeks,
      };
    }
  }

  const firstDigit = numericStr[0];
  const stateByDigit: Record<string, AustralianState> = {
    "2": "NSW",
    "3": "VIC",
    "4": "QLD",
    "5": "SA",
    "6": "WA",
    "7": "TAS",
  };
  const resolvedState: AustralianState = stateByDigit[firstDigit ?? ""] ?? "NSW";
  const defaultRegion: WindRegion = resolvedState === "QLD" ? "B" : "A";

  return {
    postcode: numericStr,
    suburb: `${resolvedState} Regional Area`,
    state: resolvedState,
    windRegion: defaultRegion,
    regionDescription: defaultRegion === "B" ? "Region B: Intermediate Coastal Wind Zone" : "Region A: Normal Wind Zone",
    leadTimeWeeks: 4,
  };
}
