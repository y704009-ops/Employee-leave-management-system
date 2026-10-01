import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useToast } from '../hooks/useToast';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { removeToastsMatching } = useToast();

  useEffect(() => {
    // Ensure no stale logout notification survives into protected layouts
    removeToastsMatching?.((t) => typeof t.message === 'string' && t.message.toLowerCase().includes('logged out'));
  }, [removeToastsMatching]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
