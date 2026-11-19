import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Ticket } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useCart } from '../context/CartContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Promotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const { promoApplied, applyPromoCode, openCart, itemCount } = useCart();
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.promo-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.8,
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

  const handleClaimDiscount = () => {
    applyPromoCode('SWEET15');
    if (itemCount > 0) {
      openCart();
    } else {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="promo-heading"
      className="relative bg-cream-100 py-12 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-strawberry-600 text-white shadow-elevated">
          <div className="grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
            {/* Left Copy & CTA */}
            <div className="relative z-10 lg:col-span-6">
              <div className="promo-reveal inline-flex items-center gap-2 rounded-full bg-cocoa-900/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cream-50">
                <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Welcome Treat · Code SWEET15</span>
              </div>

              <h2
                id="promo-heading"
                className="promo-reveal mt-5 font-display-soft text-4xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Life&apos;s Too Short for Just One Donut.
              </h2>

              <p className="promo-reveal mt-5 text-xl font-medium text-blush-100 sm:text-2xl">
                Get 15% OFF your first order.
              </p>

              <p className="promo-reveal mt-3 max-w-md text-sm leading-relaxed text-cream-100/90 sm:text-base">
                Build your custom box of warm handcrafted rings and unlock
                instant savings at checkout with code{' '}
                <strong className="font-bold text-white">SWEET15</strong>.
              </p>

              <div className="promo-reveal mt-8 flex flex-wrap items-center gap-4">
                <MagneticButton
                  onClick={handleClaimDiscount}
                  className="inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-cream-50 px-8 py-3.5 text-sm font-bold tracking-wide text-cocoa-900 shadow-card transition-colors hover:bg-cocoa-900 hover:text-cream-50 sm:text-base"
                >
                  {promoApplied ? (
                    <>
                      <Check className="h-4 w-4 text-strawberry-600" aria-hidden="true" />
                      <span>DISCOUNT APPLIED (SWEET15)</span>
                    </>
                  ) : (
                    <span>GET MY DISCOUNT</span>
                  )}
                </MagneticButton>
              </div>
            </div>

            {/* Right Editorial Pastry Box Photo + Promotional Badge */}
            <div className="promo-reveal relative lg:col-span-6">
              <div className="relative overflow-hidden rounded-[2rem] bg-cream-50 p-2.5 shadow-elevated">
                <img
                  src="/images/promo-box.jpg"
                  alt="Open pastel-pink DONUTVERSE box containing six assorted freshly glazed artisan donuts"
                  loading="lazy"
                  width={960}
                  height={720}
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                />
              </div>

              {/* Scalloped Promotional Stamp Badge */}
              <div
                aria-hidden="true"
                className="absolute -right-2 -top-5 flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-cream-50 bg-cocoa-900 text-center text-cream-50 shadow-elevated sm:-right-4 sm:-top-6 sm:h-28 sm:w-28"
              >
                <span className="font-display-soft text-2xl font-extrabold leading-none text-blush-200 sm:text-3xl">
                  15%
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100">
                  First Order
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
