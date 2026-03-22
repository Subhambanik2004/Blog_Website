'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';
import { useGlobalLoadingOptional } from '@/components/providers/GlobalLoadingProvider';

export function LoginForm() {
  const router = useRouter();
  const globalLoad = useGlobalLoadingOptional();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard/posts';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const authError = searchParams.get('error');
  useEffect(() => {
    if (authError === 'auth') {
      toast.error('Sign-in failed. Please try again.');
    }
  }, [authError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Signed in');
    globalLoad?.startLoading();
    router.refresh();
    router.push(next.startsWith('/') ? next : '/dashboard/posts');
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in with email'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-slate-500">
          <span className="bg-white px-3 dark:bg-slate-950">Or</span>
        </div>
      </div>

      <GoogleOAuthButton next={next} label="Continue with Google" />
    </div>
  );
}
