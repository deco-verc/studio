'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2, VolumeX, Play, Maximize } from 'lucide-react';
import { gtmEvent } from '@/components/analytics/google-tag-manager';
import Player from '@vimeo/player';
import { sendServerEvent } from '../meta-actions';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';
import { CHECKOUT_URL } from '@/lib/config';

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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(false);

  const vimeoPlayerRef = useRef<Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
      gtmEvent('cta_button_show', { page_path: '/analise' });
    }, 60000); // 1 minuto

    return () => clearTimeout(timer);
  }, []);

  const plateausRef = useRef<{ start: number, end: number }[]>([]);

  useEffect(() => {
    if (playerContainerRef.current) {
      const iframe = playerContainerRef.current.querySelector('iframe');
      if (iframe) {
        // Preload hint
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://player.vimeo.com';
        document.head.appendChild(link);

        const player = new Player(iframe);
        vimeoPlayerRef.current = player;

        // Generate plateaus once duration is known
        player.getDuration().then(d => {
          const newPlateaus = [];
          const numPlateaus = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < numPlateaus; i++) {
            const startTime = (0.2 + Math.random() * 0.6) * d; // Random points between 20% and 80%
            const duration = 0.2 + Math.random() * 0.6; // 200ms - 800ms
            newPlateaus.push({ start: startTime, end: startTime + duration });
          }
          plateausRef.current = newPlateaus;
        }).catch(e => console.error("Could not get duration:", e));

        // Smart Autoplay Logic
        player.ready().then(() => {
          player.setVolume(1).then(() => {
            player.play().then(() => {
              setIsMuted(false);
              setIsPlaying(true);
              setShowUnmuteOverlay(false);
            }).catch((error) => {
              console.warn("Autoplay unmuted failed, trying muted:", error);
              player.setVolume(0);
              player.setMuted(true);
              player.play().then(() => {
                setIsMuted(true);
                setIsPlaying(true);
                setShowUnmuteOverlay(true);
              }).catch(e => console.error("Autoplay muted failed:", e));
            });
          });
        });

        player.on('timeupdate', (data) => {
          const t_real = data.seconds;
          const d = data.duration;

          // Check plateaus
          const inPlateau = plateausRef.current.some(p => t_real >= p.start && t_real < p.end);
          if (inPlateau) return;

          let p_vis = 0;
          if (t_real > d * 0.9) {
            // Catch up: interpolate from current visual pos (or 0.95) to 1.0
            // To avoid jumps, we calculate what it *should* be.
            // At 0.9d, we want to be at ~0.95. At 1.0d, we want 1.0.
            const progressInFinalPhase = (t_real - (d * 0.9)) / (d * 0.1);
            p_vis = 0.95 + (progressInFinalPhase * 0.05);
          } else {
            const leadFactor = 1.15;
            const rawTarget = (t_real * leadFactor) / d;
            p_vis = Math.min(rawTarget, 0.95);
          }

          setProgress(Math.min(p_vis * 100, 100));
        });

        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));
        player.on('ended', () => {
          setIsVideoEnded(true);
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
          }
        });

        // Auto-pause/resume on scroll
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              player.getPaused().then(paused => {
                if (!paused) player.pause();
              });
            } else {
              // Optional: Auto-resume if it was playing before?
              // The user said: "o vídeo pode retomar automaticamente do ponto onde parou"
              // We'll try to play.
              player.getPaused().then(paused => {
                if (paused) player.play().catch(() => { });
              });
            }
          });
        }, { threshold: 0.1 });

        observer.observe(playerContainerRef.current);

        return () => {
          observer.disconnect();
          // Remove link? No need.
        };
      }
    }
  }, []);

  const toggleMute = async () => {
    if (vimeoPlayerRef.current) {
      const newMutedState = !isMuted;
      await vimeoPlayerRef.current.setMuted(newMutedState);
      await vimeoPlayerRef.current.setVolume(newMutedState ? 0 : 1);
      setIsMuted(newMutedState);
      setShowUnmuteOverlay(newMutedState);
    }
  };

  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const handleUnmuteClick = () => {
    if (vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setMuted(false);
      vimeoPlayerRef.current.setVolume(1);
      setIsMuted(false);
      setShowUnmuteOverlay(false);
      toggleFullscreen();
    }
  }

  const toggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

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
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
          Seu protocolo personalizado está pronto — mas antes de acessar, assista esse vídeo até o final para entender.
        </h1>

        <div className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl overflow-hidden border border-primary/20 bg-black group">
          <div ref={playerContainerRef} className="aspect-[9/16] w-full relative">
            <div style={{ padding: '177.77% 0 0 0', position: 'relative' }}>
              <iframe
                src="https://player.vimeo.com/video/1143713015?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0&controls=0&dnt=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="VSL Video"
                allowFullScreen
              ></iframe>
            </div>

            {/* Smart Autoplay Overlay */}
            {showUnmuteOverlay && !isVideoEnded && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity hover:bg-black/30"
                onClick={handleUnmuteClick}
              >
                <div className="bg-primary/90 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 animate-pulse shadow-lg backdrop-blur-sm hover:scale-105 transition-transform">
                  <VolumeX className="w-6 h-6" />
                  CLIQUE PARA ATIVAR O SOM 🔊
                </div>
              </div>
            )}

            {/* Video Ended Overlay */}
            {isVideoEnded && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center animate-fade-in">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-6 leading-tight">
                  Seu plano está pronto!
                </h3>
                <Button
                  onClick={handleCtaClick}
                  size="lg"
                  className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-bold py-6 text-lg shadow-xl transform hover:scale-105 transition-all animate-bounce"
                >
                  VER MEU RESULTADO ➔
                </Button>
              </div>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Tela cheia"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          {/* Smart Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800 z-10">
            <div
              className="h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              style={{
                width: `${progress}%`,
                transition: 'width 0.5s cubic-bezier(.2,.9,.2,1)'
              }}
            />
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
              className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-lg md:text-xl font-bold py-6 md:py-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform animate-pulse whitespace-normal h-auto leading-tight"
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
