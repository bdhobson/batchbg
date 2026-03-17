'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAIRS = [
  { before: '/image0-before.png', after: '/image0-after.png', label: 'Product photo' },
  { before: '/image1_before.jpg', after: '/image1_after.png', label: 'Product photo' },
  { before: '/image2_before.jpg', after: '/image2_after.png', label: 'Product photo' },
  { before: '/image3_before.jpg', after: '/image3_after.png', label: 'Product photo' },
];

export function BeforeAfterCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative">
      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Embla viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {PAIRS.map((pair, i) => (
            <div
              key={i}
              className="flex-none w-full px-2 transition-all duration-500"
              style={{
                opacity: i === selectedIndex ? 1 : 0.4,
                transform: i === selectedIndex ? 'scale(1)' : 'scale(0.92)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 bg-primary">
                    <span className="text-xs font-semibold text-primary-foreground uppercase tracking-widest">Before</span>
                  </div>
                  <div className="p-8 flex items-center justify-center min-h-64 bg-secondary/30">
                    <div className="w-64 h-64 rounded-xl overflow-hidden">
                      <img
                        src={pair.before}
                        alt={`${pair.label} with original background`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="rounded-2xl border border-primary/40 bg-card overflow-hidden">
                  <div className="px-5 py-3 bg-primary">
                    <span className="text-xs font-semibold text-primary-foreground uppercase tracking-widest">After</span>
                  </div>
                  <div className="p-8 flex items-center justify-center min-h-64">
                    <div className="w-64 h-64 rounded-xl overflow-hidden bg-white border border-border/30">
                      <img
                        src={pair.after}
                        alt={`${pair.label} with clean background`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {PAIRS.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === selectedIndex
                ? 'bg-primary w-5 h-2'
                : 'bg-border hover:bg-muted-foreground w-2 h-2'
            }`}
            aria-label={`Go to pair ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
