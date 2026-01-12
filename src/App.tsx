import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Layout } from './components/Layout';
import { JsonFormatter } from './tools/json-formatter';
import { Base64Tool } from './tools/base64';
import { UrlEncoder } from './tools/url-encoder';
import { HtmlEncoder } from './tools/html-encoder';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const toggleWindowShortcut = useSettingsStore((state) => state.toggleWindowShortcut);

  // Restore saved shortcut on startup
  useEffect(() => {
    const restoreShortcut = async () => {
      try {
        // If user has a custom saved shortcut, update Rust backend
        const defaultShortcut = 'CommandOrControl+Alt+D';
        if (toggleWindowShortcut && toggleWindowShortcut !== defaultShortcut) {
          await invoke('update_shortcut', { shortcutStr: toggleWindowShortcut });
          console.log('Restored saved shortcut:', toggleWindowShortcut);
        }
      } catch (err) {
        console.error('Failed to restore shortcut:', err);
      }
    };
    restoreShortcut();
  }, []); // Only run once on mount

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/json" replace />} />
          <Route path="/json" element={<JsonFormatter />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/url" element={<UrlEncoder />} />
          <Route path="/html" element={<HtmlEncoder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
