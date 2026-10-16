const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let value = "";
  bytes.forEach((byte) => (value += String.fromCharCode(byte)));
  return btoa(value);
}

export function createSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toBase64(bytes);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 310_000, hash: "SHA-256" },
    material,
    256,
  );
  return toBase64(new Uint8Array(hash));
}

export async function passwordMatches(password: string, salt: string, expectedHash: string) {
  const actual = await hashPassword(password, salt);
  if (actual.length !== expectedHash.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  return difference === 0;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
