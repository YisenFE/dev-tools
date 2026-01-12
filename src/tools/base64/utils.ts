export function encodeBase64(input: string): string {
  // Handle Unicode characters properly
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  return btoa(binString);
}

export function decodeBase64(input: string): string {
  try {
    const binString = atob(input.trim());
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch {
    throw new Error('Invalid Base64 input');
  }
}

export function isValidBase64(input: string): boolean {
  if (!input.trim()) return true;

  // Base64 regex pattern
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const trimmed = input.trim();

  // Check if length is valid (must be multiple of 4)
  if (trimmed.length % 4 !== 0) return false;

  return base64Regex.test(trimmed);
}

export function detectInputType(input: string): 'base64' | 'text' | 'unknown' {
  if (!input.trim()) return 'unknown';

  // Try to detect if input is likely Base64
  if (isValidBase64(input)) {
    try {
      decodeBase64(input);
      // If it decodes successfully and contains mostly printable chars, likely Base64
      return 'base64';
    } catch {
      return 'text';
    }
  }

  return 'text';
}
