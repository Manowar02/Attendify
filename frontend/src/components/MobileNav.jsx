import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, School2, Clock3 } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Today', icon: LayoutDashboard, end: true },
  { to: '/timetable', label: 'Timetable', icon: Clock3 },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/subjects', label: 'Subjects', icon: School2 },
];

const MobileNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white/90 dark:bg-ink-950/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[0.65rem] font-semibold transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-1 h-1 w-6 rounded-full bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
                  )}
                  <div className={`grid h-8 w-8 place-items-center rounded-xl transition ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''}`}>
                    <Icon className={`h-[1.15rem] w-[1.15rem] transition ${isActive ? 'scale-110' : ''}`} />
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
