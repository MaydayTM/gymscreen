import { useState, useEffect } from 'react';
import type { GymScreenSlide } from '../../hooks/useSlides';

interface SlideshowProps {
  slides: GymScreenSlide[];
  interval?: number; // seconds per slide
  subtitle?: string;
}

export function Slideshow({
  slides,
  interval = 5,
  subtitle = 'Reconnect Academy',
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length <= 1) return;

    // Use slide-specific duration if available, otherwise use interval
    const currentSlide = slides[currentIndex];
    const duration = (currentSlide?.display_duration || interval) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides, interval]);

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 text-lg">Geen slides beschikbaar</p>
          <p className="text-neutral-600 text-sm mt-2">
            Voeg slides toe via de CRM
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="h-screen w-screen bg-neutral-950 relative overflow-hidden">
      {/* Background image with fade transition */}
      <div
        key={currentSlide.id}
        className="absolute inset-0 animate-fade-in"
        style={{
          backgroundImage: `url(${currentSlide.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Academy branding - top left */}
      <div className="absolute top-6 left-6 z-10">
        <p className="text-sm text-amber-500 font-medium tracking-wider uppercase">
          {subtitle}
        </p>
      </div>

      {/* Slide info - bottom */}
      {(currentSlide.title || currentSlide.caption) && (
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          {currentSlide.title && (
            <h2 className="text-4xl font-bold text-white mb-2">
              {currentSlide.title}
            </h2>
          )}
          {currentSlide.caption && (
            <p className="text-xl text-neutral-300 max-w-3xl">
              {currentSlide.caption}
            </p>
          )}

          {/* Category badge */}
          <div className="mt-4">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full uppercase">
              {getCategoryLabel(currentSlide.category)}
            </span>
          </div>
        </div>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-amber-500 scale-125'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <span className="text-white/50 text-sm font-medium">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(category: GymScreenSlide['category']): string {
  const labels: Record<GymScreenSlide['category'], string> = {
    event: 'Event',
    training: 'Training',
    community: 'Community',
    achievement: 'Achievement',
    promo: 'Promo',
    announcement: 'Announcement',
  };
  return labels[category] || category;
}
