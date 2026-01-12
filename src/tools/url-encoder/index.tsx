import { useState, useCallback, useMemo, useEffect } from 'react';
import { Copy, Check, Lock, Unlock, AlertCircle, List, Clipboard } from 'lucide-react';
import { MainContent } from '../../components/Layout';
import { useClipboard } from '../../hooks/useClipboard';
import { useAutoClipboard } from '../../hooks/useAutoClipboard';
import { encodeUrl, decodeUrl, parseUrlParams } from './utils';

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [showParams, setShowParams] = useState(false);
  const { copy, copied } = useClipboard();
  const { clipboardContent, shouldAutoFill, clearAutoFill, detectedType } = useAutoClipboard('url');

  // Auto-fill from clipboard when content matches
  useEffect(() => {
    if (shouldAutoFill && clipboardContent && !input) {
      setInput(clipboardContent);
      clearAutoFill();
    }
  }, [shouldAutoFill, clipboardContent, input, clearAutoFill]);

  const handlePasteFromClipboard = useCallback(() => {
    if (clipboardContent) {
      setInput(clipboardContent);
    }
  }, [clipboardContent]);

  const parsedParams = useMemo(() => {
    try {
      return parseUrlParams(input);
    } catch {
      return {};
    }
  }, [input]);

  const hasParams = Object.keys(parsedParams).length > 0;

  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const encoded = encodeUrl(input);
      setOutput(encoded);
      setError(null);
      setMode('encode');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Encoding failed');
      setOutput('');
    }
  }, [input]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const decoded = decodeUrl(input);
      setOutput(decoded);
      setError(null);
      setMode('decode');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Decoding failed');
      setOutput('');
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      copy(output);
    }
  }, [output, copy]);

  const handleSwap = useCallback(() => {
    if (output) {
      setInput(output);
      setOutput('');
      setError(null);
    }
  }, [output]);

  return (
    <MainContent
      title="URL Encoder"
      description="Encode and decode URLs"
    >
      <div className="h-full flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePasteFromClipboard}
            disabled={!clipboardContent}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="btn-paste"
            title={clipboardContent ? `Paste from clipboard (${detectedType})` : 'Clipboard empty'}
          >
            <Clipboard className="w-4 h-4" />
            Paste
          </button>
          <div className="w-px h-6 bg-[hsl(var(--border))]" />
          <button
            onClick={handleEncode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-opacity ${
              mode === 'encode'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
            } hover:opacity-90`}
            data-testid="btn-encode"
          >
            <Lock className="w-4 h-4" />
            Encode
          </button>
          <button
            onClick={handleDecode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-opacity ${
              mode === 'decode'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
            } hover:opacity-90`}
            data-testid="btn-decode"
          >
            <Unlock className="w-4 h-4" />
            Decode
          </button>
          <button
            onClick={() => setShowParams(!showParams)}
            disabled={!hasParams}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-opacity ${
              showParams
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
            } hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
            data-testid="btn-params"
          >
            <List className="w-4 h-4" />
            Parse Params
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSwap}
            disabled={!output}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↓ Use as Input
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="btn-copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-500/10 text-red-500 border border-red-500/20"
            data-testid="error-message"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Parsed params panel */}
        {showParams && hasParams && (
          <div className="p-4 rounded-md border bg-[hsl(var(--muted))]">
            <h3 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Parsed Parameters
            </h3>
            <div className="space-y-1">
              {Object.entries(parsedParams).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-sm font-mono">
                  <span className="text-[hsl(var(--primary))]">{key}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">=</span>
                  <span className="text-[hsl(var(--foreground))]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text areas */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <div className="flex flex-col min-h-0">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode or URL to decode..."
              className="flex-1 p-3 text-sm font-mono rounded-md border bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              data-testid="input-textarea"
            />
          </div>
          <div className="flex flex-col min-h-0">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
              Output
            </label>
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="flex-1 p-3 text-sm font-mono rounded-md border bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] resize-none"
              data-testid="output-textarea"
            />
          </div>
        </div>
      </div>
    </MainContent>
  );
}
