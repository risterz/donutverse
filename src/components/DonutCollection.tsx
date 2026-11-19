import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  DONUTS,
  DONUT_CATEGORIES,
  formatMYR,
  type DonutCategory,
  type DonutProduct,
} from '../data/donuts';
import { useCart } from '../context/CartContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function DonutCard({ donut }: { donut: DonutProduct }) {
  const { items, addItem, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find((i) => i.donut.id === donut.id);
  const qtyInCart = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem(donut, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-cocoa-900/8 bg-cream-50 transition-shadow duration-300 hover:shadow-editorial"
    >
      <div
        className="relative overflow-hidden p-5 sm:p-6"
        style={{ backgroundColor: donut.accentBg }}
      >
        {donut.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-semibold text-cocoa-900 shadow-sm">
            {donut.badge}
          </span>
        )}
        <div className="overflow-hidden rounded-2xl bg-cream-100">
          <img
            src={donut.image}
            alt={`${donut.name} handcrafted donut`}
            loading="lazy"
            width={640}
            height={640}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cocoa-600">
              {donut.tastingNote}
            </p>
            <h3 className="mt-1 font-display-soft text-2xl font-bold leading-tight text-cocoa-900">
              {donut.name}
            </h3>
          </div>
          <span className="shrink-0 font-display-editorial text-xl font-bold text-strawberry-600">
            {formatMYR(donut.price)}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-cocoa-700">
          {donut.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-cocoa-900/8 pt-5">
          {qtyInCart > 0 ? (
            <div className="flex w-full items-center justify-between gap-3">
              <div
                className="inline-flex items-center rounded-full border border-cocoa-900/15 bg-cream-100 p-1"
                role="group"
                aria-label={`${donut.name} quantity in bag`}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(donut.id, qtyInCart - 1)}
                  aria-label={`Decrease quantity of ${donut.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-900 transition-colors hover:bg-cocoa-900/10"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-bold text-cocoa-900">
                  {qtyInCart}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(donut.id, qtyInCart + 1)}
                  aria-label={`Increase quantity of ${donut.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-900 transition-colors hover:bg-cocoa-900/10"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <span className="text-xs font-semibold text-cocoa-600">
                In your box
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${justAdded
                ? 'bg-cocoa-900 text-cream-50'
                : 'bg-cocoa-900 text-cream-50 hover:bg-strawberry-600 active:scale-[0.98]'
                }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function DonutCollection() {
  const [selectedCategory, setSelectedCategory] = useState<DonutCategory>('All');
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const filteredDonuts = useMemo(() => {
    if (selectedCategory === 'All') return DONUTS;
    return DONUTS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.collection-header-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative bg-cream-100 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="collection-header-reveal text-xs font-bold uppercase tracking-[0.2em] text-strawberry-600">
              Signature Collection
            </p>
            <h2 className="collection-header-reveal mt-3 font-display-soft text-4xl font-extrabold leading-[1.05] tracking-tight text-cocoa-900 sm:text-5xl lg:text-6xl">
              Meet Your New <span className="italic text-strawberry-600">Obsession.</span>
            </h2>
          </div>

          {/* Interactive Category Filter */}
          <div
            role="tablist"
            aria-label="Filter donuts by flavor category"
            className="collection-header-reveal flex flex-wrap gap-2"
          >
            {DONUT_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              const count =
                category === 'All'
                  ? DONUTS.length
                  : DONUTS.filter((d) => d.category === category).length;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold transition-colors ${isSelected
                    ? 'text-white'
                    : 'border border-cocoa-900/15 bg-cream-50 text-cocoa-800 hover:border-strawberry-600 hover:text-strawberry-600'
                    }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-full bg-cocoa-900"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {category}{' '}
                    <span className={isSelected ? 'text-blush-200' : 'text-cocoa-500'}>
                      ({count})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredDonuts.map((donut) => (
              <DonutCard key={donut.id} donut={donut} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
