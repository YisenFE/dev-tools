import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'json' | 'text';
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

// Dark theme
const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: 'hsl(0 0% 7%)',
    color: 'hsl(0 0% 98%)',
  },
  '.cm-content': {
    caretColor: 'hsl(217.2 91.2% 59.8%)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'hsl(217.2 91.2% 59.8%)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'hsl(217.2 32.6% 25%)',
  },
  '.cm-activeLine': {
    backgroundColor: 'hsl(0 0% 12%)',
  },
  '.cm-gutters': {
    backgroundColor: 'hsl(0 0% 7%)',
    color: 'hsl(0 0% 45%)',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'hsl(0 0% 12%)',
  },
}, { dark: true });

// Light theme
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'hsl(0 0% 100%)',
    color: 'hsl(0 0% 3.9%)',
  },
  '.cm-content': {
    caretColor: 'hsl(221.2 83.2% 53.3%)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'hsl(221.2 83.2% 53.3%)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'hsl(210 40% 90%)',
  },
  '.cm-activeLine': {
    backgroundColor: 'hsl(0 0% 96%)',
  },
  '.cm-gutters': {
    backgroundColor: 'hsl(0 0% 100%)',
    color: 'hsl(0 0% 45%)',
    border: 'none',
    borderRight: '1px solid hsl(0 0% 89.8%)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'hsl(0 0% 96%)',
  },
});

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder,
  className = '',
  'data-testid': testId,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
      ]),
      isDark ? darkTheme : lightTheme,
      EditorView.lineWrapping,
    ];

    if (language === 'json') {
      extensions.push(json());
      extensions.push(linter(jsonParseLinter()));
      extensions.push(lintGutter());
    }

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    if (onChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      );
    }

    if (placeholder) {
      extensions.push(EditorView.contentAttributes.of({ 'aria-placeholder': placeholder }));
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language, readOnly]);

  // Update content when value prop changes
  useEffect(() => {
    const view = viewRef.current;
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // Recreate editor when theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const view = viewRef.current;
      if (view && editorRef.current) {
        const currentValue = view.state.doc.toString();
        view.destroy();

        const isDark = document.documentElement.classList.contains('dark');
        const extensions = [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
          ]),
          isDark ? darkTheme : lightTheme,
          EditorView.lineWrapping,
        ];

        if (language === 'json') {
          extensions.push(json());
          extensions.push(linter(jsonParseLinter()));
          extensions.push(lintGutter());
        }

        if (readOnly) {
          extensions.push(EditorState.readOnly.of(true));
        }

        if (onChange) {
          extensions.push(
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                onChange(update.state.doc.toString());
              }
            })
          );
        }

        const state = EditorState.create({
          doc: currentValue,
          extensions,
        });

        viewRef.current = new EditorView({
          state,
          parent: editorRef.current,
        });
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [language, readOnly, onChange]);

  return (
    <div
      ref={editorRef}
      className={`border rounded-md overflow-hidden ${className}`}
      data-testid={testId}
    />
  );
}
