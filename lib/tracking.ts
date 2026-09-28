// lib/tracking.ts

export interface TrackingItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface PurchasePayload {
  orderId: string;
  packName: string;
  amount: number;
  currency: string;
  country?: string;
  phone?: string;
}

// Retrying helper to safely execute when tracker script finishes loading
function retryTracker(
  checkReady: () => boolean,
  action: () => void,
  maxRetries = 10,
  delayMs = 250
) {
  if (typeof window === "undefined") return;

  if (checkReady()) {
    try {
      action();
    } catch (err) {
      console.warn("[Tracking] Execution error:", err);
    }
  } else if (maxRetries > 0) {
    setTimeout(() => {
      retryTracker(checkReady, action, maxRetries - 1, delayMs);
    }, delayMs);
  } else {
    // Attempt action anyway if retries exhausted
    try {
      action();
    } catch {
      // ignore
    }
  }
}

/**
 * Track PageView for both Meta (Facebook) and TikTok
 */
export function trackPageView() {
  if (typeof window === "undefined") return;

  // Meta Pixel
  retryTracker(
    () => typeof (window as any).fbq === "function",
    () => {
      (window as any).fbq("track", "PageView");
    }
  );

  // TikTok Pixel
  retryTracker(
    () =>
      typeof (window as any).ttq !== "undefined" &&
      typeof (window as any).ttq.page === "function",
    () => {
      (window as any).ttq.page();
    }
  );
}

/**
 * Track InitiateCheckout for both Meta and TikTok
 */
export function trackInitiateCheckout(item: TrackingItem, currency: string) {
  if (typeof window === "undefined") return;

  const price = item.price || 0;
  const qty = item.quantity || 1;

  // Meta Pixel InitiateCheckout
  retryTracker(
    () => typeof (window as any).fbq === "function",
    () => {
      (window as any).fbq("track", "InitiateCheckout", {
        content_name: item.name,
        content_ids: [item.id],
        content_type: "product",
        value: price * qty,
        currency: currency,
        num_items: qty,
      });
    }
  );

  // TikTok Pixel InitiateCheckout
  retryTracker(
    () =>
      typeof (window as any).ttq !== "undefined" &&
      typeof (window as any).ttq.track === "function",
    () => {
      (window as any).ttq.track("InitiateCheckout", {
        content_type: "product",
        value: price * qty,
        currency: currency,
        contents: [
          {
            content_id: item.id,
            content_name: item.name,
            quantity: qty,
            price: price,
          },
        ],
      });
    }
  );
}

/**
 * Track Purchase / PlaceAnOrder / CompletePayment on Thank You page
 */
export function trackPurchase(data: PurchasePayload) {
  if (typeof window === "undefined") return;

  const value = data.amount || 0;
  const currency = data.currency || "NGN";
  const contentId = data.orderId || "ICE-JETPRO-48V";
  const contentName = data.packName || "I.C.E JetPro 48V™ Kit";

  // 1. Meta Pixel: Purchase
  retryTracker(
    () => typeof (window as any).fbq === "function",
    () => {
      (window as any).fbq("track", "Purchase", {
        content_name: contentName,
        content_type: "product",
        content_ids: [contentId],
        value: value,
        currency: currency,
        num_items: 1,
      });
    }
  );

  // 2. TikTok Pixel: PlaceAnOrder & CompletePayment
  retryTracker(
    () =>
      typeof (window as any).ttq !== "undefined" &&
      typeof (window as any).ttq.track === "function",
    () => {
      const tiktokPayload = {
        content_type: "product",
        content_id: contentId,
        content_name: contentName,
        quantity: 1,
        price: value,
        value: value,
        currency: currency,
        contents: [
          {
            content_id: contentId,
            content_name: contentName,
            quantity: 1,
            price: value,
          },
        ],
      };

      // Both PlaceAnOrder and CompletePayment are standard TikTok conversion events
      (window as any).ttq.track("PlaceAnOrder", tiktokPayload);
      (window as any).ttq.track("CompletePayment", tiktokPayload);
    }
  );
}
