import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMYR } from '../data/donuts';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    itemCount,
    subtotal,
    discountAmount,
    total,
    promoApplied,
    promoCode,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [codeInput, setCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'ok' | 'error';
    text: string;
  } | null>(null);
  const [checkoutState, setCheckoutState] = useState<
    'idle' | 'processing' | 'confirmed'
  >('idle');
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    if (items.length > 0 && checkoutState === 'confirmed') {
      setCheckoutState('idle');
    }
  }, [items.length, checkoutState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  const handlePromoSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(codeInput);
    setPromoFeedback({ type: res.ok ? 'ok' : 'error', text: res.message });
    if (res.ok) setCodeInput('');
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCheckoutState('processing');
    window.setTimeout(() => {
      const code = `DV-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderRef(code);
      setCheckoutState('confirmed');
      clearCart();
    }, 750);
  };

  const handleBrowse = () => {
    setCheckoutState('idle');
    closeCart();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-cocoa-950/55"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-cream-50 text-cocoa-900 shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cocoa-900/10 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-strawberry-600" aria-hidden="true" />
                <h2
                  id="cart-drawer-title"
                  className="font-display-soft text-2xl font-bold text-cocoa-900"
                >
                  Your Donut Box
                </h2>
                <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-xs font-bold text-cocoa-900">
                  {itemCount}
                </span>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close shopping bag"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-700 transition-colors hover:bg-cocoa-900/8 hover:text-cocoa-900"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {checkoutState === 'confirmed' ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-strawberry-600">
                    <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display-soft text-2xl font-bold text-cocoa-900">
                    Order Confirmed!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-cocoa-700">
                    Our bakers are glazing your fresh box now. Reference{' '}
                    <strong className="font-bold text-cocoa-900">{orderRef}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-cocoa-900 px-7 text-sm font-semibold text-cream-50 transition-colors hover:bg-strawberry-600"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-strawberry-600">
                    <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display-soft text-2xl font-bold text-cocoa-900">
                    Your box is empty
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-cocoa-700">
                    Pick your favorite handcrafted glazes from our signature
                    collection to start building a fresh box.
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-strawberry-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-strawberry-700"
                  >
                    Browse Signature Donuts
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ donut, quantity }) => (
                    <li
                      key={donut.id}
                      className="flex gap-4 rounded-2xl border border-cocoa-900/10 bg-cream-100/75 p-3.5"
                    >
                      <img
                        src={donut.image}
                        alt={donut.name}
                        width={84}
                        height={84}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-display-soft text-base font-bold text-cocoa-900">
                              {donut.name}
                            </h3>
                            <p className="text-xs font-semibold text-strawberry-600">
                              {formatMYR(donut.price)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(donut.id)}
                            aria-label={`Remove ${donut.name} from bag`}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-600 transition-colors hover:bg-strawberry-600/10 hover:text-strawberry-700"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-cocoa-900/15 bg-cream-50 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(donut.id, quantity - 1)}
                              aria-label={`Decrease quantity of ${donut.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-900 hover:bg-cocoa-900/10"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="min-w-[1.75rem] text-center text-sm font-bold text-cocoa-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(donut.id, quantity + 1)}
                              aria-label={`Increase quantity of ${donut.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-900 hover:bg-cocoa-900/10"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="font-display-editorial text-sm font-bold text-cocoa-900">
                            {formatMYR(donut.price * quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer Totals & Promo */}
            {items.length > 0 && checkoutState !== 'confirmed' && (
              <div className="border-t border-cocoa-900/10 bg-cream-100 px-6 py-5">
                {promoApplied ? (
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-blush-100 px-3.5 py-2.5 text-xs font-semibold text-cocoa-900">
                    <span className="inline-flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-strawberry-600" aria-hidden="true" />
                      <span>Promo {promoCode} applied (15% OFF)</span>
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-strawberry-700 underline hover:text-strawberry-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="mb-4">
                    <div className="flex gap-2">
                      <label htmlFor="promo-code-input" className="sr-only">
                        Promo code
                      </label>
                      <input
                        id="promo-code-input"
                        type="text"
                        value={codeInput}
                        onChange={(e) => {
                          setCodeInput(e.target.value);
                          setPromoFeedback(null);
                        }}
                        placeholder="Promo code (try SWEET15)"
                        className="min-h-[44px] flex-1 rounded-full border border-cocoa-900/15 bg-cream-50 px-4 text-xs font-medium text-cocoa-900 placeholder:text-cocoa-500 focus:border-strawberry-600 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="min-h-[44px] rounded-full border border-cocoa-900/20 bg-cream-50 px-4 text-xs font-bold text-cocoa-900 transition-colors hover:border-cocoa-900 hover:bg-cocoa-900 hover:text-cream-50"
                      >
                        Apply
                      </button>
                    </div>
                    {promoFeedback && (
                      <p
                        className={`mt-2 text-xs font-medium ${promoFeedback.type === 'error'
                          ? 'text-strawberry-700'
                          : 'text-cocoa-800'
                          }`}
                      >
                        {promoFeedback.text}
                      </p>
                    )}
                  </form>
                )}

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-cocoa-700">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-cocoa-900">
                      {formatMYR(subtotal)}
                    </dd>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-strawberry-700">
                      <dt>First-Order Discount (15%)</dt>
                      <dd className="font-semibold">
                        -{formatMYR(discountAmount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-cocoa-900/10 pt-2.5 text-base font-bold text-cocoa-900">
                    <dt>Total</dt>
                    <dd className="font-display-editorial text-xl">
                      {formatMYR(total)}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutState === 'processing'}
                  className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-strawberry-600 px-6 text-sm font-bold text-white transition-colors hover:bg-strawberry-700 disabled:opacity-75"
                >
                  {checkoutState === 'processing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Preparing Your Box...</span>
                    </>
                  ) : (
                    <span>Place Order · {formatMYR(total)}</span>
                  )}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
