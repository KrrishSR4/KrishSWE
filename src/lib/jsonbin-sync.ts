import type { PortfolioContent } from "./portfolio-data";

export const JSONBIN_BIN_ID = "6afdc1fbffd5d16053cbbc32";
export const JSONBIN_MASTER_KEY = "$2a$10$Mgk/vBXT/n8WwtFITCntU.CnajwO9S8PiGv6cBZF.oukcsf5nWTu6";

const BIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

export type SyncStatus = "idle" | "fetching" | "saving" | "synced" | "error";

/**
 * Fetch latest portfolio content from JSONBin.
 * Works publicly without any secret key!
 */
export async function fetchRemoteContent(): Promise<PortfolioContent | null> {
  try {
    const res = await fetch(`${BIN_URL}/latest`, {
      cache: "no-store",
      headers: {
        "X-Bin-Meta": "false",
      },
    });

    if (!res.ok) {
      console.warn("JSONBin fetch returned status:", res.status);
      return null;
    }

    const data = await res.json();
    const content = (data?.record ?? data) as PortfolioContent;
    if (content && typeof content === "object" && content.identity) {
      return content;
    }
    return null;
  } catch (err) {
    console.warn("Could not fetch remote content from JSONBin:", err);
    return null;
  }
}

/**
 * Push updated portfolio content to JSONBin using the Master Key.
 * Makes changes live for all visitors worldwide!
 */
export async function saveRemoteContent(
  content: PortfolioContent,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_MASTER_KEY,
      },
      body: JSON.stringify(content),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        error: (errJson as { message?: string })?.message || `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, error: msg };
  }
}
