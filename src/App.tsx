import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { JsonFormatter } from './tools/json-formatter';
import { Base64Tool } from './tools/base64';
import { UrlEncoder } from './tools/url-encoder';
import { HtmlEncoder } from './tools/html-encoder';

function App() {
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
