import { useEffect, useRef } from 'react';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function useGlobalShortcut(
  shortcut: string,
  callback: () => void,
  enabled = true
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    let registered = false;

    const setup = async () => {
      try {
        await register(shortcut, () => {
          callbackRef.current();
        });
        registered = true;
      } catch (err) {
        console.error(`Failed to register shortcut ${shortcut}:`, err);
      }
    };

    setup();

    return () => {
      if (registered) {
        unregister(shortcut).catch(console.error);
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
