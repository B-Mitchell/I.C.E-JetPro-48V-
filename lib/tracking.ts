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

// ─── Advanced Matching helpers ────────────────────────────────────────────────

/**
 * Strip everything except digits — TikTok wants E.164 digits only (no + or spaces).
 * e.g. "+234 0801 234 5678" → "23408012345678"
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/**
 * Call ttq.identify() with hashed user data before conversion events.
 * This enables TikTok Advanced Matching, which improves attribution accuracy
 * and resolves the "Missing email and phone number" SDK warning.
 *
 * Docs: https://ads.tiktok.com/marketing_api/docs?id=1701890972946433
 */
function identifyTikTokUser(phone?: string, email?: string) {
  if (typeof window === "undefined") return;
  if (!isTtqReady()) return;

  const userData: Record<string, string> = {};
  if (phone) {
    const normalized = normalizePhone(phone);
    if (normalized.length >= 7) userData.phone_number = normalized;
  }
  if (email) {
    userData.email = email.toLowerCase().trim();
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
 * Track InitiateCheckout for both Meta and TikTok.
 * Fired when the user submits the order form.
 *
 * TikTok schema (https://ads.tiktok.com/help/article/standard-events-parameters):
 *  - value, currency → top-level
 *  - content_type, content_id, content_name, quantity, price → inside contents[]
 */
export function trackInitiateCheckout(
  item: TrackingItem,
  currency: string,
  phone?: string
) {
  if (typeof window === "undefined") return;

  // Identify the user for Advanced Matching before firing events
  if (phone) identifyTikTokUser(phone);

  const price = item.price || 0;
  const qty = item.quantity || 1;
  const totalValue = price * qty;

  // Meta Pixel — InitiateCheckout
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "InitiateCheckout", {
      content_name: item.name,
      content_ids: [item.id],
      content_type: "product",
      value: totalValue,
      currency: currency,
      num_items: qty,
    });
  });

  // TikTok Pixel — InitiateCheckout
  // Confirmed schema (TikTok docs):
  //   content_type → root level
  //   content_id, content_name, quantity, price → inside contents[]
  //   value, currency → root level
  retryTracker(isTtqReady, () => {
    (window as any).ttq.track("InitiateCheckout", {
      content_type: "product",
      value: totalValue,
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
 * TikTok schema: value + currency are top-level; product details go in contents[].
 */
export function trackPurchase(data: PurchasePayload) {
  if (typeof window === "undefined") return;

  const value = data.amount || 0;
  const currency = data.currency || "NGN";
  const contentId = data.orderId || "ICE-JETPRO-48V";
  const contentName = data.packName || "I.C.E JetPro 48V™ Kit";

  // Identify the user for Advanced Matching before firing conversion events
  if (data.phone || data.email) {
    identifyTikTokUser(data.phone, data.email);
  }

  // Meta Pixel — Purchase
  retryTracker(isFbqReady, () => {
    (window as any).fbq("track", "Purchase", {
      content_name: contentName,
      content_type: "product",
      content_ids: [contentId],
      value: value,
      currency: currency,
      num_items: 1,
    });
  });

  // TikTok Pixel — PlaceAnOrder + CompletePayment
  // Confirmed schema (TikTok docs):
  //   content_type → root level
  //   content_id, content_name, quantity, price → inside contents[]
  //   value, currency → root level
  retryTracker(isTtqReady, () => {
    const tiktokPayload = {
      content_type: "product",
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

    (window as any).ttq.track("PlaceAnOrder", tiktokPayload);
    (window as any).ttq.track("CompletePayment", tiktokPayload);
  });
}
