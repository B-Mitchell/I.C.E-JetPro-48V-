"use client";

import React, { useState } from "react";
import Image from "next/image";
import OrderForm from "@/components/OrderForm";
import CountrySelector from "@/components/CountrySelector";
import { CurrencyProvider, useCurrency } from "@/lib/currencyContext";
import {
  Zap,
  Battery,
  Droplets,
  Package,
  ShieldCheck,
  Wrench,
  ChevronDown,
  Check,
  X,
  Gauge,
  ShoppingCart,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  Menu,
  Sprout,
  Play,
  HelpCircle,
} from "lucide-react";

// Image Paths located in /public/images
const HERO_IMG = "/images/hero.jpg";
const FLATLAY_IMG = "/images/flatlay.jpg";
const CASE_STUDIO_IMG = "/images/case.jpg";
const CASE_REAL_IMG = "/images/case_closed_real.png";
const ACTION_CAR_WASH_IMG = "/images/action_snow_foam_black.jpg";
const ACTION_PATIO_BLAST_IMG = "/images/action_bucket_wash_v2.jpg";
const ACTION_FARM_SPRAY_IMG = "/images/action_farm_crop_v2.jpg";
const ACTION_COMPOUND_BLAST_IMG = "/images/action_compound_paver_v2.jpg";
const ACTION_AC_CLEAN_IMG = "/images/action_ac_clean.jpg";
const BATTERY_SWAP_IMG = "/images/battery_swap.jpg";
const GUN_STUDIO_TEAL = "/images/gun_studio_black.jpg";
const SPRAY_MODES_DEMO = "/images/spray_modes_black.jpg";
const BRASS_QUICK_CONNECT = "/images/brass_quick_connect.jpg";
const BATTERY_DETACHABLE_TEAL = "/images/battery_detachable_teal.jpg";

interface ContentsItem {
  id: number;
  label: string;
  desc: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

const CONTENTS: ContentsItem[] = [
  {
    id: 1,
    label: "2× 48V Lithium-Ion Batteries",
    desc: "Dual high-capacity 48V lithium battery packs. Swap packs mid-job so you never pause for a recharge.",
    x: 80,
    y: 48,
  },
  {
    id: 2,
    label: "Quick-connect brass fittings & inlet filter",
    desc: "Fine-mesh self-priming filter drops into any bucket, drum, or river. Also connects directly to outdoor taps.",
    x: 23,
    y: 48,
  },
  {
    id: 3,
    label: "8m heavy-duty suction draw hose",
    desc: "Extended 8-meter length lets you maneuver freely around trucks, compound perimeters, and agricultural beds.",
    x: 50,
    y: 23,
  },
  {
    id: 4,
    label: "Soap can / Foam cannon bottle",
    desc: "Thick clinging suds for cars and bikes, or mixing liquid fertilizers & pest control chemicals on the farm.",
    x: 43,
    y: 75,
  },
  {
    id: 5,
    label: "48V High-Torque Power Gun Body",
    desc: "Pure copper core pump motor, ergonomic anti-fatigue grip, and dual safety trigger switch.",
    x: 51,
    y: 53,
  },
  {
    id: 6,
    label: "2× Interchangeable Spray Nozzles",
    desc: "Includes 0° high-pressure red blast nozzle (for dried mud/grime) and 40° white fan nozzle (for car washing & crop misting).",
    x: 28,
    y: 68,
  },
  {
    id: 7,
    label: "Rapid wall battery charger",
    desc: "Smart charger with auto cut-off protection. Quickly powers up one pack while the other is in use.",
    x: 74,
    y: 72,
  },
];

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Can farmers use this for spraying crops and pest control?",
    a: "Yes! Farmers across Nigeria, Ghana, and Kenya actively use the I.C.E JetPro 48V to spray crops, vegetables, cassava, and fruit orchards. It atomizes liquid fertilizers, pesticides, and insect repellents with steady cordless pressure. Simply drop the 8m suction line into a chemical bucket or drum — completely eliminating painful, exhausting knapsack backpack manual pumping.",
  },
  {
    q: "How long does one battery last and how fast does it charge?",
    a: "Each 48V pack provides 35 to 45 minutes of continuous high-pressure performance. Because the kit includes two (2×) 48V batteries plus a rapid wall charger, one battery can charge while the other is in use so you never experience downtime.",
  },
  {
    q: "Does it need running tap water, or can it draw from a bucket?",
    a: "It does NOT require running tap water! The 8m heavy-duty hose includes a self-priming fine-mesh suction filter. You can drop it into any bucket, jerrycan, water drum, overhead tank, or stream. It also connects directly to standard outdoor garden taps.",
  },
  {
    q: "What is actually included inside the case?",
    a: "The complete kit includes: 48V cordless power gun body, two (2×) 48V lithium-ion batteries, rapid wall charger, 8-meter suction hose with filter basket, two interchangeable spray nozzles (0° blast & 40° fan), soap can foam bottle, brass quick-connect fittings, and the custom-molded impact carry case.",
  },
  {
    q: "Is it strong enough for deep cleaning, not just light rinsing?",
    a: "Yes! Unlike flimsy garden hose attachments, the I.C.E JetPro 48V is driven by a pure copper 48V motor and high-torque pump that generates intense velocity to blast caked mud, tire grime, compound moss, and AC condenser fins.",
  },
  {
    q: "What should I do if the motor runs but doesn't pull water after storage?",
    a: "Do not worry — your machine has NOT gone bad! Over time or when stored away dry, the internal pump cylinder experiences natural dryness and simply loses its vacuum seal. To fix this in 30 seconds: pour a small splash of clean water directly into the intake nozzle to lubricate the internal silicone valve (as demonstrated in our troubleshooting video below). Re-attach your hose, turn it on, and the pump will instantly self-prime and fire at full high pressure.",
  },
];

