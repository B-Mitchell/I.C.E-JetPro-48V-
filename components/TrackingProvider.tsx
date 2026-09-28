"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking";

function TrackingProviderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Skip the very first run because base pixel snippets in layout.tsx already fire initial PageView
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Fire PageView on Next.js client-side route transitions (SPA navigation)
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingProviderContent />
    </Suspense>
  );
}
