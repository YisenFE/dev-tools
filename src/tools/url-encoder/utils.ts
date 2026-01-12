export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error('Invalid URL-encoded input');
  }
}

export function encodeUrlFull(input: string): string {
  // Encode the entire URL including special characters
  return encodeURI(input);
}

export function decodeUrlFull(input: string): string {
  try {
    return decodeURI(input);
  } catch {
    throw new Error('Invalid URL input');
  }
}

export interface UrlParams {
  [key: string]: string;
}

export function parseUrlParams(input: string): UrlParams {
  const params: UrlParams = {};

  // Remove leading ? if present
  const queryString = input.startsWith('?') ? input.slice(1) : input;

  if (!queryString.trim()) return params;

  // Handle full URL
  let query = queryString;
  if (queryString.includes('?')) {
    query = queryString.split('?')[1] || '';
  }

  // Remove hash if present
  query = query.split('#')[0];

  const pairs = query.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [key, ...valueParts] = pair.split('=');
    const value = valueParts.join('='); // Handle values containing =
    if (key) {
      try {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      } catch {
        params[key] = value || '';
      }
    }
  }

  return params;
}

export function buildUrlParams(params: UrlParams): string {
  const pairs = Object.entries(params)
    .filter(([key]) => key.trim())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

  return pairs.join('&');
}
