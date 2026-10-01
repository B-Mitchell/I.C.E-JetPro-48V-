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
  email?: string;
}

/**
 * Retrying helper — waits for the tracker SDK to finish loading before firing.
 * Retries up to maxRetries times, spaced delayMs apart.
 */
function retryTracker(
  checkReady: () => boolean,
  action: () => void | Promise<void>,
  maxRetries = 15,
  delayMs = 200
) {
  if (typeof window === "undefined") return;

  if (checkReady()) {
    try {
      const res = action();
      if (res && typeof (res as any).catch === "function") {
        (res as any).catch((err: any) => console.warn("[Tracking] Async execution error:", err));
      }
    } catch (err) {
      console.warn("[Tracking] Execution error:", err);
    }
  } else if (maxRetries > 0) {
    setTimeout(() => {
      retryTracker(checkReady, action, maxRetries - 1, delayMs);
    }, delayMs);
  } else {
    // Attempt anyway when retries are exhausted
    try {
      action();
    } catch {
      // ignore silently
    }
  }
}

// ─── SDK readiness checks ─────────────────────────────────────────────────────

function isFbqReady(): boolean {
  return typeof (window as any).fbq === "function";
}

function isTtqReady(): boolean {
  return (
    typeof (window as any).ttq !== "undefined" &&
    typeof (window as any).ttq.track === "function"
  );
}

function isTtqPageReady(): boolean {
  return (
    typeof (window as any).ttq !== "undefined" &&
    typeof (window as any).ttq.page === "function"
  );
}

// ─── Advanced Matching helpers (TikTok & Meta) ────────────────────────────────

/**
 * Asynchronously compute SHA-256 hex string for TikTok Advanced Matching.
 * TikTok standard recommends lowercase SHA-256 for PII data (phone_number, email).
 */
async function sha256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const buffer = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      console.warn("[Tracking] SubtleCrypto hash error:", e);
    }
  }
  return normalized;
}

/**
 * Strip everything except digits and normalize international formatting.
 * Handles trunk prefix '0' (e.g. Nigeria +234 080... -> 23480...).
 */
function normalizePhone(phone: string): string {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("2340")) digits = "234" + digits.slice(4);
  else if (digits.startsWith("2330")) digits = "233" + digits.slice(4);
  else if (digits.startsWith("2540")) digits = "254" + digits.slice(4);
  return digits;
}

/**
 * Call ttq.identify() with hashed user data before conversion events.
 * This enables TikTok Advanced Matching, which improves attribution accuracy
 * and resolves the "Missing email and phone number" SDK diagnostic warning.
 *
 * Docs: https://ads.tiktok.com/marketing_api/docs?id=1701890972946433
 */
async function identifyTikTokUser(phone?: string, email?: string) {
  if (typeof window === "undefined") return;
  if (!isTtqReady()) return;

  const userData: Record<string, string> = {};
  if (phone) {
    const normalized = normalizePhone(phone);
    if (normalized.length >= 7) {
      // Pass SHA-256 hashed phone number for TikTok Manual Advanced Matching
      userData.phone_number = await sha256(normalized);
    }
  }
  if (email && email.includes("@")) {
    userData.email = await sha256(email);
  }

  if (Object.keys(userData).length === 0) return;

  try {
    (window as any).ttq.identify(userData);
  } catch (err) {
    console.warn("[Tracking] ttq.identify error:", err);
  }
}

// ─── Exported tracking functions ──────────────────────────────────────────────

/**
 * Track PageView for both Meta (Facebook) and TikTok.
 * Fired on initial load (inline snippet) and on every SPA route change (TrackingProvider).
 */
export function trackPageView() {
  if (typeof window === "undefined") return;

  // Meta Pixel — PageView
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "PageView");
  });

  // TikTok Pixel — page()
  retryTracker(isTtqPageReady, () => {
    (window as any).ttq.page();
  });
}

/**
 * Track ViewContent for landing page and product showcase.
 * Required for Video Shopping Ads (VSA) and catalog matching.
 */
export function trackViewContent(item?: Partial<TrackingItem>, currency = "NGN") {
  if (typeof window === "undefined") return;

  const contentId = item?.id || "ICE-JETPRO-48V";
  const contentName = item?.name || "I.C.E JetPro 48V™ Cordless Cleaning Gun Kit";
  const price = item?.price || 85000;

  // Meta Pixel — ViewContent
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "ViewContent", {
      content_name: contentName,
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      value: price,
      currency: currency,
    });
  });

  // TikTok Pixel — ViewContent
  retryTracker(isTtqReady, () => {
    (window as any).ttq.track("ViewContent", {
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      content_name: contentName,
      value: price,
      currency: currency,
      contents: [
        {
          content_id: contentId,
          content_name: contentName,
          quantity: 1,
          price: price,
        },
      ],
    });
  });
}

