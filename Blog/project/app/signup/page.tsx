import Link from 'next/link';
import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Sign up',
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-2 font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
        Create an account
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        Sign up with email or Google to publish posts and manage drafts.
      </p>
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        }
      >
        <SignupForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
