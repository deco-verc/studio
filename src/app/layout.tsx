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
