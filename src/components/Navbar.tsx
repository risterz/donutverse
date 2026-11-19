import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Our Donuts', href: '#collection', id: 'collection' },
  { label: 'Our Story', href: '#story', id: 'story' },
  { label: 'Locations', href: '#locations', id: 'locations' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function BrandLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="32" cy="32" r="28" fill="#E3A45B" />
        <path
          d="M32 6C17.64 6 6 17.64 6 32c0 3.2.58 6.26 1.64 9.09 2.38-.4 4.11-2.55 6.42-2.09 2.48.5 3.16 3.55 5.68 3.92 2.42.35 3.84-2.16 6.26-2.16 2.42 0 3.84 2.51 6.26 2.16 2.52-.37 3.2-3.42 5.68-3.92 2.31-.46 4.04 1.69 6.42 2.09 1.06-2.83 1.64-5.89 1.64-9.09 0-14.36-11.64-26-26-26Z"
          fill="#D92B4B"
        />
        <circle cx="32" cy="32" r="10.5" fill={inverted ? '#2A1510' : '#FFF8F1'} />
        <rect
          x="20"
          y="15"
          width="6"
          height="2.4"
          rx="1.2"
          transform="rotate(-25 20 15)"
          fill="#FFF8F1"
        />
        <rect
          x="39"
          y="14"
          width="6"
          height="2.4"
          rx="1.2"
          transform="rotate(30 39 14)"
          fill="#FCE4EC"
        />
        <rect
          x="45"
          y="26"
          width="5.5"
          height="2.4"
          rx="1.2"
          transform="rotate(65 45 26)"
          fill="#FFF8F1"
        />
      </svg>
      <span
        className={`font-display-soft text-xl font-extrabold tracking-tight ${inverted ? 'text-cream-100' : 'text-cocoa-900'
          }`}
      >
        DONUTVERSE
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.4] },
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-cream-50/95 backdrop-blur-md border-b border-cocoa-900/10 py-3 shadow-[0_6px_24px_-16px_rgba(42,21,16,0.22)]'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          aria-label="DONUTVERSE Home"
          className="rounded-lg py-1"
        >
          <BrandLogo />
        </a>

        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative py-2 text-sm font-medium transition-colors ${isActive
                  ? 'text-strawberry-600'
                  : 'text-cocoa-800 hover:text-strawberry-600'
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-strawberry-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open shopping bag, ${itemCount} items`}
            className="relative inline-flex h-11 items-center gap-2 rounded-full border border-cocoa-900/15 bg-cream-50 px-4 text-sm font-semibold text-cocoa-900 transition-colors hover:border-strawberry-600 hover:text-strawberry-600"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Bag</span>
            <motion.span
              key={itemCount}
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              aria-live="polite"
              className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${itemCount > 0
                ? 'bg-strawberry-600 text-white'
                : 'bg-cocoa-900/10 text-cocoa-800'
                }`}
            >
              {itemCount}
            </motion.span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cocoa-900/15 bg-cream-50 text-cocoa-900 transition-colors hover:border-strawberry-600 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav-panel"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mt-3 border-b border-cocoa-900/10 bg-cream-50 px-5 pb-6 pt-3 shadow-editorial lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex min-h-[44px] items-center justify-between rounded-xl px-4 text-base font-semibold transition-colors ${isActive
                        ? 'bg-blush-100 text-strawberry-600'
                        : 'text-cocoa-900 hover:bg-cream-200/70'
                        }`}
                    >
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
