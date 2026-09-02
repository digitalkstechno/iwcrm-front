'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Layers } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.jenkins@nexus.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  // Auto-login on first visit
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      setIsAutoLogin(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple validation
      if (!email || !password) {
        setError('Please enter email and password');
        setIsLoading(false);
        return;
      }

      // Store login state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isAutoLogin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">CRM</h1>
            <p className="text-slate-500 text-sm">Invisible World</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 mt-6 space-y-1">
          <p>© 2026 Invisible World CRM. All rights reserved.</p>
          <p>Created by <span className="font-semibold text-slate-700">Digitalks Techno LLP</span></p>
        </div>
      </div>
    </div>
  );
}
