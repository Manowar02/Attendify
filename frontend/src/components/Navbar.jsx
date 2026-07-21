import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Today',
  '/timetable': 'Timetable',
  '/calendar': 'Calendar',
  '/subjects': 'Subjects',
  '/settings': 'Settings',
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Today';

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:pr-8">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 text-slate-600 dark:text-slate-400 shadow-sm transition hover:bg-slate-50 dark:hover:bg-ink-800 lg:hidden"
            onClick={onMenuClick}
            type="button"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <h1
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: user + logout */}
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-ink-900 py-1.5 pl-1.5 pr-4 sm:flex">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name || 'Student'}</span>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 text-slate-500 dark:text-slate-400 shadow-sm transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
            onClick={logout}
            type="button"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
