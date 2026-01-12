import { useState, useEffect, useCallback } from 'react';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { listen } from '@tauri-apps/api/event';

export type ContentType = 'json' | 'base64' | 'url' | 'html' | 'unknown';

// Content type detection utilities
export function detectContentType(text: string): ContentType {
  if (!text || text.trim().length === 0) return 'unknown';

  const trimmed = text.trim();

  // Check for JSON
  if (isLikelyJson(trimmed)) return 'json';

  // Check for URL
  if (isLikelyUrl(trimmed)) return 'url';

  // Check for HTML
  if (isLikelyHtml(trimmed)) return 'html';

  // Check for Base64
  if (isLikelyBase64(trimmed)) return 'base64';

  return 'unknown';
}

function isLikelyJson(text: string): boolean {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

function isLikelyUrl(text: string): boolean {
  // Check for URL-encoded content or URLs
  if (text.includes('%20') || text.includes('%3A') || text.includes('%2F')) {
    return true;
  }
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isLikelyHtml(text: string): boolean {
  // Check for HTML entities or tags
  return (
    text.includes('&lt;') ||
    text.includes('&gt;') ||
    text.includes('&amp;') ||
    text.includes('&quot;') ||
    /<[a-zA-Z][^>]*>/.test(text)
  );
}

function isLikelyBase64(text: string): boolean {
  // Base64 pattern: only A-Z, a-z, 0-9, +, /, and = padding
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  // Must be at least 4 characters and length divisible by 4 (with padding)
  if (text.length < 4) return false;
  if (!base64Regex.test(text)) return false;

  // Try to decode and check if it produces valid UTF-8
  try {
    const decoded = atob(text);
    // Check if decoded content is mostly printable
    const printableRatio =
      decoded.split('').filter((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127).length /
      decoded.length;
    return printableRatio > 0.8;
  } catch {
    return false;
  }
}

export function useAutoClipboard(expectedType?: ContentType) {
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<ContentType>('unknown');
  const [shouldAutoFill, setShouldAutoFill] = useState(false);

  const checkClipboard = useCallback(async () => {
    try {
      const text = await readText();
      if (text) {
        setClipboardContent(text);
        const type = detectContentType(text);
        setDetectedType(type);
        // Auto-fill if type matches expected type
        if (expectedType && type === expectedType) {
          setShouldAutoFill(true);
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }, [expectedType]);

  // Check clipboard on mount and when window gains focus
  useEffect(() => {
    checkClipboard();

    const unlisten = listen('tauri://focus', () => {
      checkClipboard();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [checkClipboard]);

  const clearAutoFill = useCallback(() => {
    setShouldAutoFill(false);
  }, []);

  return {
    clipboardContent,
    detectedType,
    shouldAutoFill,
    clearAutoFill,
    checkClipboard,
  };
}
