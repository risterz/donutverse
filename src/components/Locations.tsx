import { useState } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { LOCATIONS } from '../data/donuts';

export function Locations() {
  const [selectedId, setSelectedId] = useState(LOCATIONS[0].id);

  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="relative bg-cream-100 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-strawberry-600">
              Visit Our Boutiques
            </p>
            <h2
              id="locations-heading"
              className="mt-3 font-display-soft text-4xl font-extrabold leading-[1.06] tracking-tight text-cocoa-900 sm:text-5xl"
            >
              Warm from the Fryer,{' '}
              <span className="italic text-strawberry-600">Near You.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cocoa-700 sm:text-base">
            Step into our open-glaze kitchens across Kuala Lumpur and Penang for
            warm morning batches, espresso pairings, and signature gift boxes.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {LOCATIONS.map((loc) => {
            const active = loc.id === selectedId;
            return (
              <div
                key={loc.id}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                onClick={() => setSelectedId(loc.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(loc.id);
                  }
                }}
                className={`cursor-pointer rounded-3xl border p-7 transition-all duration-250 ${active
                  ? 'border-strawberry-600 bg-cream-50 shadow-editorial'
                  : 'border-cocoa-900/10 bg-cream-50/70 hover:border-cocoa-900/25 hover:bg-cream-50'
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa-900">
                    {loc.city}
                  </span>
                  {active && (
                    <span className="text-xs font-semibold text-strawberry-600">
                      Selected Kitchen
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display-soft text-2xl font-bold text-cocoa-900">
                  {loc.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
                  {loc.note}
                </p>

                <ul className="mt-6 space-y-3 border-t border-cocoa-900/10 pt-5 text-sm text-cocoa-800">
                  <li className="flex items-start gap-2.5">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-strawberry-600"
                      aria-hidden="true"
                    />
                    <span>{loc.address}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock
                      className="h-4 w-4 shrink-0 text-strawberry-600"
                      aria-hidden="true"
                    />
                    <span>{loc.hours}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone
                      className="h-4 w-4 shrink-0 text-strawberry-600"
                      aria-hidden="true"
                    />
                    <a
                      href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-strawberry-600 hover:underline"
                    >
                      {loc.phone}
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
