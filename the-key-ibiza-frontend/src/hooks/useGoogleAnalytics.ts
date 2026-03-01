// Google Analytics 4 Integration Hook
// Add your GA4 Measurement ID in .env as VITE_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-BC9HMV6WSN';

// Initialize Google Analytics
export function initGA() {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics: No measurement ID configured');
    return;
  }

  // Add gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true
  });

  console.log('Google Analytics initialized');
}

// Track page views
export function trackPageView(path: string, title?: string) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title
  });
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}

// Track villa views
export function trackVillaView(villaName: string, villaId: string) {
  trackEvent('view_item', 'Villa', villaName);

  if (!window.gtag) return;
  window.gtag('event', 'view_item', {
    currency: 'EUR',
    items: [{
      item_id: villaId,
      item_name: villaName,
      item_category: 'Villa'
    }]
  });
}

// Track yacht views
export function trackYachtView(yachtName: string, yachtId: string) {
  trackEvent('view_item', 'Yacht', yachtName);

  if (!window.gtag) return;
  window.gtag('event', 'view_item', {
    currency: 'EUR',
    items: [{
      item_id: yachtId,
      item_name: yachtName,
      item_category: 'Yacht'
    }]
  });
}

// Track search
export function trackSearch(searchTerm: string, filters?: Record<string, any>) {
  if (!window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    ...filters
  });
}

// Track contact form submission
export function trackContactSubmit(source: string, itemName?: string) {
  trackEvent('generate_lead', 'Contact', source);

  if (!window.gtag) return;
  window.gtag('event', 'generate_lead', {
    currency: 'EUR',
    source: source,
    item_name: itemName
  });
}

// Track PDF download
export function trackPdfDownload(villaName: string) {
  trackEvent('download', 'PDF', villaName);
}

// Track outbound links
export function trackOutboundLink(url: string) {
  trackEvent('click', 'Outbound Link', url);
}

// React Hook for easy usage
import { useEffect } from 'react';

export function usePageTracking(path: string, title?: string) {
  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);
}

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackVillaView,
  trackYachtView,
  trackSearch,
  trackContactSubmit,
  trackPdfDownload,
  trackOutboundLink,
  usePageTracking
};
