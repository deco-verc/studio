// src/components/analytics/google-tag-manager.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function gtmEvent(eventName: string, data: Record<string, any>) {
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: eventName,
      ...data,
    });
  }
}

export function GoogleTagManager() {
  const gtmId = 'GTM-NFSCC674';
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && gtmId) {
      const url = pathname + (searchParams ? '?' + searchParams.toString() : '');
      gtmEvent('page_view', {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gtmId]);

  // The GTM script is now in layout.tsx, so this component only handles events.
  return null;
}
