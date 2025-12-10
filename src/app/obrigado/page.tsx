
'use client';

import { useEffect } from 'react';
import { gtmEvent } from '@/components/analytics/google-tag-manager';
import { sendServerEvent } from '../meta-actions';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function ObrigadoPage() {
  useEffect(() => {
    const eventId = uuidv4();
    const eventName = 'Purchase';
    const purchaseData = {
      value: 47.90,
      currency: 'BRL',
    };

    const userData = {
      client_ip_address: null, // Should be fetched/set on the server if possible
      client_user_agent: navigator.userAgent,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      email: null, // Populate if you get it from checkout/user
      phone: null, // Populate if you get it from checkout/user
    };

    // 1. Send to GTM / Meta Pixel (client-side)
    gtmEvent(eventName, {
      ...purchaseData,
      eventId,
    });

    // 2. Send to Meta CAPI (server-side)
    sendServerEvent(eventName, eventId, userData, purchaseData);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <div className="w-full max-w-2xl space-y-6">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-primary">
          Obrigado pela sua compra!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          Seu acesso foi enviado para o seu e-mail. Verifique sua caixa de entrada (e a pasta de spam) para começar a sua transformação.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button asChild size="lg">Voltar para o Início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
