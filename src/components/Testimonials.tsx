import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/donuts';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  const current = TESTIMONIALS[index];

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const goTo = (target: number) => {
    setDirection(target >= index ? 1 : -1);
    setIndex(target);
  };

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const timer = window.setInterval(goNext, 6500);
    return () => window.clearInterval(timer);
  }, [prefersReduced, isPaused, goNext]);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative bg-cream-100 py-24 sm:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-strawberry-600">
              Customer Love
            </p>
            <h2
              id="reviews-heading"
              className="mt-3 font-display-soft text-4xl font-extrabold leading-[1.06] tracking-tight text-cocoa-900 sm:text-5xl"
            >
              Sweet Words from{' '}
              <span className="italic text-strawberry-600">Our Customers.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous customer review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cocoa-900/15 bg-cream-50 text-cocoa-900 transition-colors hover:border-strawberry-600 hover:bg-strawberry-600 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next customer review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cocoa-900/15 bg-cream-50 text-cocoa-900 transition-colors hover:border-strawberry-600 hover:bg-strawberry-600 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carousel Stage */}
        <div className="mt-12 overflow-hidden rounded-[2.25rem] border border-cocoa-900/10 bg-cream-50 p-7 shadow-editorial sm:p-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.36, ease: 'easeOut' }}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-4 flex flex-col items-start">
                <img
                  src={current.avatar}
                  alt={`Portrait of ${current.name}`}
                  loading="lazy"
                  width={220}
                  height={220}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-blush-100 sm:h-28 sm:w-28"
                />
                <div className="mt-5">
                  <p className="font-display-soft text-xl font-bold text-cocoa-900">
                    {current.name}
                  </p>
                  <p className="mt-0.5 text-sm text-cocoa-600">
                    {current.location}
                  </p>
                  <p className="mt-3 inline-block rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-cocoa-900">
                    Favorite: {current.favoriteFlavor}
                  </p>
                </div>
              </div>

              <div className="md:col-span-8">
                <div
                  className="flex items-center gap-1 text-strawberry-600"
                  aria-label={`${current.rating} out of 5 stars`}
                >
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-strawberry-600"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="mt-5 font-display-editorial text-2xl font-medium leading-snug text-cocoa-900 sm:text-3xl">
                  &ldquo;{current.review}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicators */}
          <div className="mt-10 flex items-center justify-between border-t border-cocoa-900/10 pt-6">
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Select testimonial">
              {TESTIMONIALS.map((item, idx) => {
                const active = idx === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`View review from ${item.name}`}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all ${active
                      ? 'w-9 bg-strawberry-600'
                      : 'w-2.5 bg-cocoa-900/20 hover:bg-cocoa-900/40'
                      }`}
                  />
                );
              })}
            </div>
            <p className="text-xs font-semibold tabular-nums text-cocoa-600">
              0{index + 1} / 0{TESTIMONIALS.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
