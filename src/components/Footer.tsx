import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from './Navbar';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Donuts', href: '#collection' },
  { label: '3D Experience', href: '#experience' },
  { label: 'Our Story', href: '#story' },
  { label: 'Locations', href: '#locations' },
];

export function Footer() {
  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      className="bg-cocoa-900 text-cream-100"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        DONUTVERSE Footer and Contact Information
      </h2>

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <BrandLogo inverted />
            <p className="mt-4 font-display-editorial text-lg italic text-blush-200">
              A Little Hole Lot of Happiness.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200/80">
              Handcrafted artisan brioche donuts dipped daily in real fruit
              glazes, Belgian couverture chocolate, and ceremonial Uji matcha.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="DONUTVERSE on Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-100/20 text-cream-100 transition-colors hover:border-blush-200 hover:bg-blush-200 hover:text-cocoa-900"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="DONUTVERSE on TikTok"
                className="inline-flex h-11 items-center justify-center rounded-full border border-cream-100/20 px-4 text-xs font-bold uppercase tracking-wider text-cream-100 transition-colors hover:border-blush-200 hover:bg-blush-200 hover:text-cocoa-900"
              >
                TikTok
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="DONUTVERSE on Facebook"
                className="inline-flex h-11 items-center justify-center rounded-full border border-cream-100/20 px-4 text-xs font-bold uppercase tracking-wider text-cream-100 transition-colors hover:border-blush-200 hover:bg-blush-200 hover:text-cocoa-900"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blush-200">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleJump(e, link.href)}
                    className="inline-block py-1 text-cream-200/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blush-200">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-cream-200/85">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blush-200" aria-hidden="true" />
                <span>28 Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-blush-200" aria-hidden="true" />
                <a href="tel:+60322018490" className="hover:text-white hover:underline">
                  +60 3-2201 8490
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blush-200" aria-hidden="true" />
                <a
                  href="mailto:hello@donutverse.my"
                  className="hover:text-white hover:underline"
                >
                  hello@donutverse.my
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blush-200">
              Opening Hours
            </h3>
            <dl className="mt-5 space-y-3 text-sm text-cream-200/85">
              <div className="flex justify-between gap-4 border-b border-cream-100/10 pb-2.5">
                <dt>Monday to Friday</dt>
                <dd className="font-semibold text-cream-50">8:00 AM – 9:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-cream-100/10 pb-2.5">
                <dt>Saturday &amp; Sunday</dt>
                <dd className="font-semibold text-cream-50">8:30 AM – 10:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Fresh Glaze Drops</dt>
                <dd className="font-semibold text-blush-200">8 AM · 12 PM · 4 PM</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream-100/12 pt-8 text-xs text-cream-200/70 sm:flex-row">
          <p>© {new Date().getFullYear()} DONUTVERSE. All rights reserved.</p>
          <p>Handcrafted daily in Kuala Lumpur &amp; Penang.</p>
        </div>
      </div>
    </footer>
  );
}
