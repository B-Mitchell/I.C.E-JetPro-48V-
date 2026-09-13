"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CountryCode,
  CountryConfig,
  COUNTRIES,
  detectUserCountry,
  formatCountryPrice,
} from "./countryConfig";

interface CurrencyContextType {
  countryCode: CountryCode;
  country: CountryConfig;
  setCountryCode: (code: CountryCode) => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  countryCode: "NG",
  country: COUNTRIES.NG,
  setCountryCode: () => {},
  formatPrice: (amount: number) => formatCountryPrice(amount, COUNTRIES.NG),
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<CountryCode>("NG");

  useEffect(() => {
    // 1. Check if URL specifies country param (e.g. ?country=gh or ?country=ke)
    if (typeof window !== "undefined") {
      // Clear legacy stale cache if any
      try {
        localStorage.removeItem("ice_user_country");
      } catch {}

      const urlParams = new URLSearchParams(window.location.search);
      const urlCountry = (urlParams.get("country") || urlParams.get("c"))?.toUpperCase() as CountryCode | undefined;

      if (urlCountry && COUNTRIES[urlCountry]) {
        setCountryCodeState(urlCountry);
        return;
      }
    }

    // 2. Client-side heuristic detection via Browser Timezone (Instant, zero latency, no stale cache)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lower = tz.toLowerCase();
      if (lower.includes("accra") || lower.includes("ghana")) {
        setCountryCodeState("GH");
      } else if (lower.includes("nairobi") || lower.includes("kenya")) {
        setCountryCodeState("KE");
      } else {
        // Defaults to Nigeria (NGN) for Lagos, West Africa, and general visitors
        setCountryCodeState("NG");
      }
    } catch {
      setCountryCodeState("NG");
    }
  }, []);

  const setCountryCode = (code: CountryCode) => {
    setCountryCodeState(code);
  };

  const currentCountry = COUNTRIES[countryCode] || COUNTRIES.NG;

  return (
    <CurrencyContext.Provider
      value={{
        countryCode,
        country: currentCountry,
        setCountryCode,
        formatPrice: (amount: number) => formatCountryPrice(amount, currentCountry),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