function LandingPageContent() {
  const { country, formatPrice } = useCurrency();
  const [heroView, setHeroView] = useState<"gun" | "case">("gun");
  const [activeCallout, setActiveCallout] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [caseViewMode, setCaseViewMode] = useState<"studio" | "real">("real");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#101114] text-[#F3F1EC] pb-20 md:pb-0">
      {/* ADD TO CART TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 bg-[#17191D] border border-[#17B4C9] text-[#F3F1EC] px-4 sm:px-5 py-3.5 shadow-2xl shadow-[#17B4C9]/20 transition-all animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#17B4C9] shrink-0" />
          <div>
            <p className="text-sm font-semibold font-display tracking-wider">
              ADDED TO CART ({quantity}x KIT)
            </p>
            <p className="text-xs text-[#9BA1AC]">
              Total: {formatPrice(country.singlePrice * quantity)} • Free shipping included
            </p>
          </div>
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#101114]/95 backdrop-blur-md border-b border-[#F3F1EC]/10">
        <div className="max-w-[1152px] mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-1.5">
              <span>I.C.E</span>
              <span className="text-[#17B4C9]">JETPRO</span>
              <span className="text-[10px] sm:text-xs uppercase px-1.5 py-0.5 bg-[#17B4C9]/20 text-[#17B4C9] border border-[#17B4C9]/40 font-mono tracking-normal">
                48V™
              </span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-[#9BA1AC]">
            <a href="#contents" className="hover:text-[#F3F1EC] transition-colors">
              In The Case
            </a>
            <a href="#spray-modes" className="hover:text-[#F3F1EC] transition-colors">
              Spray Modes
            </a>
            <a href="#action" className="hover:text-[#F3F1EC] transition-colors">
              In Action
            </a>
            <a href="#videos" className="hover:text-[#F3F1EC] transition-colors flex items-center gap-1.5 text-[#17B4C9]">
              <Play className="w-3.5 h-3.5 fill-[#17B4C9]" />
              <span>Live Videos</span>
            </a>
            <a href="#features" className="hover:text-[#F3F1EC] transition-colors">
              Features
            </a>
            <a href="#compare" className="hover:text-[#F3F1EC] transition-colors">
              Comparison
            </a>
            <a href="#faq" className="hover:text-[#F3F1EC] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Country Location Switcher */}
            <CountrySelector variant="header" />

            <a
              href="#buy"
              className="text-xs sm:text-sm font-medium tracking-wider uppercase bg-[#17B4C9] text-[#101114] hover:bg-[#F3F1EC] px-4 sm:px-5 py-1.5 sm:py-2 transition-all font-display font-bold shadow-sm shadow-[#17B4C9]/30 teardrop-btn inline-flex items-center gap-1.5"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {cartCount > 0 && (
              <a
                href="#buy"
                className="flex items-center gap-1.5 bg-[#17B4C9] text-[#101114] font-display font-semibold text-xs px-2.5 py-1.5 teardrop-btn"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{cartCount}</span>
              </a>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F3F1EC] hover:text-[#17B4C9] border border-[#F3F1EC]/20 hover:border-[#17B4C9] transition-colors cursor-pointer bg-[#17191D]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#17191D] border-b border-[#F3F1EC]/15 px-5 py-5 space-y-4 shadow-2xl">
            <div className="flex flex-col space-y-2 font-display uppercase tracking-wider text-base text-[#F3F1EC]">
              <a
                href="#contents"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>What's In The Case</span>
                <span className="text-xs text-[#17B4C9] font-mono">01</span>
              </a>
              <a
                href="#spray-modes"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>3 Spray Modes</span>
                <span className="text-xs text-[#17B4C9] font-mono">02</span>
              </a>
              <a
                href="#action"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>Performance In Action</span>
                <span className="text-xs text-[#17B4C9] font-mono">03</span>
              </a>
              <a
                href="#videos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>Live Videos &amp; Troubleshoot</span>
                <span className="text-xs text-[#17B4C9] font-mono">04</span>
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>Key Features</span>
                <span className="text-xs text-[#17B4C9] font-mono">05</span>
              </a>
              <a
                href="#compare"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>Cordless vs Corded</span>
                <span className="text-xs text-[#17B4C9] font-mono">06</span>
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 hover:bg-[#101114] hover:text-[#17B4C9] transition-colors border-b border-[#F3F1EC]/5 flex items-center justify-between"
              >
                <span>FAQ</span>
                <span className="text-xs text-[#17B4C9] font-mono">07</span>
              </a>
            </div>

            <div className="pt-2 space-y-3">
              <CountrySelector variant="form" />

              <a
                href="#buy"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full font-display bg-[#17B4C9] text-[#101114] font-bold text-center py-3.5 uppercase tracking-wider block shadow-lg shadow-[#17B4C9]/20 teardrop-btn flex items-center justify-center gap-2"
              >
                <span>Get The Kit — Pay On Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="max-w-[1152px] mx-auto px-4 sm:px-6 pt-6 pb-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#17B4C9] mb-4 bg-[#17191D] px-3 py-1 border border-[#17B4C9]/30">
            <span className="w-2 h-2 rounded-full bg-[#17B4C9] animate-ping" />
            I.C.E JETPRO 48V™ CORDLESS POWER WASHER
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-[64px] font-bold leading-[1.08] mb-5 sm:mb-6">
            Full pressure.
            <br />
            No plug in sight.
          </h1>
          <p className="text-[#9BA1AC] text-base sm:text-lg leading-relaxed max-w-md mb-6 sm:mb-8">
            Point it at your car, the driveway, compound pavers, or farm crops — the 48V battery does the
            work a generator and wall outlet used to. Two packs included, so you finish before either
            one runs dry.
          </p>

          {/* PRICE SLASH BANNER */}
          <div className="flex items-center gap-3 flex-wrap mb-4 bg-[#17191D] p-3 border border-[#F3F1EC]/10 inline-flex max-w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base line-through text-[#E23E2E] font-mono decoration-2">
                {formatPrice(country.singleOrig)}
              </span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC]">
                {formatPrice(country.singlePrice)}
              </span>
            </div>
            <span className="bg-[#E23E2E]/20 text-[#E23E2E] border border-[#E23E2E]/40 text-[11px] font-display uppercase font-bold px-2.5 py-1 tracking-wider">
              Flash Price Slashed
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-6 sm:mb-8">
            <a
              href="#buy"
              className="w-full sm:w-auto font-display bg-[#17B4C9] text-[#101114] font-bold text-base sm:text-lg px-8 sm:px-10 py-4 uppercase tracking-wide hover:bg-[#F3F1EC] transition-all inline-flex items-center justify-center gap-2.5 shadow-xl shadow-[#17B4C9]/25 teardrop-btn group"
            >
              <span>Claim Slashed Offer — {formatPrice(country.singlePrice)}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="text-xs sm:text-sm text-[#9BA1AC] text-center sm:text-left w-full sm:w-auto">
              Full kit &bull; Ships in reinforced carry case &bull; Free delivery to {country.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 border-t border-[#F3F1EC]/10 text-[11px] sm:text-xs text-[#9BA1AC]">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#17B4C9] shrink-0" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#17B4C9] shrink-0" />
              <span>2-Yr Warranty</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#17B4C9] shrink-0" />
              <span>30-Day Return</span>
            </div>
          </div>
        </div>

        <div className="relative mt-2 md:mt-0">
          {/* Hero Visual Switcher Tabs */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setHeroView("gun")}
              className={`text-xs font-display uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer teardrop-btn-static ${heroView === "gun"
                  ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                  : "bg-[#17191D] text-[#9BA1AC] border-[#F3F1EC]/20 hover:text-[#F3F1EC]"
                }`}
            >
              Assembled Gun
            </button>
            <button
              onClick={() => setHeroView("case")}
              className={`text-xs font-display uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer teardrop-btn-static ${heroView === "case"
                  ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                  : "bg-[#17191D] text-[#9BA1AC] border-[#F3F1EC]/20 hover:text-[#F3F1EC]"
                }`}
            >
              Complete Kit In Case
            </button>
          </div>

          <div className="clip-polygon overflow-hidden border border-[#F3F1EC]/10 bg-[#17191D] relative group">
            <Image
              src={heroView === "gun" ? GUN_STUDIO_TEAL : HERO_IMG}
              alt={heroView === "gun" ? "I.C.E JetPro 48V teal cordless pressure washer gun with metal lance and foam cannon" : "48V cordless cleaning gun kit, open case"}
              width={700}
              height={520}
              priority
              className={`w-full h-[320px] sm:h-[420px] md:h-[480px] group-hover:scale-105 transition-transform duration-500 ${heroView === "gun" ? "object-contain p-4 bg-[#14161B]" : "object-cover"}`}
            />
            <div className="absolute top-3 right-3 text-[10px] text-[#9BA1AC] uppercase font-mono bg-[#101114]/85 px-2 py-1 border border-[#F3F1EC]/10">
              {heroView === "gun" ? "Studio Spec Profile" : "Unboxed Actual Kit"}
            </div>
          </div>
          <div className="absolute -bottom-3 left-2 sm:-bottom-4 sm:-left-4 bg-[#E23E2E] text-[#F3F1EC] font-display font-semibold text-xs sm:text-sm tracking-wider uppercase px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl">
            2 batteries included
          </div>
        </div>
      </section>

      {/* SPEC RIBBON */}
      <section className="border-y border-[#F3F1EC]/10 bg-[#17191D]">
        <div className="max-w-[1152px] mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-baseline gap-2 justify-start md:justify-center">
            <span className="font-display text-3xl font-bold text-[#17B4C9]">48V</span>
            <span className="text-sm text-[#9BA1AC]">motor voltage</span>
          </div>
          <div className="flex items-baseline gap-2 justify-start md:justify-center">
            <span className="font-display text-3xl font-bold text-[#17B4C9]">2×</span>
            <span className="text-sm text-[#9BA1AC]">lithium-ion packs</span>
          </div>
          <div className="flex items-baseline gap-2 justify-start md:justify-center">
            <span className="font-display text-3xl font-bold text-[#17B4C9]">8m</span>
            <span className="text-sm text-[#9BA1AC]">draw hose</span>
          </div>
          <div className="flex items-baseline gap-2 justify-start md:justify-center">
            <span className="font-display text-3xl font-bold text-[#17B4C9]">1</span>
            <span className="text-sm text-[#9BA1AC]">molded carry case</span>
          </div>
        </div>
      </section>

      {/* 3 QUICK-SWITCH SPRAY MODES SECTION */}
      <section id="spray-modes" className="max-w-[1152px] mx-auto px-4 sm:px-6 py-16 sm:py-20 border-b border-[#F3F1EC]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#17B4C9] mb-2 bg-[#17191D] px-3 py-1 border border-[#17B4C9]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interchangeable Quick-Connect Nozzles</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              3 Precision Spray Modes
            </h2>
          </div>
          <p className="text-[#9BA1AC] max-w-md text-sm leading-relaxed">
            Switch from rich snow foam auto shampoo to a laser-focused mud blaster or a gentle crop mist in 2 seconds — completely tool-free with solid brass couplings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual: 3 Modes Demonstration */}
          <div className="lg:col-span-7 bg-[#17191D] border border-[#F3F1EC]/10 p-2 overflow-hidden group">
            <div className="relative overflow-hidden bg-white">
              <Image
                src={SPRAY_MODES_DEMO}
                alt="Three interchangeable spray modes: 40 degree fan spray, 0 degree pinpoint jet, and snow foam cannon"
                width={700}
                height={700}
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#101114]/90 backdrop-blur-sm border border-[#17B4C9]/40 text-[#17B4C9] text-xs font-display font-bold px-3 py-1 uppercase">
                High-Speed Studio Demonstration
              </div>
            </div>
          </div>

          {/* Mode Breakdown Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mode 1: 40° Fan Spray */}
            <div className="p-5 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#17B4C9] uppercase tracking-wider">
                  MODE 01 &bull; 40&deg; FAN SPRAY
                </span>
                <span className="text-[11px] bg-white/10 text-[#F3F1EC] px-2 py-0.5 font-display uppercase font-semibold">
                  White Nozzle
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3F1EC] mb-1.5">
                Wide Rinsing &amp; Agricultural Crop Mist
              </h3>
              <p className="text-xs sm:text-sm text-[#9BA1AC] leading-relaxed">
                Even fan pattern creates wide coverage to swiftly rinse vehicle soap, wash down glass windows, or gently mist farmlands with liquid fertilizer without damaging fragile seedling leaves.
              </p>
            </div>

            {/* Mode 2: 0° Pinpoint Laser Jet */}
            <div className="p-5 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#E23E2E]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#E23E2E] uppercase tracking-wider">
                  MODE 02 &bull; 0&deg; PINPOINT JET
                </span>
                <span className="text-[11px] bg-[#E23E2E]/20 text-[#E23E2E] border border-[#E23E2E]/40 px-2 py-0.5 font-display uppercase font-semibold">
                  Red Blast Nozzle
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3F1EC] mb-1.5">
                Intense Concentrated Grime &amp; Moss Blasting
              </h3>
              <p className="text-xs sm:text-sm text-[#9BA1AC] leading-relaxed">
                Ultra-concentrated straight stream focuses the full 48V velocity into a surgical pinpoint to blast caked dried mud from tire rims, green algae on compound pavers, and stubborn grease.
              </p>
            </div>

            {/* Mode 3: Snow Foam Cannon */}
            <div className="p-5 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#17B4C9] uppercase tracking-wider">
                  MODE 03 &bull; SNOW FOAM CANNON
                </span>
                <span className="text-[11px] bg-[#17B4C9]/20 text-[#17B4C9] border border-[#17B4C9]/40 px-2 py-0.5 font-display uppercase font-semibold">
                  Soap Can Bottle
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3F1EC] mb-1.5">
                Clinging Suds Pre-Wash &amp; Chemical Sprayer
              </h3>
              <p className="text-xs sm:text-sm text-[#9BA1AC] leading-relaxed">
                Clicks directly onto the lance to atomize liquid car wash shampoo into a dense clinging foam blanket that dissolves grit before wiping, or dispenses liquid insect repellents on farm crops.
              </p>
            </div>

            {/* Brass Quick Connect Feature Box */}
            <div className="p-4 bg-[#101114] border border-[#17B4C9]/30 flex items-center gap-4">
              <div className="w-16 h-16 shrink-0 overflow-hidden border border-[#F3F1EC]/10 relative bg-white">
                <Image
                  src={BRASS_QUICK_CONNECT}
                  alt="Solid brass quick connect collar mechanism"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-display font-bold uppercase text-[#17B4C9] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solid Brass Quick-Coupling</span>
                </div>
                <p className="text-xs text-[#9BA1AC] mt-0.5">
                  Pull back the knurled collar, snap in any nozzle, release to lock. 100% leak-proof, zero tools required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL-WORLD ACTION SHOWCASE */}
      <section id="action" className="max-w-[1152px] mx-auto px-6 py-20 border-b border-[#F3F1EC]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-2">
              One Tool &bull; Endless Applications
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Far more than just a car washer
            </h2>
          </div>
          <p className="text-[#9BA1AC] max-w-md text-sm leading-relaxed">
            From spraying agricultural farmlands and blasting compound tiles to servicing air conditioning units and washing vehicles — the cordless 48V pump handles it all without cords or generators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Action Card 1: Farm Crop & Pest Spraying */}
          <div className="group border border-[#F3F1EC]/10 bg-[#17191D] overflow-hidden">
            <div className="relative overflow-hidden aspect-[16/9]">
              <Image
                src={ACTION_FARM_SPRAY_IMG}
                alt="African farmer using 48V power spray gun to spray crops and vegetable beds in the field"
                width={700}
                height={394}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#101114]/90 backdrop-blur-sm border border-emerald-500/40 text-emerald-400 text-xs font-display font-semibold px-2.5 py-1 uppercase flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>Agriculture &amp; Pest Defense</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-[#F3F1EC]">
                Farm Crop Spraying &amp; Chemical Mist
              </h3>
              <p className="text-[#9BA1AC] text-sm leading-relaxed">
                Drop the 8m suction line straight into a drum or bucket to mist liquid fertilizers,
                pesticides, and insect repellents across vegetable beds and orchard trees. Say goodbye to exhausting, back-breaking manual knapsack pumps.
              </p>
            </div>
          </div>

          {/* Action Card 2: Compound Paver & Wall Blasting */}
          <div className="group border border-[#F3F1EC]/10 bg-[#17191D] overflow-hidden">
            <div className="relative overflow-hidden aspect-[16/9]">
              <Image
                src={ACTION_COMPOUND_BLAST_IMG}
                alt="48V cordless pressure washer blasting green moss and red dirt off interlocking paving stones"
                width={700}
                height={394}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#101114]/90 backdrop-blur-sm border border-[#E23E2E]/40 text-[#E23E2E] text-xs font-display font-semibold px-2.5 py-1 uppercase">
                Compound &amp; Paver Blast
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-[#F3F1EC]">
                Interlocking Stones &amp; Perimeter Walls
              </h3>
              <p className="text-[#9BA1AC] text-sm leading-relaxed">
                The precision 0° pinpoint red nozzle generates concentrated 48V water velocity to strip
                baked-on green algae, stubborn red mud, and oil from compound driveways and security walls without commercial rental gear.
              </p>
            </div>
          </div>

          {/* Action Card 3: Foam Cannon Pre-Wash */}
          <div className="group border border-[#F3F1EC]/10 bg-[#17191D] overflow-hidden">
            <div className="relative overflow-hidden aspect-[16/9]">
              <Image
                src={ACTION_CAR_WASH_IMG}
                alt="Teal 48V cordless gun with snap-on foam bottle spraying thick snow foam onto vehicle"
                width={700}
                height={394}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#101114]/90 backdrop-blur-sm border border-[#17B4C9]/40 text-[#17B4C9] text-xs font-display font-semibold px-2.5 py-1 uppercase">
                Soap Can Foam Cannon
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-[#F3F1EC]">
                Snap-On Snow Foam Soap Detailing
              </h3>
              <p className="text-[#9BA1AC] text-sm leading-relaxed">
                Snap the included white soap foam bottle directly onto the front lance nozzle for a dense, clinging snow foam blanket that dissolves grease, dirt, and road grime before you touch the paint.
              </p>
            </div>
          </div>

          {/* Action Card 4: Long Lance Draw From Bucket */}
          <div className="group border border-[#F3F1EC]/10 bg-[#17191D] overflow-hidden">
            <div className="relative overflow-hidden aspect-[16/9]">
              <Image
                src={ACTION_PATIO_BLAST_IMG}
                alt="Teal 48V cordless gun with stainless steel nozzle lance drawing from bucket of water"
                width={700}
                height={394}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#101114]/90 backdrop-blur-sm border border-[#17B4C9]/40 text-[#17B4C9] text-xs font-display font-semibold px-2.5 py-1 uppercase">
                Self-Priming Bucket Draw
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-[#F3F1EC]">
                Clean Anywhere — Zero Running Tap Needed
              </h3>
              <p className="text-[#9BA1AC] text-sm leading-relaxed">
                Connect the stainless steel nozzle lance and drop the 8m suction line into a bucket, jerrycan, or drum. The internal copper-core pump self-primes instantly to deliver full high-velocity pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO DEMONSTRATION & SELF-SERVICE TROUBLESHOOT SECTION */}
      <section id="videos" className="max-w-[1152px] mx-auto px-4 sm:px-6 py-16 sm:py-20 border-b border-[#F3F1EC]/10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#17B4C9] mb-3 bg-[#17191D] px-3.5 py-1.5 border border-[#17B4C9]/30">
            <Play className="w-3.5 h-3.5 fill-[#17B4C9]" />
            <span>REAL-WORLD ACTION &amp; OWNER SUPPORT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            See It In Action &bull; 30-Second Maintenance Guide
          </h2>
          <p className="text-[#9BA1AC] text-sm sm:text-base leading-relaxed">
            Watch real unboxing and high-pressure blasting performance, plus our essential owner's video showing how to effortlessly prime your pump after storage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Video 1: Real Action Demo */}
          <div className="bg-[#17191D] border border-[#F3F1EC]/10 overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-[#F3F1EC]/10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#17B4C9] uppercase tracking-wider">
                  VIDEO DEMO 01
                </span>
                <span className="text-[10px] sm:text-xs bg-[#17B4C9]/20 text-[#17B4C9] border border-[#17B4C9]/30 px-2 py-0.5 font-display uppercase font-semibold">
                  Live Performance
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F3F1EC]">
                I.C.E JetPro 48V™ Real-World Pressure Test
              </h3>
              <p className="text-xs sm:text-sm text-[#9BA1AC] mt-1.5 leading-relaxed">
                Watch the kit drawn straight from water, blasting high-velocity streams onto dirty surfaces with effortless cordless freedom.
              </p>
            </div>

            {/* Video Container (Vertical / 9:16 Shorts Responsive Embed) */}
            <div className="p-4 sm:p-6 bg-[#101114] flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-lg overflow-hidden border border-[#F3F1EC]/15 bg-black shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/xW8VQjFMXsM"
                  title="I.C.E JetPro 48V In Action"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#17191D] border-t border-[#F3F1EC]/10 text-xs text-[#9BA1AC] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#F3F1EC] font-display font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#17B4C9]" />
                Zero setup delay &bull; Dual 48V power
              </span>
              <a
                href="#buy"
                className="text-[#17B4C9] hover:underline font-mono uppercase text-[11px]"
              >
                Order Kit &rarr;
              </a>
            </div>
          </div>

          {/* Video 2: Troubleshoot & Maintenance Guide */}
          <div className="bg-[#17191D] border border-[#F3F1EC]/10 overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-[#F3F1EC]/10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  OWNER GUIDE 02
                </span>
                <span className="text-[10px] sm:text-xs bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 font-display uppercase font-semibold">
                  Self-Service Primer
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F3F1EC]">
                Engine Dryness Quick Fix &bull; 30-Second Guide
              </h3>
              <p className="text-xs sm:text-sm text-[#9BA1AC] mt-1.5 leading-relaxed">
                Stored your machine for a while? Learn how to prime the internal pump cylinder and restore 100% full pressure instantly.
              </p>
            </div>

            {/* Video Container (Vertical / 9:16 Shorts Responsive Embed) */}
            <div className="p-4 sm:p-6 bg-[#101114] flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-lg overflow-hidden border border-[#F3F1EC]/15 bg-black shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/5LiUoOW8_tg"
                  title="I.C.E JetPro 48V Troubleshoot and Maintenance Guide"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Crucial Reassurance Notice */}
            <div className="p-4 sm:p-6 bg-[#131519] border-t border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-bold uppercase tracking-wide text-amber-400">
                    Important Note for Owners — Natural Pump Dryness
                  </h4>
                  <p className="text-xs text-[#9BA1AC] leading-relaxed">
                    Over time or after prolonged storage in the case, the internal pump cylinder and silicone seals experience natural dryness. Customers sometimes worry the machine has developed a fault — <span className="text-[#F3F1EC] font-semibold">meanwhile the machine only experienced temporary dryness!</span>
                  </p>
                  <p className="text-xs text-[#9BA1AC] leading-relaxed">
                    As demonstrated in this video, all you need to do is add a splash of water directly into the intake to lubricate the chamber. The machine creates immediate suction and fires at 100% full pressure again!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S IN THE CASE (ANNOTATED FLATLAY) */}
      <section id="contents" className="max-w-[1152px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Annotated Image with Interactive Dots */}
          <div className="relative overflow-hidden bg-[#17191D] border border-[#F3F1EC]/10 p-2">
            <div className="relative">
              <Image
                src={FLATLAY_IMG}
                alt="Contents of the cleaning gun case laid out"
                width={800}
                height={600}
                className="w-full h-auto block select-none"
              />

              {CONTENTS.map((item) => {
                const isActive = activeCallout === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCallout(item.id)}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    aria-label={item.label}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-display font-bold text-sm flex items-center justify-center transition-all duration-200 cursor-pointer ${isActive
                        ? "bg-[#17B4C9] text-[#101114] border-2 border-[#17B4C9] scale-110 callout-active-pulse"
                        : "bg-[#101114]/90 text-[#F3F1EC] border-2 border-[#F3F1EC] hover:border-[#17B4C9] hover:text-[#17B4C9]"
                      }`}
                  >
                    {item.id}
                  </button>
                );
              })}
            </div>

            {/* Mobile Touch-Friendly Hotspot Selector Pills */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pt-3 pb-1 no-scrollbar border-t border-[#F3F1EC]/10 mt-2">
              {CONTENTS.map((item) => {
                const isActive = activeCallout === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCallout(item.id)}
                    className={`px-3.5 py-2 text-xs font-display uppercase tracking-wider shrink-0 border transition-all flex items-center gap-1.5 teardrop-btn-static ${isActive
                        ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                        : "bg-[#101114] text-[#9BA1AC] border-[#F3F1EC]/15 hover:border-[#17B4C9]/50"
                      }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${isActive ? "bg-[#101114] text-[#17B4C9]" : "bg-[#17191D] text-[#F3F1EC]"
                        }`}
                    >
                      {item.id}
                    </span>
                    <span>{item.label.split(" ").slice(0, 3).join(" ")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Item List */}
          <div>
            <div className="text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-2">
              Complete Out-Of-The-Box Kit
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">
              Everything's in the case
            </h2>

            <div className="space-y-1 mb-8">
              {CONTENTS.map((item) => {
                const isActive = activeCallout === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCallout(item.id)}
                    className={`w-full text-left flex items-start gap-4 p-4 border-b transition-all duration-200 cursor-pointer ${isActive
                        ? "border-[#17B4C9] bg-[#17191D]/80"
                        : "border-[#F3F1EC]/10 hover:border-[#F3F1EC]/30 bg-transparent"
                      }`}
                  >
                    <span
                      className={`font-display font-bold text-lg w-6 shrink-0 transition-colors ${isActive ? "text-[#17B4C9]" : "text-[#9BA1AC]"
                        }`}
                    >
                      {item.id}
                    </span>
                    <div className="flex-1">
                      <span className="block font-medium text-base text-[#F3F1EC]">{item.label}</span>
                      {isActive && (
                        <span className="block text-sm text-[#9BA1AC] mt-1.5 leading-relaxed">
                          {item.desc}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-[#17191D] border border-[#F3F1EC]/10 text-xs text-[#9BA1AC] flex items-center justify-between">
              <span>Click any numbered dot or item to inspect details</span>
              <span className="font-display font-semibold text-[#17B4C9]">ITEM {activeCallout} OF {CONTENTS.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION WITH BATTERY CLOSEUP */}
      <section id="features" className="max-w-[1152px] mx-auto px-6 py-20 border-t border-[#F3F1EC]/10">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 max-w-lg">
          Built to replace the hose, not just borrow from it
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#F3F1EC]/10">
          {/* Card 1 (Big span 2) */}
          <div className="bg-[#101114] p-8 md:col-span-2 flex flex-col justify-between group hover:bg-[#17191D] transition-colors">
            <div>
              <Zap className="w-8 h-8 text-[#17B4C9] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl font-bold mb-3">No cord. No compromise.</h3>
              <p className="text-[#9BA1AC] leading-relaxed max-w-xl">
                A built-in 48V motor pumps real pressure straight from the lithium-ion battery — no
                dragging a 50-foot extension lead across the wet lawn, and no hunting for an outdoor
                GFI outlet.
              </p>
            </div>
            <div className="mt-8 text-xs font-display uppercase tracking-wider text-[#17B4C9]">
              High-Output 48V Pump Motor
            </div>
          </div>

          {/* Card 2: Battery Swap Feature with Image */}
          <div className="bg-[#101114] p-8 flex flex-col justify-between group hover:bg-[#17191D] transition-colors">
            <div>
              <Battery className="w-8 h-8 text-[#17B4C9] mb-4 group-hover:scale-110 transition-transform" />
              <div className="relative mb-4 overflow-hidden border border-[#F3F1EC]/10 aspect-[4/3] bg-[#14161B]">
                <Image
                  src={BATTERY_DETACHABLE_TEAL}
                  alt="48V Battery Pack click-in mechanism"
                  width={320}
                  height={240}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Two batteries, zero downtime</h3>
              <p className="text-[#9BA1AC] leading-relaxed text-sm">
                Kit ships with dual 48V packs. Quick-release slide lock lets you hot-swap in 3 seconds.
              </p>
            </div>
            <div className="mt-6 text-xs font-display uppercase tracking-wider text-[#17B4C9]">
              Dual Pack Included
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#101114] p-8 flex flex-col justify-between group hover:bg-[#17191D] transition-colors">
            <div>
              <Droplets className="w-8 h-8 text-[#17B4C9] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl font-bold mb-3">Foam cannon included</h3>
              <p className="text-[#9BA1AC] leading-relaxed text-sm">
                Snap on the included bottle for thick, clinging pre-wash suds on cars, motorbikes,
                decking, and patio furniture.
              </p>
            </div>
            <div className="mt-8 text-xs font-display uppercase tracking-wider text-[#17B4C9]">
              Pre-Wash Foam System
            </div>
          </div>

          {/* Card 4 (Spans 2 cols on md) */}
          <div className="bg-[#101114] p-8 md:col-span-2 flex flex-col justify-between group hover:bg-[#17191D] transition-colors">
            <div>
              <Wrench className="w-8 h-8 text-[#17B4C9] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl font-bold mb-3">Fits your tap in seconds</h3>
              <p className="text-[#9BA1AC] leading-relaxed text-sm max-w-xl">
                Standard precision-machined quick-connect fittings thread directly onto standard
                garden taps or bucket draw lines. No tools, no Teflon tape, and no adapters to buy
                separately.
              </p>
            </div>
            <div className="mt-8 text-xs font-display uppercase tracking-wider text-[#17B4C9]">
              Tool-Free Quick Connect
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section id="compare" className="max-w-[1152px] mx-auto px-6 py-20 border-t border-[#F3F1EC]/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-2">
              Side-By-Side Advantage
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Cordless vs. the corded washer in your garage
            </h2>
          </div>
          <div className="text-xs text-[#17B4C9] font-mono sm:hidden flex items-center gap-1.5 self-start">
            <span className="w-2 h-2 rounded-full bg-[#17B4C9] animate-pulse" />
            <span>Swipe table horizontally &rarr;</span>
          </div>
        </div>

        <div className="border border-[#F3F1EC]/10 overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-[#17191D] font-display font-semibold text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Feature</div>
            <div className="p-4 text-[#17B4C9] border-l border-[#F3F1EC]/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#17B4C9]" />
              I.C.E JetPro 48V™
            </div>
            <div className="p-4 text-[#9BA1AC] border-l border-[#F3F1EC]/10">Traditional Corded</div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-3 border-t border-[#F3F1EC]/10 text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Power source</div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#F3F1EC]">
              <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
              48V dual battery packs
            </div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#9BA1AC]">
              <X className="w-4 h-4 text-[#E23E2E] shrink-0" />
              Wall outlet + heavy cord
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 border-t border-[#F3F1EC]/10 text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Setup time</div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#F3F1EC]">
              <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
              Under 30 seconds
            </div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#9BA1AC]">
              <X className="w-4 h-4 text-[#E23E2E] shrink-0" />
              Unravel cords & hoses (5-10m)
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 border-t border-[#F3F1EC]/10 text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Mobility &amp; reach</div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#F3F1EC]">
              <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
              Anywhere you can walk
            </div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#9BA1AC]">
              <X className="w-4 h-4 text-[#E23E2E] shrink-0" />
              Limited by cord + hose radius
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-3 border-t border-[#F3F1EC]/10 text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Continuous runtime</div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#F3F1EC]">
              <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
              Swap batteries, keep going
            </div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#9BA1AC]">
              <X className="w-4 h-4 text-[#E23E2E] shrink-0" />
              Unlimited, but tethered
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-3 border-t border-[#F3F1EC]/10 text-sm min-w-[500px]">
            <div className="p-4 text-[#9BA1AC]">Storage footprint</div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#F3F1EC]">
              <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
              Folds into one molded case
            </div>
            <div className="p-4 border-l border-[#F3F1EC]/10 flex items-center gap-2 text-[#9BA1AC]">
              <X className="w-4 h-4 text-[#E23E2E] shrink-0" />
              Bulky cart, tangled cords & reel
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="max-w-[1152px] mx-auto px-6 py-20 border-t border-[#F3F1EC]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-2">
              Beyond Just Car Washing
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Built for farms, compounds, and heavy jobs
            </h2>
          </div>
          <p className="text-[#9BA1AC] max-w-md text-sm leading-relaxed">
            One 48V cordless tool handles vehicle detailing, agricultural crop spraying, and deep compound maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/40 transition-colors">
            <Sprout className="w-7 h-7 text-[#17B4C9] mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2 text-[#F3F1EC]">Farms, crops &amp; pest control</h3>
            <p className="text-sm text-[#9BA1AC] leading-relaxed">
              Farmers spray crops, orchard trees, cassava, and vegetables with liquid fertilizers,
              pesticides, and insect repellents. Drop the 8m suction line into a chemical bucket or drum with zero manual knapsack pumping.
            </p>
          </div>

          <div className="p-6 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/40 transition-colors">
            <Droplets className="w-7 h-7 text-[#17B4C9] mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2 text-[#F3F1EC]">Cars, SUVs, trucks &amp; bikes</h3>
            <p className="text-sm text-[#9BA1AC] leading-relaxed">
              Snap on the foam cannon soap bottle for a thick pre-soak, then rinse with the 40° fan
              spray nozzle. A showroom-grade car wash anywhere in under 15 minutes.
            </p>
          </div>

          <div className="p-6 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/40 transition-colors">
            <Gauge className="w-7 h-7 text-[#17B4C9] mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2 text-[#F3F1EC]">Interlocking tiles &amp; walls</h3>
            <p className="text-sm text-[#9BA1AC] leading-relaxed">
              The precision 0° pinpoint red nozzle strips green algae, moss, dried clay, and oil stains
              off compound paving stones, concrete, security fences, and gutters.
            </p>
          </div>

          <div className="p-6 bg-[#17191D] border border-[#F3F1EC]/10 hover:border-[#17B4C9]/40 transition-colors">
            <Wrench className="w-7 h-7 text-[#17B4C9] mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2 text-[#F3F1EC]">AC units, solar &amp; generators</h3>
            <p className="text-sm text-[#9BA1AC] leading-relaxed">
              Clean outdoor AC condenser cooling fins, solar panels, and generator radiator grilles safely
              with controlled water volume and zero electric shock hazards.
            </p>
          </div>
        </div>
      </section>

      {/* CASE SHOWCASE WITH TOGGLE (REAL CASE VS STUDIO SHOT) */}
      <section className="max-w-[1152px] mx-auto px-6 py-20 border-t border-[#F3F1EC]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setCaseViewMode("real")}
                className={`text-xs font-display uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer teardrop-btn-static ${caseViewMode === "real"
                    ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                    : "bg-[#17191D] text-[#9BA1AC] border-[#F3F1EC]/20 hover:text-[#F3F1EC]"
                  }`}
              >
                Actual Kit Case
              </button>
              <button
                onClick={() => setCaseViewMode("studio")}
                className={`text-xs font-display uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer teardrop-btn-static ${caseViewMode === "studio"
                    ? "bg-[#17B4C9] text-[#101114] border-[#17B4C9] font-bold shadow-md shadow-[#17B4C9]/20"
                    : "bg-[#17191D] text-[#9BA1AC] border-[#F3F1EC]/20 hover:text-[#F3F1EC]"
                  }`}
              >
                Studio Perspective
              </button>
            </div>

            <div className="border border-[#F3F1EC]/10 p-4 bg-[#17191D] relative">
              <Image
                src={caseViewMode === "real" ? CASE_REAL_IMG : CASE_STUDIO_IMG}
                alt="Cleaning gun carry case, closed"
                width={500}
                height={500}
                className="w-full max-w-sm mx-auto h-[380px] object-contain"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-[#9BA1AC] uppercase font-mono bg-[#101114]/80 px-2 py-1">
                {caseViewMode === "real" ? "Actual Production Label" : "Precision Molded View"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-2">
              Pack It &amp; Go
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              One case. Everything stays put.
            </h2>
            <p className="text-[#9BA1AC] leading-relaxed mb-6">
              The 48V power gun, both 48V batteries, rapid charger, 8m draw hose with filter, 2 interchangeable spray
              nozzles, brass fittings, and soap can bottle all click into a molded impact case built to take a few knocks
              — toss it in the trunk, take it to the farm, or store it in your garage between jobs.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-[#F3F1EC]">
                <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
                Impact-resistant reinforced polymer shell
              </li>
              <li className="flex items-center gap-3 text-sm text-[#F3F1EC]">
                <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
                Precision-cut molded compartments for zero rattling
              </li>
              <li className="flex items-center gap-3 text-sm text-[#F3F1EC]">
                <Check className="w-4 h-4 text-[#17B4C9] shrink-0" />
                Heavy-duty carry handle + dual red latch closures
              </li>
            </ul>

            <a
              href="#buy"
              className="font-display border border-[#17B4C9] text-[#17B4C9] hover:bg-[#17B4C9] hover:text-[#101114] transition-colors text-sm uppercase tracking-wider px-6 py-3 inline-block font-semibold"
            >
              Claim your kit &amp; case
            </a>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="max-w-[768px] mx-auto px-6 py-20 border-t border-[#F3F1EC]/10">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 text-center">
          Questions people ask before buying
        </h2>

        <div className="border-t border-[#F3F1EC]/10">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border-b border-[#F3F1EC]/10">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="font-display font-medium text-lg text-[#F3F1EC] group-hover:text-[#17B4C9] transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#9BA1AC] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#17B4C9]" : ""
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 pr-8 text-sm text-[#9BA1AC] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA & DIRECT ORDER FORM (SUBMITS TO SUPABASE HEALTH_ORDERS) */}
      <section id="buy" className="border-t border-[#F3F1EC]/10 bg-[#17191D] py-20">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#17B4C9] font-semibold mb-3 bg-[#101114] px-3.5 py-1.5 border border-[#17B4C9]/30">
              <span className="w-2 h-2 rounded-full bg-[#17B4C9] animate-ping" />
              Fast Doorstep Dispatch &bull; Pay On Delivery
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-[#F3F1EC]">
              Cut the cord with I.C.E JetPro 48V™.
            </h2>
            <p className="text-[#9BA1AC] leading-relaxed text-sm sm:text-base">
              Complete professional kit: 48V power gun, two battery packs, rapid wall charger, 8m draw hose with
              filter basket, two spray nozzles (0° blast &amp; 40° fan), soap can bottle, brass connectors, and rugged molded case. Select your package and complete the order form below.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <OrderForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#F3F1EC]/10 py-8 text-sm text-[#9BA1AC]">
        <div className="max-w-[1152px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold text-lg text-[#F3F1EC] flex items-center gap-1.5">
            <span>I.C.E</span>
            <span className="text-[#17B4C9]">JETPRO</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#17B4C9]/20 text-[#17B4C9] border border-[#17B4C9]/40 font-mono">
              48V™
            </span>
          </div>
          <div className="text-xs text-center sm:text-right">
            <span>I.C.E JetPro 48V™ Cordless Cleaning Gun Kit</span>
            <span className="mx-2">•</span>
            <span>All rights reserved &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM MOBILE CTA BAR (Optimized for mobile clients) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#101114]/95 backdrop-blur-md border-t border-[#F3F1EC]/15 px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-[#E23E2E] line-through font-mono">
                {formatPrice(country.singleOrig)}
              </span>
              <span className="font-display text-lg font-bold text-[#F3F1EC]">
                {formatPrice(country.singlePrice)}
              </span>
              <span className="text-[10px] text-[#17B4C9] font-mono">({country.currency})</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium leading-none mt-0.5">
              Free Delivery &bull; Pay On Delivery ({country.name})
            </p>
          </div>
          <a
            href="#buy"
            className="bg-[#17B4C9] text-[#101114] font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-lg shadow-[#17B4C9]/25 flex items-center gap-1.5 hover:bg-[#F3F1EC] transition-all shrink-0 teardrop-btn"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <CurrencyProvider>
      <LandingPageContent />
    </CurrencyProvider>
  );
}
