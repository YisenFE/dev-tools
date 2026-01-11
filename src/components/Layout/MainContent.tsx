import { ReactNode } from 'react';

interface MainContentProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function MainContent({ title, description, children }: MainContentProps) {
  return (
    <main
      className="flex-1 h-screen overflow-hidden flex flex-col"
      data-testid="main-content"
    >
      {/* Header */}
      <header className="px-6 py-4 border-b bg-[hsl(var(--background))]">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {description}
          </p>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </main>
  );
}
