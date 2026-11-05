import { AustralianWholesaler, WholesalerMetadata } from "./types";

export const ATO_ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19] as const;

export function validateAustralianBusinessNumber(abnRaw: string): boolean {
  const digits = abnRaw.replace(/\D/g, "");

  if (digits.length !== 11) {
    return false;
  }

  // Official ATO Modulus 89 algorithm
  // 1. Subtract 1 from the first digit
  const firstDigitAdjusted = parseInt(digits[0]!, 10) - 1;

  let sum = firstDigitAdjusted * ATO_ABN_WEIGHTS[0];

  // 2. Multiply each subsequent digit by its position weight
  for (let i = 1; i < 11; i++) {
    const digit = parseInt(digits[i]!, 10);
    sum += digit * ATO_ABN_WEIGHTS[i]!;
  }

  // 3. Divide by 89; valid if remainder is 0
  return sum % 89 === 0;
}

export const VERIFIED_AUSTRALIAN_WHOLESALERS: WholesalerMetadata[] = [
  {
    id: "REXEL_ELECTRICAL",
    name: "Rexel Holdings Australia Pty Ltd",
    abn: "51 824 753 556",
    headOffice: "Macquarie Park, NSW",
  },
  {
    id: "LAWRENCE_AND_HANSON",
    name: "L&H Group / Sonepar Australia",
    abn: "53 004 085 616",
    headOffice: "Southbank, VIC",
  },
  {
    id: "HAYMANS_ELECTRICAL",
    name: "Metal Manufacturers Ltd (Haymans)",
    abn: "33 102 417 032",
    headOffice: "Murarrie, QLD",
  },
  {
    id: "MIDDYS_ELECTRICAL",
    name: "Middendorp Electric Co Pty Ltd",
    abn: "18 004 405 689",
    headOffice: "Clayton, VIC",
  },
];
