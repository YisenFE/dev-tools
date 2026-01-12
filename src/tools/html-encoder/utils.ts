const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const reverseHtmlEntities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&#x2F;': '/',
  '&#47;': '/',
  '&#x60;': '`',
  '&#96;': '`',
  '&#x3D;': '=',
  '&#61;': '=',
  '&nbsp;': ' ',
  '&#160;': ' ',
  '&copy;': '©',
  '&#169;': '©',
  '&reg;': '®',
  '&#174;': '®',
  '&trade;': '™',
  '&#8482;': '™',
};

export function encodeHtml(input: string): string {
  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

export function decodeHtml(input: string): string {
  // First, decode named and numeric entities we know
  let result = input;

  // Decode known named entities
  for (const [entity, char] of Object.entries(reverseHtmlEntities)) {
    result = result.split(entity).join(char);
  }

  // Decode numeric entities (&#123; or &#x7B;)
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return result;
}

export function encodeHtmlFull(input: string): string {
  // Encode all non-ASCII characters as well
  return input
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (htmlEntities[char]) {
        return htmlEntities[char];
      }
      if (code > 127) {
        return `&#${code};`;
      }
      return char;
    })
    .join('');
}
