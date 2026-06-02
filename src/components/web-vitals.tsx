"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // You can send these to an analytics service
    // For now, we'll log them in a Google-standard format
    const { id, name, label, value } = metric;
    
    // Use requestIdleCallback if available for non-blocking logging
    const log = () => {
      if (process.env.NODE_ENV === "development") {
        console.table({ id, name, label, value });
      }
      
      // Potential for GA4 or Vercel Analytics here
      // window.gtag?.('event', name, { ... });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(log);
    } else {
      setTimeout(log, 0);
    }
  });

  return null;
}
