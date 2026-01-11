import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson, sortJsonKeys } from '@/tools/json-formatter/utils';

describe('JSON Formatter', () => {
  const validJson = '{"name":"test","value":123}';
  const invalidJson = '{name: invalid}';
  const nestedJson = '{"b":1,"a":{"d":2,"c":3}}';

  describe('formatJson', () => {
    it('formats JSON with indentation', () => {
      const result = formatJson(validJson);
      expect(result).toContain('\n');
      expect(result).toContain('  '); // 2-space indent
    });

    it('preserves data integrity', () => {
      const result = formatJson(validJson);
      const parsed = JSON.parse(result);
      expect(parsed.name).toBe('test');
      expect(parsed.value).toBe(123);
    });

    it('throws on invalid JSON', () => {
      expect(() => formatJson(invalidJson)).toThrow();
    });
  });

  describe('minifyJson', () => {
    it('removes whitespace', () => {
      const formatted = formatJson(validJson);
      const minified = minifyJson(formatted);
      expect(minified).not.toContain('\n');
      expect(minified).not.toContain('  ');
    });

    it('preserves data integrity', () => {
      const formatted = formatJson(validJson);
      const minified = minifyJson(formatted);
      const parsed = JSON.parse(minified);
      expect(parsed.name).toBe('test');
      expect(parsed.value).toBe(123);
    });

    it('throws on invalid JSON', () => {
      expect(() => minifyJson(invalidJson)).toThrow();
    });
  });

  describe('validateJson', () => {
    it('validates correct JSON', () => {
      const result = validateJson(validJson);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('validates empty string', () => {
      const result = validateJson('');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('validates whitespace-only string', () => {
      const result = validateJson('   ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('detects invalid JSON', () => {
      const result = validateJson(invalidJson);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('detects missing closing brace', () => {
      const result = validateJson('{"name": "test"');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('sortJsonKeys', () => {
    it('sorts object keys alphabetically', () => {
      const result = sortJsonKeys(nestedJson);
      const parsed = JSON.parse(result);
      expect(Object.keys(parsed)).toEqual(['a', 'b']);
    });

    it('sorts nested object keys', () => {
      const result = sortJsonKeys(nestedJson);
      const parsed = JSON.parse(result);
      expect(Object.keys(parsed.a)).toEqual(['c', 'd']);
    });

    it('handles arrays', () => {
      const input = '{"items":[{"b":1,"a":2}]}';
      const result = sortJsonKeys(input);
      const parsed = JSON.parse(result);
      expect(Object.keys(parsed.items[0])).toEqual(['a', 'b']);
    });

    it('throws on invalid JSON', () => {
      expect(() => sortJsonKeys(invalidJson)).toThrow();
    });
  });
});
