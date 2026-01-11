import { create } from 'zustand';

export interface Tool {
  id: string;
  name: string;
  icon: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    id: 'json',
    name: 'JSON Formatter',
    icon: 'Braces',
    path: '/json',
    description: 'Format, minify, and validate JSON',
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: 'Binary',
    path: '/base64',
    description: 'Encode and decode Base64',
  },
  {
    id: 'url',
    name: 'URL Encoder',
    icon: 'Link',
    path: '/url',
    description: 'Encode and decode URLs',
  },
  {
    id: 'html',
    name: 'HTML Encoder',
    icon: 'Code',
    path: '/html',
    description: 'Encode and decode HTML entities',
  },
];

interface ToolState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTools: () => Tool[];
}

export const useToolStore = create<ToolState>((set, get) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filteredTools: () => {
    const query = get().searchQuery.toLowerCase();
    if (!query) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
    );
  },
}));
