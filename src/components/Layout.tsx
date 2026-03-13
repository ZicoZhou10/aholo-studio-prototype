import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Upload, Settings, Sparkles, Menu, X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatNumber } from '../utils/formatters';

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/explore', icon: Compass, label: '探索' },
  { to: '/deploy', icon: Upload, label: '部署能力' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export default function Layout() {
  const { sidebarCollapsed, toggleSidebar, currentUser } = useAppStore();
  const location = useLocation();

  // Build page uses full-width layout without sidebar
  const isBuildPage = location.pathname.startsWith('/build');
  if (isBuildPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border-light bg-surface transition-all duration-200 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border-light">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-text text-sm tracking-tight">Aholo Studio</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-light hover:text-text'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={18} />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User / collapse */}
        <div className="border-t border-border-light p-3">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 px-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{currentUser.name}</div>
                <div className="text-xs text-text-muted">{formatNumber(currentUser.tokenBalance)} 核豆</div>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-1.5 rounded-lg text-text-muted hover:bg-surface-light hover:text-text transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-surface-light">
        <Outlet />
      </main>
    </div>
  );
}
