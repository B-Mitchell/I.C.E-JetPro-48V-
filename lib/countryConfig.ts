export type CurrencyCode = "NGN" | "GHS" | "KES" | "USD";
export type CountryCode = "NG" | "GH" | "KE" | "GLOBAL";

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
    singlePrice: 85000,
    singleOrig: 110000,
    doublePrice: 160000,
    doubleOrig: 220000,
    triplePrice: 235000,
    tripleOrig: 330000,
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
    singlePrice: 1250,
    singleOrig: 1650,
    doublePrice: 2350,
    doubleOrig: 3300,
    triplePrice: 3450,
    tripleOrig: 4950,
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
    singlePrice: 11500,
    singleOrig: 15500,
    doublePrice: 21500,
    doubleOrig: 31000,
    triplePrice: 31500,
    tripleOrig: 46500,
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
  GLOBAL: {
    code: "GLOBAL",
    currency: "USD",
    currencySymbol: "$",
    name: "International",
    flag: "🌐",
    phonePrefix: "+1",
    phonePlaceholder: "Phone with country code",
    regionLabel: "State / Province",
    singlePrice: 89,
    singleOrig: 119,
    doublePrice: 169,
    doubleOrig: 238,
    triplePrice: 249,
    tripleOrig: 357,
    regions: [
      "North America",
      "Europe",
      "United Kingdom",
      "Middle East",
      "Asia / Pacific",
      "Africa (Other)",
      "South America",
      "Other",
    ],
  },
};

export function formatCountryPrice(amount: number, country: CountryConfig): string {
  if (country.currency === "USD") {
    return `$${amount}`;
  }
  return `${country.currencySymbol} ${amount.toLocaleString()}`;
}

export function detectUserCountry(): CountryCode {
  if (typeof window === "undefined") return "NG";

  // 1. Check if user already manually selected a country before
  const saved = localStorage.getItem("ice_user_country") as CountryCode | null;
  if (saved && COUNTRIES[saved]) {
    return saved;
  }

  // 2. Detect via browser timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const lower = tz.toLowerCase();
      if (lower.includes("accra") || lower.includes("ghana")) return "GH";
      if (lower.includes("nairobi") || lower.includes("kenya")) return "KE";
      if (lower.includes("lagos") || lower.includes("nigeria")) return "NG";
    }
  } catch (e) {
    // ignore
  }

  // Default to Nigeria for West African launch, or override via async IP check
  return "NG";
}
