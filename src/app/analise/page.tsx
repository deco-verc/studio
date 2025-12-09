'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { gtmEvent } from '@/components/analytics/google-tag-manager';
import Player from '@vimeo/player';
import { sendServerEvent } from '../meta-actions';
import { v4 as uuidv4 } from 'uuid';

const speedOptions = [
  { label: '1x', speed: 1.0 },
  { label: '1.25x', speed: 1.25 },
  { label: '1.5x', speed: 1.5 },
  { label: '2x', speed: 2.0 },
];

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function AnalisePage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  const vimeoPlayerRef = useRef<Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
      gtmEvent('cta_button_show', { page_path: '/analise' });
    }, 60000); // 1 minuto

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (playerContainerRef.current) {
        const iframe = playerContainerRef.current.querySelector('iframe');
        if (iframe) {
            const player = new Player(iframe);
            vimeoPlayerRef.current = player;

            player.ready().then(() => {
                player.play().catch(error => {
                    console.warn("Autoplay was prevented:", error.name);
                });
            });
        }
    }
  }, []);

  const setPlaybackSpeed = (speed: number) => {
    if (vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setPlaybackRate(speed).then(() => {
        setCurrentSpeed(speed);
        gtmEvent('video_speed_change', { speed });
      }).catch(error => {
        console.error(`Error setting playback rate to ${speed}x:`, error);
      });
    }
  };
  
  const handleCtaClick = () => {
    const eventId = uuidv4();
    const eventName = 'InitiateCheckout';

    const userData = {
        client_ip_address: null, 
        client_user_agent: navigator.userAgent,
        fbc: getCookie('_fbc'),
        fbp: getCookie('_fbp'),
        email: null,
        phone: null,
    };
    
    // Send to GTM / Meta Pixel (client-side)
    gtmEvent(eventName, {
        eventId,
    });
    
    // Send to Meta CAPI (server-side)
    sendServerEvent(eventName, eventId, userData);

    router.push('/resultado');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-primary">
          Estamos analisando suas respostas...
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Enquanto isso, assista a esta apresentação especial que preparamos para você.
        </p>

        <div ref={playerContainerRef} className="aspect-[9/16] w-full max-w-md mx-auto bg-black rounded-lg shadow-2xl overflow-hidden border border-primary/20">
          <div style={{padding:'177.77% 0 0 0',position:'relative'}}>
              <iframe 
                  src="https://player.vimeo.com/video/1143713015?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                  style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} 
                  title="VSL Video"
                  allowFullScreen
              ></iframe>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
            {speedOptions.map(({ label, speed }) => (
                <Button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    variant={currentSpeed === speed ? 'default' : 'outline'}
                    size="sm"
                    className="transition-all"
                >
                    {label}
                </Button>
            ))}
        </div>

        <div className="h-20 flex items-center justify-center">
          {showButton ? (
            <Button
              onClick={handleCtaClick}
              size="lg"
              className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform animate-pulse"
            >
              QUERO VER MEU PLANO PERSONALIZADO
            </Button>
          ) : (
            <div className="flex items-center text-muted-foreground animate-pulse">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Botão de acesso será liberado em breve...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
