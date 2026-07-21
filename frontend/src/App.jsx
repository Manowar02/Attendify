import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Calendar from './pages/Calendar';
import Subjects from './pages/Subjects';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-ink-950 text-slate-400 dark:text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-ink-950 text-slate-400 dark:text-slate-500">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] text-sm font-semibold',
          style: {},
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><AuthPage mode="login" /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AuthPage mode="register" /></PublicRoute>} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/subjects" element={<Subjects />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
