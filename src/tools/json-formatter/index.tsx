import { useState, useCallback, useEffect } from 'react';
import { Copy, Check, Wand2, Minimize2, ArrowDownUp, AlertCircle, Clipboard } from 'lucide-react';
import { MainContent } from '../../components/Layout';
import { CodeEditor } from '../../components/Editor/CodeEditor';
import { useClipboard } from '../../hooks/useClipboard';
import { useAutoClipboard } from '../../hooks/useAutoClipboard';
import { formatJson, minifyJson, validateJson, sortJsonKeys } from './utils';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { copy, copied } = useClipboard();
  const { clipboardContent, shouldAutoFill, clearAutoFill, detectedType } = useAutoClipboard('json');

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

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    const validation = validateJson(input);
    if (!validation.valid) {
      setError(validation.error);
      setOutput('');
      return;
    }

    try {
      const formatted = formatJson(input);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setOutput('');
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    const validation = validateJson(input);
    if (!validation.valid) {
      setError(validation.error);
      setOutput('');
      return;
    }

    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setOutput('');
    }
  }, [input]);

  const handleSort = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    const validation = validateJson(input);
    if (!validation.valid) {
      setError(validation.error);
      setOutput('');
      return;
    }

    try {
      const sorted = sortJsonKeys(input);
      setOutput(sorted);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setOutput('');
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      copy(output);
    }
  }, [output, copy]);

  return (
    <MainContent
      title="JSON Formatter"
      description="Format, minify, and validate JSON"
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
            onClick={handleFormat}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
            data-testid="btn-format"
          >
            <Wand2 className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={handleMinify}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity"
            data-testid="btn-minify"
          >
            <Minimize2 className="w-4 h-4" />
            Minify
          </button>
          <button
            onClick={handleSort}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity"
            data-testid="btn-sort"
          >
            <ArrowDownUp className="w-4 h-4" />
            Sort Keys
          </button>
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="btn-copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span data-testid="copy-success">Copied!</span>
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

        {/* Editors */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <div className="flex flex-col min-h-0">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
              Input
            </label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="json"
              className="flex-1"
              data-testid="input-editor"
            />
          </div>
          <div className="flex flex-col min-h-0">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
              Output
            </label>
            <CodeEditor
              value={output}
              language="json"
              readOnly
              className="flex-1"
              data-testid="output-editor"
            />
          </div>
        </div>
      </div>
    </MainContent>
  );
}
