import { useState, useEffect, useCallback, type ReactNode } from 'react';

export type SlideType = 'belt-wall' | 'schedule' | 'announcements' | 'spotlight' | 'birthday';

interface Slide {
  id: SlideType;
  component: ReactNode;
  duration?: number; // seconds, default 30
}

interface SlideControllerProps {
  slides: Slide[];
  autoPlay?: boolean;
  defaultDuration?: number; // seconds
  showControls?: boolean; // for debug/admin
}

export function SlideController({
  slides,
  autoPlay = true,
  defaultDuration = 30,
  showControls = false,
}: SlideControllerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const currentSlide = slides[currentIndex];
  const slideDuration = (currentSlide?.duration ?? defaultDuration) * 1000;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(goToNext, slideDuration);
    return () => clearInterval(timer);
  }, [isPlaying, slideDuration, goToNext, slides.length]);

  // Keyboard controls (for admin/debug)
  useEffect(() => {
    if (!showControls) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'p':
          setIsPlaying((prev) => !prev);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const index = parseInt(e.key) - 1;
          if (index < slides.length) goToSlide(index);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControls, goToNext, goToPrev, goToSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-500">No slides configured</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Current Slide */}
      <div className="h-full w-full">
        {currentSlide?.component}
      </div>

      {/* Debug Controls Overlay */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-4">
          {/* Slide indicators */}
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-amber-500 scale-110'
                    : 'bg-neutral-600 hover:bg-neutral-500'
                }`}
                title={slide.id}
              />
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="text-neutral-400 hover:text-white text-sm"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          {/* Current slide info */}
          <span className="text-neutral-500 text-xs">
            {currentIndex + 1}/{slides.length} • {currentSlide?.id}
          </span>

          {/* Keyboard hint */}
          <span className="text-neutral-600 text-xs">
            ←→ nav • P pause • 1-9 jump
          </span>
        </div>
      )}
    </div>
  );
}
