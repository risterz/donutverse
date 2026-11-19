import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useCart } from '../context/CartContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const donutStageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 });
  const prefersReduced = usePrefersReducedMotion();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-reveal', {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        clearProps: 'transform,opacity',
      })
        .from(
          '.hero-donut-visual',
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.05,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.65',
        )
        .from(
          '.hero-float-accent',
          {
            scale: 0.6,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            clearProps: 'opacity',
          },
          '-=0.6',
        );

      gsap.to('.hero-parallax-donut', {
        yPercent: -10,
        rotation: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to('.hero-float-accent', {
        y: -14,
        rotation: 8,
        duration: 2.8,
        ease: 'sine.inOut',
        stagger: { each: 0.35, repeat: -1, yoyo: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !donutStageRef.current) return;
    const rect = donutStageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -ny * 12,
      rotateY: nx * 14,
      shiftX: nx * 16,
      shiftY: ny * 14,
    });
  };

  const handleStageLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 });
  };

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderNow = () => {
    if (itemCount > 0) {
      openCart();
    } else {
      scrollToCollection();
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-cream-100 pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-24"
    >
      {/* Warm sculptural blush backdrop shape strictly framing the focal product */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-12 h-[520px] w-[520px] rounded-full bg-blush-100/80 blur-2xl sm:h-[640px] sm:w-[640px] lg:right-[-6%] lg:top-[8%]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Left Editorial Column */}
        <div className="lg:col-span-6">
          <p className="hero-reveal mb-5 font-display-editorial text-sm font-medium italic text-cocoa-600 sm:text-base">
            A Little Hole Lot of Happiness.
          </p>

          <h1 className="hero-reveal font-display-soft text-[clamp(3.1rem,7.2vw,5.75rem)] font-extrabold leading-[0.96] tracking-[-0.03em] text-cocoa-900">
            <span className="block">Life is Better</span>
            <span className="mt-1 block">
              with{' '}
              <span className="italic text-strawberry-600">Donuts.</span>
            </span>
          </h1>

          <p className="hero-reveal mt-7 max-w-lg text-base leading-relaxed text-cocoa-700 sm:text-lg">
            Handcrafted happiness, freshly glazed every single day. Discover your
            new favorite obsession.
          </p>

          <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              onClick={scrollToCollection}
              className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-strawberry-600 px-8 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-strawberry-700 sm:text-base"
            >
              <span>Explore Our Donuts</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>

            <MagneticButton
              onClick={handleOrderNow}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-cocoa-900 bg-transparent px-8 py-3.5 text-sm font-semibold text-cocoa-900 transition-colors hover:bg-cocoa-900 hover:text-cream-50 sm:text-base"
            >
              Order Now
            </MagneticButton>
          </div>

          <div className="hero-reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cocoa-900/12 pt-6 text-xs font-medium text-cocoa-600 sm:text-sm">
            <span>18-hour cold-fermented brioche</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-cocoa-500/50 sm:inline-block" />
            <span>Glazed in small morning batches</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-cocoa-500/50 sm:inline-block" />
            <span>Kuala Lumpur &amp; Penang</span>
          </div>
        </div>

        {/* Right Sculptural Product Stage */}
        <div
          ref={donutStageRef}
          onMouseMove={handleStageMove}
          onMouseLeave={handleStageLeave}
          className="relative mx-auto flex w-full max-w-[540px] items-center justify-center lg:col-span-6 lg:max-w-none"
          style={{ perspective: '1100px' }}
        >
          {/* Floating artisan ingredient accents: outer wrapper handles mouse parallax, inner SVG handles GSAP drift */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 top-8 z-20 sm:left-4"
            style={{
              transform: `translate3d(${tilt.shiftX * -1.2}px, ${tilt.shiftY * -1.2}px, 0)`,
              transition: 'transform 220ms ease-out',
            }}
          >
            <svg
              viewBox="0 0 64 64"
              className="hero-float-accent h-12 w-12 drop-shadow-md sm:h-14 sm:w-14"
            >
              {/* Fresh Strawberry Wedge */}
              <path
                d="M32 10C20 10 11 21 15 35c3 11 11 19 17 21 6-2 14-10 17-21 4-14-5-25-17-25Z"
                fill="#D92B4B"
              />
              <path
                d="M25 13c2-5 5-7 7-7s5 2 7 7c-3-1-11-1-14 0Z"
                fill="#5D8247"
              />
              <circle cx="24" cy="27" r="1.4" fill="#FCE4EC" />
              <circle cx="34" cy="24" r="1.4" fill="#FCE4EC" />
              <circle cx="39" cy="34" r="1.4" fill="#FCE4EC" />
              <circle cx="28" cy="39" r="1.4" fill="#FCE4EC" />
              <circle cx="33" cy="45" r="1.3" fill="#FCE4EC" />
            </svg>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-10 z-20 sm:right-6"
            style={{
              transform: `translate3d(${tilt.shiftX * 1.4}px, ${tilt.shiftY * -1.1}px, 0)`,
              transition: 'transform 220ms ease-out',
            }}
          >
            <svg
              viewBox="0 0 64 64"
              className="hero-float-accent h-11 w-11 drop-shadow-md sm:h-14 sm:w-14"
            >
              {/* Shaved Belgian Chocolate Curl */}
              <path
                d="M14 44c4-18 18-30 34-26 6 2 8 10 2 15-8 6-18 2-21 12-2 6-17 7-15-1Z"
                fill="#3B2019"
              />
              <path
                d="M22 38c4-10 13-17 24-15"
                stroke="#6D463B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-14 right-2 z-20 sm:right-8"
            style={{
              transform: `translate3d(${tilt.shiftX * 1.1}px, ${tilt.shiftY * 1.3}px, 0)`,
              transition: 'transform 220ms ease-out',
            }}
          >
            <svg
              viewBox="0 0 80 40"
              className="hero-float-accent h-10 w-20"
            >
              {/* Sprinkles & Sugar Crystals */}
              <rect x="8" y="14" width="18" height="6" rx="3" transform="rotate(-22 8 14)" fill="#D92B4B" />
              <rect x="34" y="8" width="16" height="5.5" rx="2.75" transform="rotate(32 34 8)" fill="#E3A45B" />
              <rect x="52" y="24" width="16" height="5.5" rx="2.75" transform="rotate(-14 52 24)" fill="#2A1510" />
              <circle cx="28" cy="30" r="2.6" fill="#F7C9D8" />
              <circle cx="66" cy="11" r="2.2" fill="#FFFDF9" stroke="#D92B4B" strokeWidth="1" />
            </svg>
          </div>

          {/* Main Photorealistic Hero Donut: outer layer for GSAP scroll parallax, inner layer for pointer tilt */}
          <div className="hero-donut-visual hero-parallax-donut relative w-full max-w-[460px] sm:max-w-[520px]">
            <div
              className="relative overflow-hidden rounded-[2.75rem] bg-cream-50 p-3 shadow-editorial ring-1 ring-cocoa-900/5"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <img
                src="/images/hero-donut.jpg"
                alt="Handcrafted DONUTVERSE strawberry glazed brioche donut topped with freeze-dried berries and chocolate curls"
                width={900}
                height={900}
                loading="eager"
                decoding="async"
                className="aspect-square w-full rounded-[2.15rem] object-cover"
              />
            </div>
          </div>

          {/* Large Rotating Circular Seal Badge: MADE FRESH DAILY */}
          <div
            className="hero-reveal absolute -bottom-4 left-2 z-30 flex h-28 w-28 items-center justify-center rounded-full bg-cocoa-900 text-cream-100 shadow-elevated sm:bottom-2 sm:left-0 sm:h-36 sm:w-36"
            aria-label="Made Fresh Daily seal"
          >
            <svg
              viewBox="0 0 140 140"
              className="animate-slow-spin h-full w-full p-2"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="freshDailyCircle"
                  d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                />
              </defs>
              <text
                fill="#FFF8F1"
                fontSize="11.4"
                fontWeight="700"
                letterSpacing="2.9"
              >
                <textPath href="#freshDailyCircle" startOffset="0%">
                  MADE FRESH DAILY · DONUTVERSE ·
                </textPath>
              </text>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display-soft text-lg font-bold leading-none text-blush-200 sm:text-xl">
                6 AM
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-cream-200/80">
                Glazed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
