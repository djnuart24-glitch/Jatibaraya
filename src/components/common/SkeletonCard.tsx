import React from 'react';

export type SkeletonCardVariant = 'card-berita' | 'card-program' | 'card-galeri' | 'card-stat';

interface SkeletonCardProps {
  variant?: SkeletonCardVariant;
  count?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'card-berita',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  const renderSingleSkeleton = (index: number) => {
    switch (variant) {
      case 'card-berita':
        return (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-5 items-start animate-pulse ${className}`}
          >
            <div className="w-full sm:w-44 h-32 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-20 h-4 rounded bg-slate-200" />
                <div className="w-16 h-4 rounded bg-slate-200" />
              </div>
              <div className="w-4/5 h-5 rounded bg-slate-200" />
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-3.5 rounded bg-slate-200" />
                <div className="w-3/4 h-3.5 rounded bg-slate-200" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="w-24 h-4 rounded bg-slate-200" />
                <div className="w-16 h-4 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        );

      case 'card-program':
        return (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 animate-pulse ${className}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-20 h-5 rounded-full bg-slate-200" />
                <div className="w-16 h-4 rounded bg-slate-200" />
              </div>
              <div className="w-3/4 h-5 rounded bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-full h-3 rounded bg-slate-200" />
                <div className="w-5/6 h-3 rounded bg-slate-200" />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="w-20 h-3 rounded bg-slate-200" />
              <div className="w-14 h-4 rounded bg-slate-200" />
            </div>
          </div>
        );

      case 'card-galeri':
        return (
          <div
            key={index}
            className={`h-64 rounded-2xl bg-slate-200 animate-pulse relative overflow-hidden ${className}`}
          >
            <div className="absolute inset-x-0 bottom-0 p-5 space-y-2 bg-gradient-to-t from-slate-400/40 to-transparent">
              <div className="w-16 h-3 rounded bg-slate-300" />
              <div className="w-32 h-4 rounded bg-slate-300" />
            </div>
          </div>
        );

      case 'card-stat':
        return (
          <div
            key={index}
            className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 animate-pulse ${className}`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="w-20 h-7 rounded bg-slate-200" />
            <div className="w-24 h-3 rounded bg-slate-200" />
          </div>
        );

      default:
        return null;
    }
  };

  if (count === 1) {
    return renderSingleSkeleton(0);
  }

  return <>{items.map((_, i) => renderSingleSkeleton(i))}</>;
};
