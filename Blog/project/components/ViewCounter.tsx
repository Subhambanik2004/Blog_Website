// ./components/ViewCounter.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye } from "lucide-react";

interface ViewCounterProps {
  blogId: string;
  initialViews: number;
}

export default function ViewCounter({ blogId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Prevent multiple increments in development (React Strict Mode)
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    async function incrementViews() {
      try {
        const res = await fetch('/api/increment-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: blogId }),
        });
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setViews(data.views);
      } catch (err) {
        console.error('Error incrementing views:', err);
      }
    }

    incrementViews();
  }, [blogId]);

  return (
    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span>{views} views</span>
    </div>

  );
}
