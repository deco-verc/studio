import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import Script from 'next/script';
import { GoogleTagManager } from '@/components/analytics/google-tag-manager';
import { Suspense } from 'react';

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
        <Script id="google-tag-manager-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFSCC674');`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <script
          id="utm-pixel-config"
          dangerouslySetInnerHTML={{
            __html: `window.pixelId = "692fb30e751c0c336b539b5d";`,
          }}
        />
        <script
          async
          defer
          src="https://cdn.utmify.com.br/scripts/pixel/pixel.js"
        ></script>
      </head>
      <body className="antialiased">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NFSCC674"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        <Suspense>
          <GoogleTagManager />
        </Suspense>
        {children}
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
