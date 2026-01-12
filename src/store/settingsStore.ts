import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  toggleWindowShortcut: string;
  setToggleWindowShortcut: (shortcut: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      toggleWindowShortcut: 'CommandOrControl+Alt+D',
      setToggleWindowShortcut: (shortcut) => set({ toggleWindowShortcut: shortcut }),
    }),
    {
      name: 'devtools-settings',
    }
  )
);

// Convert keyboard event to shortcut string
export function keyEventToShortcut(e: KeyboardEvent): string | null {
  // Ignore if only modifier keys are pressed
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
    return null;
  }

  const parts: string[] = [];

  if (e.metaKey || e.ctrlKey) {
    parts.push('CommandOrControl');
  }
  if (e.altKey) {
    parts.push('Alt');
  }
  if (e.shiftKey) {
    parts.push('Shift');
  }

  // Need at least one modifier
  if (parts.length === 0) {
    return null;
  }

  // Get the key
  let key = e.key.toUpperCase();

  // Handle special keys
  if (e.code.startsWith('Digit')) {
    key = e.code.replace('Digit', '');
  } else if (e.code.startsWith('Key')) {
    key = e.code.replace('Key', '');
  } else if (key === ' ') {
    key = 'Space';
  }

  parts.push(key);

  return parts.join('+');
}

// Convert shortcut string to display format
export function shortcutToDisplay(shortcut: string): string {
  return shortcut
    .replace('CommandOrControl', '⌘')
    .replace('Alt', '⌥')
    .replace('Shift', '⇧')
    .replace('Control', '⌃')
    .replace(/\+/g, ' + ');
}
