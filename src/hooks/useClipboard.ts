import { useState, useCallback } from 'react';
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [timeout]);

  const read = useCallback(async (): Promise<string | null> => {
    try {
      const text = await readText();
      return text;
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      return null;
    }
  }, []);

  return { copy, copied, read };
}
