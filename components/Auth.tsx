import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Input from './ui/Input';
import Button from './ui/Button';
import BuildingLibraryIcon from './icons/BuildingLibraryIcon';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // The onAuthStateChange listener in index.tsx will handle the redirect
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <BuildingLibraryIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                Selamat Datang
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                Login untuk mengelola penilaian training Anda.
            </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="contoh@email.com"
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <Button type="submit" disabled={loading} className="w-full !py-3 text-base font-semibold">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>
       <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Aplikasi Penilaian Training. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Auth;
