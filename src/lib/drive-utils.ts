/**
 * Google Drive & PDF link handling utilities.
 * Handles automatic conversion between sharing URLs, embed preview URLs, and direct download URLs.
 */

export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/<ID>/ or /file/d/<ID>
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: /document/d/<ID>/ or /presentation/d/<ID>/ or /spreadsheets/d/<ID>/
  const matchDocD = trimmed.match(/\/(?:document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchDocD && matchDocD[1]) return matchDocD[1];

  // Pattern 3: /d/<ID>/ or /d/<ID>
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern 4: ?id=<ID> or &id=<ID>
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1]) return matchId[1];

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return url.match(/\.(jpeg|jpg|png|gif|webp|svg)($|\?)/i) != null;
}

export function isPdfUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.match(/\.pdf($|\?)/i)) return true;
  if (isGoogleDriveUrl(url) && !isImageUrl(url)) return true;
  return false;
}

/**
 * Returns a URL guaranteed to embed cleanly inside an <iframe>.
 * - For Google Drive: transforms to /preview
 * - For standard external or local PDFs: returns direct URL
 */
export function getPdfPreviewUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return url;
}

/**
 * Returns a URL configured for direct download.
 * - For Google Drive: exports as download stream
 * - For local or standard files: returns direct URL
 */
export function getPdfDownloadUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }
  return url;
}

/**
 * Returns a URL for opening the file in Google Drive or a new tab.
 */
export function getExternalViewUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
  }
  return url;
}
