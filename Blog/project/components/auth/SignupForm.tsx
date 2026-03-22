'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';
import { useGlobalLoadingOptional } from '@/components/providers/GlobalLoadingProvider';

export function SignupForm() {
  const router = useRouter();
  const globalLoad = useGlobalLoadingOptional();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard/posts';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Check your email to confirm your account, or sign in if confirmation is disabled.');
    globalLoad?.startLoading();
    router.refresh();
    router.push('/dashboard/posts');
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up with email'}
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

      <GoogleOAuthButton next={next} label="Sign up with Google" />
    </div>
  );
}
