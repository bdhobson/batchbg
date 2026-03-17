'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAIRS = [
  { before: '/image0-before.png', after: '/image0-after.png', label: 'Product photo' },
  { before: '/image1_before.jpg', after: '/image1_after.png', label: 'Product photo' },
  { before: '/image2_before.jpg', after: '/image2_after.png', label: 'Product photo' },
  { before: '/image3_before.jpg', after: '/image3_after.png', label: 'Product photo' },
];

export function BeforeAfterCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + PAIRS.length) % PAIRS.length);
  const next = () => setIndex((i) => (i + 1) % PAIRS.length);

  const pair = PAIRS[index];

  return (
    <div className="relative">
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Before</span>
          </div>
          <div className="p-8 flex items-center justify-center min-h-64 bg-secondary/30">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden">
              <img
                key={pair.before}
                src={pair.before}
                alt={`${pair.label} with original background`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/40 bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">After</span>
          </div>
          <div className="p-8 flex items-center justify-center min-h-64">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden bg-white border border-border/30">
              <img
                key={pair.after}
                src={pair.after}
                alt={`${pair.label} with clean background`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {PAIRS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? 'bg-primary' : 'bg-border hover:bg-muted-foreground'
            }`}
            aria-label={`Go to pair ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
