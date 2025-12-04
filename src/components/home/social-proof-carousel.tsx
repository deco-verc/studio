'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

export function SocialProofCarousel() {
  const socialProofs = [
    PlaceHolderImages.find(p => p.id === 'socialProof1'),
    PlaceHolderImages.find(p => p.id === 'socialProof2'),
    PlaceHolderImages.find(p => p.id === 'socialProof3'),
    PlaceHolderImages.find(p => p.id === 'socialProof4'),
  ].filter(Boolean) as any[];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="pb-8">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {socialProofs.map((proof) => (
            <CarouselItem key={proof.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
              <div className="p-2">
                <Card className="overflow-hidden rounded-lg shadow-md">
                  <CardContent className="p-0">
                    <Image
                      src={proof.imageUrl}
                      width="250"
                      height="500"
                      alt={proof.description}
                      data-ai-hint={proof.imageHint}
                      className="aspect-[1/2] w-full object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  )
}
