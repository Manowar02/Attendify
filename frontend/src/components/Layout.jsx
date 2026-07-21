import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-slate-200 transition-colors duration-300">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileNav />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <button
          aria-label="Close overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-20 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:pb-10 lg:pr-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