/**
 * Track AddToCart for both Meta and TikTok.
 */
export function trackAddToCart(item: TrackingItem, currency = "NGN") {
  if (typeof window === "undefined") return;

  const price = item.price || 0;
  const qty = item.quantity || 1;
  const totalValue = price * qty;
  const contentId = item.id || "ICE-JETPRO-48V";
  const contentName = item.name || "I.C.E JetPro 48V™ Kit";

  // Meta Pixel — AddToCart
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "AddToCart", {
      content_name: contentName,
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      value: totalValue,
      currency: currency,
      num_items: qty,
    });
  });

  // TikTok Pixel — AddToCart
  retryTracker(isTtqReady, () => {
    (window as any).ttq.track("AddToCart", {
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      content_name: contentName,
      value: totalValue,
      currency: currency,
      contents: [
        {
          content_id: contentId,
          content_name: contentName,
          quantity: qty,
          price: price,
        },
      ],
    });
  });
}

/**
 * Track InitiateCheckout for both Meta and TikTok.
 * Fired when the user submits the order form.
 *
 * TikTok schema (https://ads.tiktok.com/help/article/standard-events-parameters):
 *  - content_id, content_ids, content_type, content_name, value, currency at root (required for VSA)
 *  - contents: [{ content_id, content_name, quantity, price }]
 */
export function trackInitiateCheckout(
  item: TrackingItem,
  currency: string,
  phone?: string,
  email?: string
) {
  if (typeof window === "undefined") return;

  const price = item.price || 0;
  const qty = item.quantity || 1;
  const totalValue = price * qty;
  const contentId = item.id || "ICE-JETPRO-48V";
  const contentName = item.name || "I.C.E JetPro 48V™ Kit";

  // Meta Pixel — InitiateCheckout
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "InitiateCheckout", {
      content_name: contentName,
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      value: totalValue,
      currency: currency,
      num_items: qty,
    });
  });

  // TikTok Pixel — InitiateCheckout
  retryTracker(isTtqReady, async () => {
    if (phone || email) {
      await identifyTikTokUser(phone, email);
    }

    (window as any).ttq.track("InitiateCheckout", {
      content_id: contentId,
      content_ids: [contentId],
      content_type: "product",
      content_name: contentName,
      value: totalValue,
      currency: currency,
      contents: [
        {
          content_id: contentId,
          content_name: contentName,
          quantity: qty,
          price: price,
        },
      ],
    });
  });
}

/**
 * Track a completed purchase on the Thank You page.
 *
 * Fires:
 *  - Meta Pixel       → Purchase
 *  - TikTok Pixel     → PlaceAnOrder   (address confirmed, COD intent)
 *  - TikTok Pixel     → CompletePayment (COD = committed payment intent)
 *
 * TikTok schema: root parameters for Video Shopping Ads + contents[] + Advanced Matching.
 */
export function trackPurchase(data: PurchasePayload) {
  if (typeof window === "undefined") return;

  const value = data.amount || 0;
  const currency = data.currency || "NGN";
  const productSku = "ICE-JETPRO-48V";
  const contentName = data.packName || "I.C.E JetPro 48V™ Kit";
  const transactionId = data.orderId || `ICE-${Date.now()}`;

  // Meta Pixel — Purchase
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "Purchase", {
      content_name: contentName,
      content_type: "product",
      content_id: productSku,
      content_ids: [productSku],
      value: value,
      currency: currency,
      num_items: 1,
      order_id: transactionId,
    });
  });

  // TikTok Pixel — PlaceAnOrder + CompletePayment
  retryTracker(isTtqReady, async () => {
    // 1. Identify user for Advanced Matching (ensures phone/email are postbacked)
    if (data.phone || data.email) {
      await identifyTikTokUser(data.phone, data.email);
    }

    const tiktokPayload = {
      content_id: productSku,
      content_ids: [productSku],
      content_type: "product",
      content_name: contentName,
      value: value,
      currency: currency,
      order_id: transactionId,
      contents: [
        {
          content_id: productSku,
          content_name: contentName,
          quantity: 1,
          price: value,
        },
      ],
    };

    (window as any).ttq.track("PlaceAnOrder", tiktokPayload);
    (window as any).ttq.track("CompletePayment", tiktokPayload);
  });
}
