import { NavLink } from 'react-router-dom';
import {
  Search,
  Braces,
  Binary,
  Link,
  Code,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useToolStore } from '../../store/toolStore';
import { useThemeStore } from '../../store/themeStore';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  Binary,
  Link,
  Code,
};

export function Sidebar() {
  const { searchQuery, setSearchQuery, filteredTools } = useToolStore();
  const { theme, setTheme } = useThemeStore();

  const displayTools = filteredTools();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <aside
      className="h-screen flex flex-col bg-[hsl(var(--muted))] border-r"
      style={{ width: 'var(--sidebar-width)' }}
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          DevTools
        </h1>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Tools List */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {displayTools.map((tool) => {
            const Icon = iconMap[tool.icon] || Braces;
            return (
              <li key={tool.id}>
                <NavLink
                  to={tool.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                    }`
                  }
                  data-testid={`tool-${tool.id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tool.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with theme toggle and shortcut hint */}
      <div className="p-3 border-t space-y-2">
        <button
          onClick={cycleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
          data-testid="theme-toggle"
        >
          <ThemeIcon className="w-4 h-4" />
          <span className="capitalize">{theme} theme</span>
        </button>
        <div className="px-3 py-1 text-xs text-[hsl(var(--muted-foreground))]" data-testid="shortcut-hint">
          <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--accent))] font-mono">⌘</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--accent))] font-mono">⇧</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--accent))] font-mono">D</kbd>
          <span className="ml-2">Toggle window</span>
        </div>
      </div>
    </aside>
  );
}
