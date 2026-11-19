import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface FeatureBlock {
  number: string;
  title: string;
  description: string;
  detail: string;
  illustration: ReactNode;
}

const FEATURES: FeatureBlock[] = [
  {
    number: '01',
    title: 'Fresh Every Morning',
    description: 'Freshly prepared every day.',
    detail:
      'Our bakers roll, proof, and fry small batches starting at 5:00 AM so every ring reaches you cloud-soft.',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
        <circle cx="32" cy="36" r="14" fill="#FCE4EC" stroke="#2A1510" strokeWidth="2.2" />
        <path
          d="M12 44h40M32 10v8M16 18l5 5M48 18l-5 5M10 34h6M48 34h6"
          stroke="#D92B4B"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="32" cy="36" r="5" fill="#D92B4B" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Premium Ingredients',
    description: 'Only carefully selected ingredients.',
    detail:
      'Real Cameron Highlands berries, 70% Belgian couverture chocolate, ceremonial Uji matcha, and Madagascar vanilla beans.',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
        <path
          d="M32 14C20 14 14 25 18 39c3 10 10 15 14 17 4-2 11-7 14-17 4-14-2-25-14-25Z"
          fill="#FCE4EC"
          stroke="#2A1510"
          strokeWidth="2.2"
        />
        <path
          d="M24 16c2-5 5-8 8-8s6 3 8 8"
          stroke="#6F8E5B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="26" cy="30" r="1.8" fill="#D92B4B" />
        <circle cx="36" cy="28" r="1.8" fill="#D92B4B" />
        <circle cx="32" cy="40" r="1.8" fill="#D92B4B" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Handcrafted with Love',
    description: 'Every donut receives special attention.',
    detail:
      'No conveyor belts or shortcuts. Each donut is hand-dipped, drizzled, and garnished individually on our marble counter.',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
        <circle cx="32" cy="32" r="22" fill="#FFF8F1" stroke="#2A1510" strokeWidth="2.2" />
        <path
          d="M32 43s-12-7.4-12-15.4C20 23.2 23.4 20 27.4 20c2.2 0 3.7 1.1 4.6 2.5.9-1.4 2.4-2.5 4.6-2.5 4 0 7.4 3.2 7.4 7.6C44 35.6 32 43 32 43Z"
          fill="#D92B4B"
        />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Happiness Delivered',
    description: 'Bringing happiness straight to your door.',
    detail:
      'Cushioned in our signature keepsake pastel pastry boxes and dispatched swiftly so every glaze arrives immaculate.',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
        <rect
          x="10"
          y="22"
          width="44"
          height="28"
          rx="6"
          fill="#FCE4EC"
          stroke="#2A1510"
          strokeWidth="2.2"
        />
        <path
          d="M10 30h44M32 22v28"
          stroke="#D92B4B"
          strokeWidth="2.2"
        />
        <path
          d="M23 22c0-4 3-7 6-7 2 0 3 2 3 7 0-5 1-7 3-7 3 0 6 3 6 7"
          stroke="#2A1510"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.why-card', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-blush-50 py-24 sm:py-32"
      aria-labelledby="why-choose-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Editorial Intro */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-strawberry-600">
              The Donutverse Standard
            </p>
            <h2
              id="why-choose-heading"
              className="mt-3 font-display-soft text-4xl font-extrabold leading-[1.06] tracking-tight text-cocoa-900 sm:text-5xl"
            >
              Crafted for Pure{' '}
              <span className="italic text-strawberry-600">Delight.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cocoa-700">
              Luxury pastry discipline meets playful everyday comfort. Four
              promises we keep in every single box.
            </p>
          </div>

          {/* Right Staggered 2x2 Editorial Craft Blocks */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
            {FEATURES.map((item, idx) => (
              <div
                key={item.number}
                className={`why-card flex flex-col justify-between rounded-3xl border border-cocoa-900/10 bg-cream-50 p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${idx % 2 === 1 ? 'sm:translate-y-6' : ''
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-cream-100 p-2.5 ring-1 ring-cocoa-900/6">
                    {item.illustration}
                  </div>
                  <span className="font-display-editorial text-sm font-semibold text-cocoa-500">
                    {item.number}
                  </span>
                </div>

                <div className="mt-7">
                  <h3 className="font-display-soft text-2xl font-bold text-cocoa-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-strawberry-600">
                    {item.description}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-cocoa-700">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
