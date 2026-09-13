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
    // 1. Initial detection via localStorage or Timezone
    const initial = detectUserCountry();
    setCountryCodeState(initial);

    // 2. If no explicit localStorage saved, perform a non-blocking background IP check
    const saved = localStorage.getItem("ice_user_country");
    if (!saved) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      fetch("https://ipapi.co/json/", { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          if (data && data.country_code) {
            const cc = data.country_code.toUpperCase();
            if (cc === "GH") setCountryCodeState("GH");
            else if (cc === "KE") setCountryCodeState("KE");
            else if (cc === "NG") setCountryCodeState("NG");
            else if (cc !== "NG" && initial === "NG") {
              // Outside NG/GH/KE, switch to global USD
              setCountryCodeState("GLOBAL");
            }
          }
        })
        .catch(() => {
          // Gracefully fallback to initial timezone-detected country
        });

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const setCountryCode = (code: CountryCode) => {
    setCountryCodeState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("ice_user_country", code);
    }
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
