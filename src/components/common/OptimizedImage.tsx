import React, { useState, useEffect, useRef } from 'react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  skeletonClassName?: string;
  containerClassName?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const DEFAULT_FALLBACK_IMAGE = '/assets/jatibaraya-logo.png';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  skeletonClassName = 'bg-slate-200/80 dark:bg-slate-800',
  containerClassName = 'w-full h-full',
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  fetchPriority,
  onError,
  onLoad,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(loading !== 'lazy');
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset states when source prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // IntersectionObserver fallback for lazy loading
  useEffect(() => {
    if (loading !== 'lazy' || isInView) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, isInView]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      if (onError) onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Loading State */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 animate-pulse flex items-center justify-center ${skeletonClassName}`}
          aria-hidden="true"
        >
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600/30 border-t-emerald-700 animate-spin opacity-50" />
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          {...(fetchPriority ? { fetchPriority } : {})}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};
