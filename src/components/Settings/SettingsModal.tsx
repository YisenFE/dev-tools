import { useState, useEffect, useCallback } from 'react';
import { X, Keyboard } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useSettingsStore, keyEventToShortcut, shortcutToDisplay } from '../../store/settingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { toggleWindowShortcut, setToggleWindowShortcut } = useSettingsStore();
  const [isRecording, setIsRecording] = useState(false);
  const [tempShortcut, setTempShortcut] = useState<string | null>(null);

  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    if (!isRecording) return;

    e.preventDefault();
    e.stopPropagation();

    const shortcut = keyEventToShortcut(e);
    if (shortcut) {
      setTempShortcut(shortcut);
      setIsRecording(false);

      try {
        // Call Rust backend to update the global shortcut
        await invoke('update_shortcut', { shortcutStr: shortcut });
        console.log('Shortcut updated successfully:', shortcut);
        // Only save to store if Rust registration succeeded
        setToggleWindowShortcut(shortcut);
      } catch (err) {
        console.error('Failed to update shortcut:', err);
        // Reset temp shortcut on error
        setTempShortcut(null);
      }
    }
  }, [isRecording, setToggleWindowShortcut]);

  useEffect(() => {
    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRecording, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setTempShortcut(null);
      setIsRecording(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayShortcut = tempShortcut || toggleWindowShortcut;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[hsl(var(--background))] rounded-lg shadow-xl w-full max-w-md mx-4 border border-[hsl(var(--border))]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Shortcut Setting */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]">
              <Keyboard className="w-4 h-4" />
              Toggle Window Shortcut
            </label>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Global shortcut to show/hide the DevTools window
            </p>
            <button
              onClick={() => setIsRecording(true)}
              className={`w-full px-4 py-3 text-sm font-mono rounded-md border transition-colors ${
                isRecording
                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]'
              }`}
            >
              {isRecording ? (
                <span className="animate-pulse">Press any key combination...</span>
              ) : (
                shortcutToDisplay(displayShortcut)
              )}
            </button>
            {isRecording && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Press a key combination with at least one modifier (⌘, ⌥, ⇧, ⌃)
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[hsl(var(--border))] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
