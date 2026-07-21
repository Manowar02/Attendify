import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, School2, Clock3, X, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Today', icon: LayoutDashboard, end: true },
  { to: '/timetable', label: 'Timetable', icon: Clock3 },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/subjects', label: 'Subjects', icon: School2 },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-ink-950/80 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(16,24,40,0.08)] transition-transform duration-300 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo + Close */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              <span className="text-slate-900 dark:text-white">Attend</span><span className="text-emerald-500">ify</span>
            </h2>
          </div>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 dark:bg-ink-900 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-ink-800 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
          onClick={onClose}
          type="button"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="mb-3 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-ink-900 hover:text-slate-700 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`grid h-8 w-8 place-items-center rounded-lg transition ${isActive ? 'bg-white dark:bg-emerald-500/20 shadow-sm' : 'bg-slate-50 dark:bg-ink-900 group-hover:bg-slate-100 dark:group-hover:bg-ink-800'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User card + Logout */}
      <div className="mt-auto space-y-3">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-ink-900 hover:text-slate-900 dark:hover:text-slate-200"
          type="button"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 dark:bg-ink-900">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </div>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-ink-900 p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Student'}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email || 'student@mail.com'}</p>
            </div>
          </div>
        </div>
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
          onClick={logout}
          type="button"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 dark:bg-ink-900">
            <LogOut className="h-4 w-4" />
          </div>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
