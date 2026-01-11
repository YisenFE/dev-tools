import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export { Sidebar } from './Sidebar';
export { MainContent } from './MainContent';
