import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.story-reveal', {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      gsap.to('.story-parallax-img', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream-100 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
        {/* Left Asymmetrical Editorial Photograph */}
        <div className="relative lg:col-span-6">
          <div className="story-reveal relative overflow-hidden rounded-t-[12rem] rounded-b-[2.5rem] bg-blush-100 p-3 shadow-editorial sm:p-4">
            <div className="overflow-hidden rounded-t-[11rem] rounded-b-[2rem]">
              <img
                src="/images/story-atelier.jpg"
                alt="Pastry chef hands dipping warm golden brioche donuts into glossy strawberry glaze on a cream marble counter"
                loading="lazy"
                width={800}
                height={1066}
                className="story-parallax-img aspect-[3/4] w-full scale-[1.06] object-cover"
              />
            </div>
          </div>

          {/* Editorial Craft Note */}
          <div className="story-reveal mt-6 rounded-2xl border border-cocoa-900/10 bg-cream-50 p-5 shadow-card sm:absolute sm:-bottom-6 sm:right-6 sm:mt-0 sm:max-w-[260px]">
            <p className="font-display-soft text-lg font-bold text-cocoa-900">
              18-Hour Cold Proof
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-cocoa-700">
              Slow fermentation develops our feather-light crumb and crisp golden
              halo before a single ring touches the glaze bowl.
            </p>
          </div>
        </div>

        {/* Right Editorial Story Column */}
        <div className="lg:col-span-6 lg:pl-4">
          <p className="story-reveal text-xs font-bold uppercase tracking-[0.2em] text-strawberry-600">
            Our Story
          </p>

          <h2 className="story-reveal mt-3 font-display-soft text-4xl font-extrabold leading-[1.05] tracking-tight text-cocoa-900 sm:text-5xl lg:text-6xl">
            Made with Love.
            <span className="mt-1 block italic text-strawberry-600">
              Baked with Magic.
            </span>
          </h2>

          <p className="story-reveal mt-7 font-display-editorial text-xl leading-relaxed text-cocoa-800 sm:text-2xl">
            We believe happiness comes in little circles. Every donut is
            handcrafted using carefully selected ingredients, fresh dough, and a
            whole lot of love.
          </p>

          <p className="story-reveal mt-6 text-base leading-relaxed text-cocoa-700">
            Born in a sunlit Bangsar kitchen, DONUTVERSE began with one simple
            ritual: waking before sunrise to roll cultured butter into brioche
            dough and simmering whole Cameron Highlands strawberries instead of
            reaching for artificial extracts.
          </p>

          <p className="story-reveal mt-4 text-base leading-relaxed text-cocoa-700">
            Every tray leaves our marble counter glazed by hand, never frozen,
            never rushed. That is why every bite carries the warmth of a pastry
            shop built for joy.
          </p>

          {/* Editorial Process Milestones */}
          <dl className="story-reveal mt-10 grid grid-cols-1 gap-6 border-t border-cocoa-900/12 pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-cocoa-600">
                Flour &amp; Butter
              </dt>
              <dd className="mt-1 font-display-soft text-lg font-bold text-cocoa-900">
                French Cultured
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-cocoa-600">
                Chocolate
              </dt>
              <dd className="mt-1 font-display-soft text-lg font-bold text-cocoa-900">
                70% Belgian Dark
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-cocoa-600">
                Daily Rhythm
              </dt>
              <dd className="mt-1 font-display-soft text-lg font-bold text-cocoa-900">
                Small Batches Only
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
