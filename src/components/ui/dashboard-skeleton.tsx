import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Card skeleton with shimmer effect
export const CardSkeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    "rounded-2xl border border-border bg-card p-5 space-y-4",
    className
  )}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded shimmer" />
      <div className="h-3 w-3/4 rounded shimmer" />
    </div>
  </div>
);

// Stats row skeleton
export const StatsSkeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
    {[1, 2, 3, 4].map((i) => (
      <div 
        key={i} 
        className="rounded-xl border border-border bg-card p-4 stat-card"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-8 rounded shimmer" />
            <div className="h-3 w-16 rounded shimmer" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    "flex items-center gap-3 p-3 rounded-lg",
    className
  )}>
    <div className="w-10 h-10 rounded-lg shimmer shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/3 rounded shimmer" />
      <div className="h-3 w-1/2 rounded shimmer" />
    </div>
    <div className="w-16 h-6 rounded-full shimmer" />
  </div>
);

// Text block skeleton
export const TextSkeleton: React.FC<SkeletonProps & { lines?: number }> = ({ 
  className, 
  lines = 3 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="h-3 rounded shimmer"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

// Dashboard page skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    {/* Header skeleton */}
    <div className="space-y-2">
      <div className="h-7 w-48 rounded shimmer" />
      <div className="h-4 w-64 rounded shimmer" />
    </div>

    {/* Stats skeleton */}
    <StatsSkeleton />

    {/* Cards skeleton */}
    <div className="grid lg:grid-cols-2 gap-4">
      <CardSkeleton />
      <CardSkeleton />
    </div>

    {/* Progress skeleton */}
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 rounded shimmer" />
        <div className="h-3 w-32 rounded shimmer" />
      </div>
      <div className="h-2 w-full rounded-full shimmer" />
    </div>
  </div>
);

// Kanban skeleton
export const KanbanSkeleton: React.FC = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <div className="h-6 w-40 rounded shimmer" />
        <div className="h-3 w-56 rounded shimmer" />
      </div>
      <div className="h-9 w-32 rounded-lg shimmer" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="rounded-xl border border-border bg-card p-4 min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full shimmer" />
            <div className="h-4 w-20 rounded shimmer" />
            <div className="ml-auto h-5 w-6 rounded-full shimmer" />
          </div>
          <div className="space-y-2.5">
            {[1, 2].map((card) => (
              <div key={card} className="rounded-lg border border-border p-3.5 space-y-2">
                <div className="h-4 w-3/4 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
                <div className="h-3 w-1/3 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
