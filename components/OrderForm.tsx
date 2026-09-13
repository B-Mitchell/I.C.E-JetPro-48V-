"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCurrency } from "@/lib/currencyContext";
import CountrySelector from "./CountrySelector";
import {
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Phone,
  MapPin,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Send,
  Package,
} from "lucide-react";

interface PackDef {
  id: string;
  name: string;
  description: string;
  badge?: string;
  popular?: boolean;
}

const PACK_DEFS: PackDef[] = [
  {
    id: "single",
    name: "1× Complete I.C.E JetPro 48V™ Kit",
    description: "Includes 48V Power Gun, 2× Lithium-Ion Batteries, 8m Draw Hose with Filter, 2× Spray Nozzles (0° & 40°), Soap Can Bottle, Fast Charger, Brass Fittings & Hard Case",
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "double",
    name: "2× Complete I.C.E JetPro 48V™ Kits (Promo Double Pack)",
    description: "2× Power Guns, 4× 48V Batteries, 2× 8m Draw Hoses, 4× Spray Nozzles, 2× Soap Can Bottles, 2× Fast Chargers & 2× Molded Hard Cases",
    badge: "Best Value",
  },
  {
    id: "triple",
    name: "3× Complete I.C.E JetPro 48V™ Kits (Commercial & Farm Tri-Pack)",
    description: "3× Complete Outfits for Multi-Vehicle Families, Commercial Cleaners, Farm Crop Spraying & Estates",
    badge: "Maximum Savings",
  },
];

