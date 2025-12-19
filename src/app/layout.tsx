import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import Script from 'next/script';
import { Suspense } from 'react';
import { GA_TRACKING_ID } from '@/lib/analytics';

export const metadata: Metadata = {
  title: 'CorpoLeve Quiz',
  description: 'Emagreça até 3kg em 7 dias dormindo com o Truque que a Industria Alimentícia utiliza para enganar seu cérebro.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.pixelId = "694594b292ddda42ae351548";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);
            `
          }}
        />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Suspense>
          {children}
        </Suspense>
        <Toaster />
        <Script
          id="utm-script"
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          strategy="beforeInteractive"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
        ></Script>
      </body>
    </html>
  );
}
