import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DonutCollection } from './components/DonutCollection';
import { BrandStory } from './components/BrandStory';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Testimonials } from './components/Testimonials';
import { Promotion } from './components/Promotion';
import { Locations } from './components/Locations';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { useCart } from './context/CartContext';

const Donut3DSection = lazy(() =>
  import('./components/Donut3DSection').then((m) => ({
    default: m.Donut3DSection,
  })),
);

function CartToastBanner() {
  const { toast, openCart } = useCart();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-cocoa-900 px-5 py-3 text-sm font-medium text-cream-50 shadow-elevated"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-strawberry-600 text-white">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={openCart}
              className="ml-1 text-xs font-bold uppercase tracking-wider text-blush-200 underline-offset-4 hover:underline"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream-100 text-cocoa-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cocoa-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream-50"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <DonutCollection />
        <Suspense
          fallback={
            <section
              id="experience"
              className="flex min-h-[540px] items-center justify-center bg-cocoa-900 py-24 text-cream-200"
            >
              <p className="text-sm font-medium tracking-wide">
                Loading interactive 3D donut studio...
              </p>
            </section>
          }
        >
          <Donut3DSection />
        </Suspense>
        <BrandStory />
        <WhyChooseUs />
        <Testimonials />
        <Promotion />
        <Locations />
        <Newsletter />
      </main>

      <Footer />
      <CartDrawer />
      <CartToastBanner />
    </div>
  );
}