export default function OrderForm() {
  const router = useRouter();
  const { country, formatPrice } = useCurrency();

  const [selectedPackId, setSelectedPackId] = useState<string>("single");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [trackingNotes, setTrackingNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Sync state dropdown when country changes
  useEffect(() => {
    if (country.regions && country.regions.length > 0) {
      setState(country.regions[0]);
    }
  }, [country]);

  const selectedPackDef = PACK_DEFS.find((p) => p.id === selectedPackId) || PACK_DEFS[0];

  const getPackPrice = (id: string) => {
    if (id === "double") return country.doublePrice;
    if (id === "triple") return country.triplePrice;
    return country.singlePrice;
  };

  const getPackOrig = (id: string) => {
    if (id === "double") return country.doubleOrig;
    if (id === "triple") return country.tripleOrig;
    return country.singleOrig;
  };

  const currentPriceFormatted = formatPrice(getPackPrice(selectedPackId));

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsappPhone(val);
    }
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappPhone(phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("Please provide your full first and last name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMsg("Please enter a valid phone number for delivery confirmation.");
      return;
    }
    const finalWhatsApp = sameAsPhone ? phone.trim() : whatsappPhone.trim();
    if (!finalWhatsApp) {
      setErrorMsg("Please provide your WhatsApp number so our dispatch agent can reach you.");
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg("Please provide your complete delivery street address.");
      return;
    }
    if (!state) {
      setErrorMsg(`Please select your delivery ${country.regionLabel}.`);
      return;
    }

    setIsSubmitting(true);

    const packLabel = `${selectedPackDef.name} — ${currentPriceFormatted}`;

    const orderPayload = {
      product_name: "I.C.E JetPro 48V™ Cordless Cleaning Gun Kit",
      pack: packLabel,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: `${country.phonePrefix} ${phone.trim()}`,
      whatsapp_phone: `${country.phonePrefix} ${finalWhatsApp}`,
      address: address.trim(),
      state: state.trim(),
      country: country.code,
      assigned_agent_id: null,
      assigned_agent_name: null,
      priority: "normal",
      tracking_notes: trackingNotes.trim() || null,
      status: "pending",
      customer_feedback: null,
      delivery_expense: 0,
      delivered_at: null,
      delivery_currency: country.currency,
    };

    try {
      const { data, error } = await supabase
        .from("health_orders")
        .insert([orderPayload])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMsg(error.message || "Failed to submit order. Please check your connection and try again.");
      } else {
        const orderId = (data && data.length > 0 && data[0].id) ? data[0].id : "";
        const queryParams = new URLSearchParams({
          orderId: orderId,
          name: `${firstName.trim()} ${lastName.trim()}`,
          pack: packLabel,
          amount: currentPriceFormatted,
          phone: `${country.phonePrefix} ${phone.trim()}`,
          address: address.trim(),
          state: state.trim(),
          country: country.name,
        });
        router.push(`/thank-you?${queryParams.toString()}`);
      }
    } catch (err: any) {
      console.error("Submission exception:", err);
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedOrder) {
    const whatsappMessage = encodeURIComponent(
      `Hello I.C.E Power, I just placed an order for ${submittedOrder.pack}. My name is ${submittedOrder.first_name} ${submittedOrder.last_name}, delivery to ${submittedOrder.address}, ${submittedOrder.state} (${country.name}). Please confirm my order dispatch.`
    );

    return (
      <div className="border border-[#17B4C9] bg-[#17191D] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl teardrop-btn-static">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#17B4C9] via-[#F3F1EC] to-[#E23E2E]" />

        <div className="w-16 h-16 bg-[#17B4C9]/20 border-2 border-[#17B4C9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#17B4C9]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-widest text-[#17B4C9] font-semibold">
          Order Confirmed &amp; Queued For Doorstep Dispatch
        </span>
        <h3 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4 text-[#F3F1EC]">
          Thank you, {submittedOrder.first_name}!
        </h3>
        <p className="text-[#9BA1AC] max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Your order has been recorded into our fulfillment system for <span className="text-[#F3F1EC] font-semibold">{country.name}</span>. Our delivery officer will call or WhatsApp you shortly at <span className="text-[#F3F1EC] font-semibold">{submittedOrder.phone}</span> to verify your address and coordinate delivery.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#101114] border border-[#F3F1EC]/10 p-6 text-left max-w-lg mx-auto mb-8 space-y-3 text-sm teardrop-btn-static">
          <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
            <span className="text-[#9BA1AC]">Order Reference:</span>
            <span className="font-mono font-semibold text-[#17B4C9]">
              {submittedOrder.id ? `#${submittedOrder.id.slice(0, 8)}` : "#ICE-PENDING"}
            </span>
          </div>
          <div className="flex justify-between items-start pb-3 border-b border-[#F3F1EC]/10">
            <span className="text-[#9BA1AC]">Package:</span>
            <span className="text-right font-medium text-[#F3F1EC] max-w-[280px]">
              {submittedOrder.pack}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
            <span className="text-[#9BA1AC]">Total Amount Due:</span>
            <span className="font-display text-xl font-bold text-[#17B4C9]">
              {currentPriceFormatted} (Pay on Delivery)
            </span>
          </div>
          <div className="flex justify-between items-start pt-1">
            <span className="text-[#9BA1AC]">Delivery Address:</span>
            <span className="text-right text-[#F3F1EC] max-w-[280px]">
              {submittedOrder.address}, {submittedOrder.state} ({country.name})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto font-display bg-[#17B4C9] text-[#101114] font-bold text-base px-8 py-3.5 uppercase tracking-wider hover:bg-[#F3F1EC] transition-all inline-flex items-center justify-center gap-2 teardrop-btn shadow-lg shadow-[#17B4C9]/20"
          >
            <Send className="w-4 h-4" />
            Fast-Track on WhatsApp
          </a>

          <button
            onClick={() => {
              setSubmittedOrder(null);
              setFirstName("");
              setLastName("");
              setPhone("");
              setWhatsappPhone("");
              setAddress("");
              setTrackingNotes("");
            }}
            className="w-full sm:w-auto border border-[#F3F1EC]/30 text-[#F3F1EC] hover:border-[#17B4C9] hover:text-[#17B4C9] font-display text-sm uppercase tracking-wider px-6 py-3.5 transition-all teardrop-btn-static"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="order-form-container" className="border border-[#F3F1EC]/10 bg-[#17191D] p-6 sm:p-10 shadow-2xl">
      <div className="pb-6 border-b border-[#F3F1EC]/10 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#17B4C9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#17B4C9] animate-ping" />
              Direct Factory Order &bull; Doorstep Delivery
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-[#F3F1EC]">
              Place Your Order Below
            </h3>
            <p className="text-xs text-[#9BA1AC] mt-1">
              Payment On Delivery available • Inspect your package before paying
            </p>
          </div>
        </div>

        {/* Dynamic Country Selector for Multi-Region Buyers */}
        <CountrySelector variant="form" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: SELECT PACKAGE */}
        <div>
          <label className="block font-display text-sm uppercase tracking-wider text-[#17B4C9] mb-3">
            Step 1: Choose Your Kit Package ({country.name})
          </label>

          <div className="grid grid-cols-1 gap-3">
            {PACK_DEFS.map((pack) => {
              const isSelected = selectedPackId === pack.id;
              const price = getPackPrice(pack.id);
              const orig = getPackOrig(pack.id);
              const currentPrice = formatPrice(price);
              const origPrice = formatPrice(orig);

              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`relative p-4 sm:p-5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 teardrop-btn-static ${
                    isSelected
                      ? "border-[#17B4C9] bg-[#101114] shadow-lg shadow-[#17B4C9]/10 ring-1 ring-[#17B4C9]"
                      : "border-[#F3F1EC]/15 bg-[#101114]/60 hover:border-[#F3F1EC]/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#17B4C9] bg-[#17B4C9]"
                          : "border-[#9BA1AC] bg-transparent"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#101114]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-base text-[#F3F1EC]">
                          {pack.name}
                        </span>
                        {pack.badge && (
                          <span
                            className={`text-[10px] font-display uppercase font-semibold px-2 py-0.5 tracking-wider teardrop-btn-static ${
                              pack.popular
                                ? "bg-[#17B4C9] text-[#101114]"
                                : "bg-[#E23E2E] text-[#F3F1EC]"
                            }`}
                          >
                            {pack.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9BA1AC] mt-1 leading-relaxed max-w-md">
                        {pack.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right pl-8 sm:pl-0 shrink-0">
                    <div className="flex items-baseline gap-2 sm:justify-end">
                      <span className="text-xs sm:text-sm line-through text-[#E23E2E] font-mono decoration-2">
                        {origPrice}
                      </span>
                      <span className="font-display text-2xl font-bold text-[#F3F1EC]">
                        {currentPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end mt-1">
                      <span className="text-[10px] uppercase font-bold text-[#E23E2E] bg-[#E23E2E]/15 px-1.5 py-0.5 border border-[#E23E2E]/30">
                        Price Slashed
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">Free Delivery</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: DELIVERY DETAILS */}
        <div className="space-y-4 pt-4 border-t border-[#F3F1EC]/10">
          <label className="block font-display text-sm uppercase tracking-wider text-[#17B4C9]">
            Step 2: Enter Delivery &amp; Contact Details ({country.flag} {country.name})
          </label>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#17B4C9]" />
                First Name <span className="text-[#E23E2E]">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Kwame / Emmanuel / John"
                className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#17B4C9]" />
                Last Name <span className="text-[#E23E2E]">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Mensah / Okafor / Kamau"
                className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#17B4C9]" />
                Phone Number (For Call Verification) <span className="text-[#E23E2E]">*</span>
              </label>
              <div className="flex">
                <span className="bg-[#101114] border border-r-0 border-[#F3F1EC]/20 px-3 py-3 text-sm font-mono text-[#17B4C9] flex items-center shrink-0">
                  {country.flag} {country.phonePrefix}
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={country.phonePlaceholder}
                  className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#9BA1AC] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#17B4C9]" />
                  WhatsApp Number <span className="text-[#E23E2E]">*</span>
                </label>
                <label className="text-[11px] text-[#17B4C9] flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                    className="accent-[#17B4C9] w-3 h-3"
                  />
                  Same as Phone
                </label>
              </div>
              <div className="flex">
                <span className="bg-[#101114] border border-r-0 border-[#F3F1EC]/20 px-3 py-3 text-sm font-mono text-[#17B4C9] flex items-center shrink-0">
                  {country.flag} {country.phonePrefix}
                </span>
                <input
                  type="tel"
                  required
                  disabled={sameAsPhone}
                  value={sameAsPhone ? phone : whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder={country.phonePlaceholder}
                  className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Street Address & State / Region */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#17B4C9]" />
                Full Street Delivery Address <span className="text-[#E23E2E]">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment number, Street name, Town or Area"
                className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5">
                {country.regionLabel} <span className="text-[#E23E2E]">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] focus:outline-none focus:border-[#17B4C9] transition-colors"
              >
                {country.regions.map((reg) => (
                  <option key={reg} value={reg} className="bg-[#101114] text-[#F3F1EC]">
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Notes / Landmark */}
          <div>
            <label className="block text-xs font-medium text-[#9BA1AC] mb-1.5">
              Nearest Landmark or Special Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={trackingNotes}
              onChange={(e) => setTrackingNotes(e.target.value)}
              placeholder="e.g. Near Total Filling Station / Deliver after 12pm"
              className="w-full bg-[#101114] border border-[#F3F1EC]/20 px-3.5 py-3 text-base text-[#F3F1EC] placeholder-[#9BA1AC]/50 focus:outline-none focus:border-[#17B4C9] transition-colors"
            />
          </div>
        </div>

        {/* ERROR MESSAGE ALERT */}
        {errorMsg && (
          <div className="p-4 bg-[#E23E2E]/15 border border-[#E23E2E] text-[#F3F1EC] text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E23E2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs uppercase tracking-wider text-[#E23E2E]">
                Attention Needed
              </p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON & ORDER SUMMARY */}
        <div className="pt-4 border-t border-[#F3F1EC]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[#9BA1AC]">Order Total:</span>
              <span className="font-display text-3xl font-bold text-[#17B4C9]">
                {currentPriceFormatted}
              </span>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <Check className="w-3.5 h-3.5" />
              Pay on Delivery Available ({country.name})
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto font-display bg-[#17B4C9] text-[#101114] font-bold text-lg px-10 py-4 uppercase tracking-wider hover:bg-[#F3F1EC] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#17B4C9]/25 flex items-center justify-center gap-3 cursor-pointer teardrop-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#101114]" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Confirm Order — Pay on Delivery</span>
                <Send className="w-5 h-5 text-[#101114]" />
              </>
            )}
          </button>
        </div>

        {/* TRUST ICONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#F3F1EC]/10 text-xs text-[#9BA1AC]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#17B4C9] shrink-0" />
            <span>Doorstep Express Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#17B4C9] shrink-0" />
            <span>Inspect Before Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#17B4C9] shrink-0" />
            <span>2-Year Kit Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#17B4C9] shrink-0" />
            <span>Money-Back Guarantee</span>
          </div>
        </div>
      </form>
    </div>
  );
}
