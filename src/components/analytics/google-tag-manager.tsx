// src/components/analytics/google-tag-manager.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
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

  if (!gtmId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Tag Manager is not set up. Please add NEXT_PUBLIC_GTM_ID to your environment variables.');
    }
    return null;
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
    </>
  );
}
