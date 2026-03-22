import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Log in',
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-2 font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
        Log in
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        Sign in with email or Google to write and manage your posts.
      </p>
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        }
      >
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        No account?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
