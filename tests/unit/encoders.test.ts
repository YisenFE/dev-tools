import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64, isValidBase64 } from '@/tools/base64/utils';
import { encodeUrl, decodeUrl, parseUrlParams, buildUrlParams } from '@/tools/url-encoder/utils';
import { encodeHtml, decodeHtml } from '@/tools/html-encoder/utils';

describe('Base64', () => {
  describe('encodeBase64', () => {
    it('encodes simple text', () => {
      expect(encodeBase64('Hello')).toBe('SGVsbG8=');
    });

    it('encodes empty string', () => {
      expect(encodeBase64('')).toBe('');
    });

    it('encodes Unicode characters', () => {
      const encoded = encodeBase64('Hello, 世界!');
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe('Hello, 世界!');
    });

    it('encodes special characters', () => {
      const text = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      expect(decodeBase64(encodeBase64(text))).toBe(text);
    });
  });

  describe('decodeBase64', () => {
    it('decodes valid Base64', () => {
      expect(decodeBase64('SGVsbG8=')).toBe('Hello');
    });

    it('decodes empty string', () => {
      expect(decodeBase64('')).toBe('');
    });

    it('throws on invalid Base64', () => {
      expect(() => decodeBase64('not valid base64!')).toThrow();
    });
  });

  describe('isValidBase64', () => {
    it('validates correct Base64', () => {
      expect(isValidBase64('SGVsbG8=')).toBe(true);
    });

    it('validates empty string', () => {
      expect(isValidBase64('')).toBe(true);
    });

    it('rejects invalid Base64', () => {
      expect(isValidBase64('Hello World')).toBe(false);
    });
  });
});

describe('URL Encoder', () => {
  describe('encodeUrl', () => {
    it('encodes spaces', () => {
      expect(encodeUrl('hello world')).toBe('hello%20world');
    });

    it('encodes special characters', () => {
      expect(encodeUrl('a=1&b=2')).toBe('a%3D1%26b%3D2');
    });

    it('encodes Unicode', () => {
      const encoded = encodeUrl('你好');
      expect(decodeUrl(encoded)).toBe('你好');
    });
  });

  describe('decodeUrl', () => {
    it('decodes percent-encoded string', () => {
      expect(decodeUrl('hello%20world')).toBe('hello world');
    });

    it('throws on invalid encoding', () => {
      expect(() => decodeUrl('%')).toThrow();
    });
  });

  describe('parseUrlParams', () => {
    it('parses simple params', () => {
      const params = parseUrlParams('?name=test&value=123');
      expect(params).toEqual({ name: 'test', value: '123' });
    });

    it('parses without leading ?', () => {
      const params = parseUrlParams('name=test&value=123');
      expect(params).toEqual({ name: 'test', value: '123' });
    });

    it('handles empty value', () => {
      const params = parseUrlParams('name=&value=123');
      expect(params).toEqual({ name: '', value: '123' });
    });

    it('handles encoded values', () => {
      const params = parseUrlParams('name=hello%20world');
      expect(params).toEqual({ name: 'hello world' });
    });

    it('parses full URL', () => {
      const params = parseUrlParams('https://example.com?foo=bar&baz=qux');
      expect(params).toEqual({ foo: 'bar', baz: 'qux' });
    });
  });

  describe('buildUrlParams', () => {
    it('builds query string', () => {
      const result = buildUrlParams({ name: 'test', value: '123' });
      expect(result).toContain('name=test');
      expect(result).toContain('value=123');
    });

    it('encodes special characters', () => {
      const result = buildUrlParams({ name: 'hello world' });
      expect(result).toBe('name=hello%20world');
    });
  });
});

describe('HTML Encoder', () => {
  describe('encodeHtml', () => {
    it('encodes angle brackets', () => {
      expect(encodeHtml('<div>')).toBe('&lt;div&gt;');
    });

    it('encodes quotes', () => {
      expect(encodeHtml('"hello"')).toBe('&quot;hello&quot;');
    });

    it('encodes ampersand', () => {
      expect(encodeHtml('a & b')).toBe('a &amp; b');
    });

    it('encodes multiple characters', () => {
      expect(encodeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });
  });

  describe('decodeHtml', () => {
    it('decodes named entities', () => {
      expect(decodeHtml('&lt;div&gt;')).toBe('<div>');
    });

    it('decodes numeric entities', () => {
      expect(decodeHtml('&#60;div&#62;')).toBe('<div>');
    });

    it('decodes hex entities', () => {
      expect(decodeHtml('&#x3C;div&#x3E;')).toBe('<div>');
    });

    it('decodes special entities', () => {
      expect(decodeHtml('&nbsp;&copy;&reg;')).toBe(' ©®');
    });

    it('round-trips correctly', () => {
      const original = '<div class="test">Hello & Goodbye</div>';
      const encoded = encodeHtml(original);
      const decoded = decodeHtml(encoded);
      expect(decoded).toBe(original);
    });
  });
});
