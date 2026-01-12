import { useEffect, useRef } from 'react';
import { register, unregister, type ShortcutEvent } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function useGlobalShortcut(
  shortcut: string,
  callback: () => void,
  enabled = true
) {
  const callbackRef = useRef(callback);
  const currentShortcutRef = useRef<string | null>(null);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled || !shortcut) return;

    let isCancelled = false;

    const setup = async () => {
      // Unregister old shortcut if different
      if (currentShortcutRef.current && currentShortcutRef.current !== shortcut) {
        try {
          await unregister(currentShortcutRef.current);
          console.log(`Unregistered old shortcut: ${currentShortcutRef.current}`);
        } catch (err) {
          console.error(`Failed to unregister old shortcut:`, err);
        }
      }

      if (isCancelled) return;

      try {
        await register(shortcut, (event: ShortcutEvent) => {
          // Only trigger on key press, not release
          if (event.state === 'Pressed') {
            callbackRef.current();
          }
        });
        currentShortcutRef.current = shortcut;
        console.log(`Registered shortcut: ${shortcut}`);
      } catch (err) {
        console.error(`Failed to register shortcut ${shortcut}:`, err);
      }
    };

    setup();

    return () => {
      isCancelled = true;
      if (currentShortcutRef.current) {
        unregister(currentShortcutRef.current).catch(console.error);
        currentShortcutRef.current = null;
      }
    };
  }, [shortcut, enabled]);
}

export async function showWindow() {
  const window = getCurrentWindow();
  await window.show();
  await window.setFocus();
}

export async function hideWindow() {
  const window = getCurrentWindow();
  await window.hide();
}

export async function toggleWindow() {
  const window = getCurrentWindow();
  const visible = await window.isVisible();
  if (visible) {
    await window.hide();
  } else {
    await window.show();
    await window.setFocus();
  }
}
