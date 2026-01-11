export interface ValidationResult {
  valid: boolean;
  error: string | null;
  position?: { line: number; column: number };
}

export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJson(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: true, error: null };
  }

  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    if (e instanceof SyntaxError) {
      // Try to extract position from error message
      const match = e.message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const { line, column } = getLineAndColumn(input, position);
        return {
          valid: false,
          error: e.message,
          position: { line, column },
        };
      }
      return { valid: false, error: e.message };
    }
    return { valid: false, error: 'Unknown error' };
  }
}

function getLineAndColumn(text: string, position: number): { line: number; column: number } {
  const lines = text.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

export function sortJsonKeys(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  const sorted = sortObjectKeys(parsed);
  return JSON.stringify(sorted, null, indent);
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    Object.keys(obj as Record<string, unknown>)
      .sort()
      .forEach((key) => {
        sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      });
    return sorted;
  }
  return obj;
}
