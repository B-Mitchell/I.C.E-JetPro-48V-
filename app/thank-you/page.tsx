"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  PhoneCall,
  Truck,
  ShieldCheck,
  Send,
  ArrowLeft,
  Clock,
  MapPin,
  FileText,
  BadgeAlert,
  Sparkles,
} from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";
  const name = searchParams.get("name") || "Valued Customer";
  const pack = searchParams.get("pack") || "1× Complete I.C.E JetPro 48V™ Kit";
  const amount = searchParams.get("amount") || "₦85,000";
  const phone = searchParams.get("phone") || "";
  const address = searchParams.get("address") || "";
  const state = searchParams.get("state") || "";
  const country = searchParams.get("country") || "Nigeria";

  // Track Meta & TikTok Conversion events once on order confirmation
  const trackedRef = React.useRef(false);
  React.useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    if (typeof window !== "undefined") {
      const rawNumber = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
      const currency = country === "Ghana" ? "GHS" : country === "Kenya" ? "KES" : "NGN";

      // Meta Pixel Purchase Event
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Purchase", {
          content_name: pack,
          content_type: "product",
          value: rawNumber,
          currency: currency,
        });
      }

      // TikTok Pixel PlaceAnOrder & CompletePayment Events
      if (
        typeof (window as any).ttq !== "undefined" &&
        typeof (window as any).ttq.track === "function"
      ) {
        (window as any).ttq.track("PlaceAnOrder", {
          content_id: orderId || "ICE-JETPRO-48V",
          content_type: "product",
          content_name: pack,
          quantity: 1,
          price: rawNumber,
          value: rawNumber,
          currency: currency,
        });
        (window as any).ttq.track("CompletePayment", {
          content_id: orderId || "ICE-JETPRO-48V",
          content_type: "product",
          content_name: pack,
          quantity: 1,
          price: rawNumber,
          value: rawNumber,
          currency: currency,
        });
      }
    }
  }, [amount, country, orderId, pack]);

  const displayRef = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "#ICE-PENDING";

  const whatsappMessage = encodeURIComponent(
    `Hello I.C.E Power! I just placed an order for the ${pack}. Order Ref: ${displayRef}. My name is ${name}, phone: ${phone}, delivery address: ${address}, ${state} (${country}). Please fast-track my dispatch.`
  );

  return (
    <div className="min-h-screen bg-[#101114] text-[#F3F1EC] flex flex-col">
      {/* TOP BRAND HEADER */}
      <header className="border-b border-[#F3F1EC]/10 bg-[#17191D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1152px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-1.5">
              <span>I.C.E</span>
              <span className="text-[#17B4C9]">JETPRO</span>
              <span className="text-[10px] sm:text-xs uppercase px-1.5 py-0.5 bg-[#17B4C9]/20 text-[#17B4C9] border border-[#17B4C9]/40 font-mono">
                48V™
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm text-[#9BA1AC] hover:text-[#17B4C9] flex items-center gap-1.5 transition-colors font-display uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </header>

      {/* MAIN THANK YOU CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="border border-[#17B4C9] bg-[#17191D] p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl teardrop-btn-static">
          {/* Top colored gradient line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#17B4C9] via-[#F3F1EC] to-[#E23E2E]" />

          {/* Big glowing check icon */}
          <div className="w-20 h-20 bg-[#17B4C9]/15 border-2 border-[#17B4C9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#17B4C9] shadow-lg shadow-[#17B4C9]/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#17B4C9] font-semibold bg-[#101114] px-3.5 py-1.5 border border-[#17B4C9]/30 mb-3 teardrop-btn-static">
            <span className="w-2 h-2 rounded-full bg-[#17B4C9] animate-ping" />
            Order Successfully Recorded &bull; Ready For Dispatch
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold mt-2 mb-4 text-[#F3F1EC]">
            Thank You, {name}!
          </h1>

          <p className="text-[#9BA1AC] text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
            Your order for the <span className="text-[#F3F1EC] font-semibold">I.C.E JetPro 48V™</span> has been received and added to our priority dispatch queue. Our verification officer will contact you shortly.
          </p>

          {/* ITEM SUMMARY CARD */}
          <div className="bg-[#101114] border border-[#F3F1EC]/15 p-5 sm:p-7 text-left max-w-xl mx-auto mb-10 space-y-3.5 text-sm teardrop-btn-static">
            <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
              <span className="text-[#9BA1AC] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#17B4C9]" />
                Order Tracking ID:
              </span>
              <span className="font-mono font-bold text-[#17B4C9] text-sm sm:text-base">
                {displayRef}
              </span>
            </div>

            <div className="flex justify-between items-start pb-3 border-b border-[#F3F1EC]/10">
              <span className="text-[#9BA1AC] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#17B4C9]" />
                Selected Package:
              </span>
              <span className="text-right font-medium text-[#F3F1EC] max-w-[280px]">
                {pack}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
              <span className="text-[#9BA1AC]">Total Amount Due:</span>
              <span className="font-display text-2xl font-bold text-[#17B4C9]">
                {amount}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
              <span className="text-[#9BA1AC]">Payment Method:</span>
              <span className="font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 border border-emerald-400/20 text-xs uppercase">
                Pay On Delivery (Cash / POS Transfer)
              </span>
            </div>

            {phone && (
              <div className="flex justify-between items-center pb-3 border-b border-[#F3F1EC]/10">
                <span className="text-[#9BA1AC]">Contact Phone:</span>
                <span className="font-mono text-[#F3F1EC]">{phone}</span>
              </div>
            )}

            {address && (
              <div className="flex justify-between items-start pt-1">
                <span className="text-[#9BA1AC] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#17B4C9]" />
                  Delivery Destination:
                </span>
                <span className="text-right text-[#F3F1EC] max-w-[280px]">
                  {address}, {state} ({country})
                </span>
              </div>
            )}
          </div>

          {/* WHAT HAPPENS NEXT TIMELINE */}
          <div className="text-left max-w-xl mx-auto mb-10">
            <h3 className="font-display text-lg uppercase tracking-wider text-[#17B4C9] font-bold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>What Happens Next?</span>
            </h3>

            <div className="space-y-4 border-l-2 border-[#17B4C9]/40 pl-5 ml-2">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#17B4C9] border-2 border-[#101114]" />
                <h4 className="font-display font-bold text-sm text-[#F3F1EC] uppercase">
                  Step 1: Phone Verification (Within 15–30 Mins)
                </h4>
                <p className="text-xs text-[#9BA1AC] mt-1 leading-relaxed">
                  Our dispatch logistics agent will call or WhatsApp you to confirm your street address and make sure you'll be available to receive your package.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#17B4C9]/50 border-2 border-[#101114]" />
                <h4 className="font-display font-bold text-sm text-[#F3F1EC] uppercase">
                  Step 2: Quality Inspection &amp; Express Dispatch
                </h4>
                <p className="text-xs text-[#9BA1AC] mt-1 leading-relaxed">
                  The dual 48V battery packs, 5m hose, brass quick connectors, and foam cannon bottle are securely inspected, sealed in the hard carry case, and handed to the courier.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#17B4C9]/20 border-2 border-[#101114]" />
                <h4 className="font-display font-bold text-sm text-[#F3F1EC] uppercase">
                  Step 3: Doorstep Delivery &bull; Inspect Before Payment
                </h4>
                <p className="text-xs text-[#9BA1AC] mt-1 leading-relaxed">
                  The rider arrives at your doorstep. You can open the case, verify all components, and make payment directly via Cash or Instant Bank Transfer.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto font-display bg-[#17B4C9] text-[#101114] font-bold text-base px-8 py-4 uppercase tracking-wider hover:bg-[#F3F1EC] transition-all inline-flex items-center justify-center gap-2.5 teardrop-btn shadow-xl shadow-[#17B4C9]/25"
            >
              <Send className="w-5 h-5" />
              <span>Fast-Track On WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto border border-[#F3F1EC]/30 text-[#F3F1EC] hover:border-[#17B4C9] hover:text-[#17B4C9] font-display text-sm uppercase tracking-wider px-6 py-4 transition-all teardrop-btn-static"
            >
              Return To Home
            </Link>
          </div>

          {/* TRUST FOOTER NOTE */}
          <div className="mt-8 pt-6 border-t border-[#F3F1EC]/10 flex items-center justify-center gap-6 text-xs text-[#9BA1AC]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#17B4C9]" />
              <span>100% Genuine 48V Kit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#17B4C9]" />
              <span>Inspected Before Payment</span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#F3F1EC]/10 py-6 text-center text-xs text-[#9BA1AC]">
        <p>I.C.E JetPro 48V™ &copy; {new Date().getFullYear()} &bull; All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101114] text-[#F3F1EC] flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-2 border-[#17B4C9] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-display uppercase tracking-widest text-sm text-[#17B4C9]">
              Loading Your Order Confirmation...
            </p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
