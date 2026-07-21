import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap } from 'lucide-react';

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === 'register') {
      register({ name: form.name || 'Student', email: form.email, password: form.password });
    } else {
      login({ email: form.email, password: form.password });
    }

    navigate('/');
  };

  const isRegister = mode === 'register';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-950 px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1
            className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Attendify
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition-colors duration-300"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-ink-900"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  value={form.name}
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-ink-900"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="student@college.edu"
                type="email"
                value={form.email}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-ink-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-ink-900"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                type="password"
                value={form.password}
              />
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
            type="submit"
          >
            {isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="font-semibold text-emerald-600 dark:text-emerald-400 transition hover:text-emerald-500 dark:hover:text-emerald-300"
            onClick={() => navigate(isRegister ? '/login' : '/register')}
            type="button"
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
