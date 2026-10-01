// Change this before you publish. It must match tools/generate_licenses.py.
const LICENSE_SECRET = "replydock-change-this-secret-before-publish";

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeKey(input) {
  return String(input || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function verifyLicense(input) {
  const compact = normalizeKey(input);
  if (compact.length < 16 || !compact.startsWith("RD")) return false;
  const body = compact.slice(2, 14);
  const sig = compact.slice(14, 22);
  const expected = (await hmacHex(LICENSE_SECRET, body.toLowerCase())).slice(0, 8).toUpperCase();
  return sig === expected;
}

function formatKey(input) {
  const compact = normalizeKey(input);
  if (compact.length < 22) return String(input || "").trim().toUpperCase();
  return `RD-${compact.slice(2, 6)}-${compact.slice(6, 10)}-${compact.slice(10, 14)}-${compact.slice(14, 22)}`;
}
