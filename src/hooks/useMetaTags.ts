import { useEffect } from 'react';

export interface MetaTagsOptions {
  title: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
}

/**
 * Custom React hook to dynamically manage document title, meta descriptions,
 * OpenGraph, Twitter cards, and canonical links in single page applications (SPA)
 * without requiring third-party libraries like react-helmet.
 */
export function useMetaTags(
  title: string,
  description?: string,
  image?: string,
  canonicalUrl?: string
): void {
  useEffect(() => {
    if (!title) return;

    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = title;

    // Helper to safely set or create a <meta> tag
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string | undefined) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. OpenGraph tags
    setMetaTag('property', 'og:title', title);
    if (description) setMetaTag('property', 'og:description', description);
    if (image) setMetaTag('property', 'og:image', image);

    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : undefined);
    if (currentUrl) {
      setMetaTag('property', 'og:url', currentUrl);

      // Canonical link
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', currentUrl);
    }

    // 4. Twitter tags
    setMetaTag('name', 'twitter:title', title);
    if (description) setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    return () => {
      // Restore on unmount if needed
      document.title = originalTitle;
    };
  }, [title, description, image, canonicalUrl]);
}
