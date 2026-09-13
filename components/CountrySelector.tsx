"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/lib/currencyContext";
import { CountryCode, COUNTRIES } from "@/lib/countryConfig";
import { ChevronDown, MapPin, Check } from "lucide-react";

interface CountrySelectorProps {
  variant?: "header" | "form";
  className?: string;
}

export default function CountrySelector({
  variant = "header",
  className = "",
}: CountrySelectorProps) {
  const { countryCode, country, setCountryCode } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countryKeys: CountryCode[] = ["NG", "GH", "KE", "GLOBAL"];

  if (variant === "form") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#17B4C9] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Select Delivery Country &amp; Currency</span>
          </label>
          <span className="text-[11px] text-[#9BA1AC] hidden sm:inline">
            Pricing updates automatically
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {countryKeys.map((code) => {
            const item = COUNTRIES[code];
            const isSelected = countryCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setCountryCode(code)}
                className={`px-3 py-2.5 text-xs font-display transition-all flex items-center justify-between border cursor-pointer teardrop-btn-static ${
                  isSelected
                    ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                    : "bg-[#101114] text-[#9BA1AC] border-[#F3F1EC]/20 hover:border-[#17B4C9]/50 hover:text-[#F3F1EC]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <div className="text-left leading-tight">
                    <div className="font-semibold uppercase tracking-wider">{item.name}</div>
                    <div
                      className={`text-[10px] font-mono ${
                        isSelected ? "text-[#101114]/80" : "text-[#17B4C9]"
                      }`}
                    >
                      {item.currencySymbol} ({item.currency})
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header Dropdown Variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-[#17191D] border border-[#F3F1EC]/20 hover:border-[#17B4C9] text-[#F3F1EC] px-2.5 sm:px-3 py-1.5 text-xs font-display uppercase tracking-wider transition-all cursor-pointer teardrop-btn-static shadow-sm"
        aria-label="Change country or currency"
      >
        <span className="text-sm">{country.flag}</span>
        <span className="font-bold">{country.currency}</span>
        <span className="text-[#9BA1AC] hidden sm:inline">({country.currencySymbol})</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9BA1AC] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#17B4C9]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 bg-[#17191D] border border-[#F3F1EC]/20 shadow-2xl z-50 py-1.5 teardrop-btn-static overflow-hidden backdrop-blur-md">
          <div className="px-3 py-1.5 border-b border-[#F3F1EC]/10 text-[10px] text-[#9BA1AC] uppercase tracking-wider font-mono">
            📍 Select Location &amp; Currency
          </div>
          {countryKeys.map((code) => {
            const item = COUNTRIES[code];
            const isSelected = countryCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setCountryCode(code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#17B4C9] text-[#101114] font-bold"
                    : "text-[#F3F1EC] hover:bg-[#101114] hover:text-[#17B4C9]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.flag}</span>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span
                      className={`text-[10px] ml-1.5 font-mono ${
                        isSelected ? "text-[#101114]/80" : "text-[#9BA1AC]"
                      }`}
                    >
                      {item.currencySymbol} ({item.currency})
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
