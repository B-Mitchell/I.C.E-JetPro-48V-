export type CurrencyCode = "NGN" | "GHS" | "KES";
export type CountryCode = "NG" | "GH" | "KE";

export interface CountryConfig {
  code: CountryCode;
  currency: CurrencyCode;
  currencySymbol: string;
  name: string;
  flag: string;
  phonePrefix: string;
  phonePlaceholder: string;
  regionLabel: string;
  regions: string[];
  singlePrice: number;
  singleOrig: number;
  doublePrice: number;
  doubleOrig: number;
  triplePrice: number;
  tripleOrig: number;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  NG: {
    code: "NG",
    currency: "NGN",
    currencySymbol: "₦",
    name: "Nigeria",
    flag: "🇳🇬",
    phonePrefix: "+234",
    phonePlaceholder: "0801 234 5678",
    regionLabel: "State",
    singlePrice: 45000,
    singleOrig: 65000,
    doublePrice: 85000,
    doubleOrig: 130000,
    triplePrice: 120000,
    tripleOrig: 195000,
    regions: [
      "Abia",
      "Abuja (FCT)",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
    ],
  },
  GH: {
    code: "GH",
    currency: "GHS",
    currencySymbol: "GH₵",
    name: "Ghana",
    flag: "🇬🇭",
    phonePrefix: "+233",
    phonePlaceholder: "024 123 4567",
    regionLabel: "Region",
    singlePrice: 400,
    singleOrig: 600,
    doublePrice: 750,
    doubleOrig: 1200,
    triplePrice: 1050,
    tripleOrig: 1800,
    regions: [
      "Greater Accra",
      "Ashanti",
      "Western",
      "Western North",
      "Central",
      "Eastern",
      "Volta",
      "Oti",
      "Northern",
      "Savannah",
      "North East",
      "Upper East",
      "Upper West",
      "Bono",
      "Bono East",
      "Ahafo",
    ],
  },
  KE: {
    code: "KE",
    currency: "KES",
    currencySymbol: "KSh",
    name: "Kenya",
    flag: "🇰🇪",
    phonePrefix: "+254",
    phonePlaceholder: "0712 345 678",
    regionLabel: "County",
    singlePrice: 3999,
    singleOrig: 6000,
    doublePrice: 7500,
    doubleOrig: 12000,
    triplePrice: 10500,
    tripleOrig: 18000,
    regions: [
      "Nairobi",
      "Mombasa",
      "Kiambu",
      "Nakuru",
      "Kisumu",
      "Machakos",
      "Uasin Gishu (Eldoret)",
      "Kajiado",
      "Kilifi",
      "Meru",
      "Nyeri",
      "Kakamega",
      "Kisii",
      "Murang'a",
      "Kericho",
      "Bungoma",
      "Trans Nzoia (Kitale)",
      "Embu",
      "Kitui",
      "Laikipia",
      "Kwale",
      "Bomet",
      "Homa Bay",
      "Migori",
      "Nandi",
      "Siaya",
      "Vihiga",
      "Other County",
    ],
  },
};

export function formatCountryPrice(amount: number, country: CountryConfig): string {
  return `${country.currencySymbol} ${amount.toLocaleString()}`;
}

export function detectUserCountry(): CountryCode {
  if (typeof window === "undefined") return "NG";

  // Detect via browser timezone (Pure client-side heuristic)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const lower = tz.toLowerCase();
      if (lower.includes("accra") || lower.includes("ghana")) return "GH";
      if (lower.includes("nairobi") || lower.includes("kenya")) return "KE";
    }
  } catch (e) {
    // ignore
  }

  // Default to Nigeria
  return "NG";
}
