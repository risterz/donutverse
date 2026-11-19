import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DonutProduct } from '../data/donuts';

export interface CartItem {
  donut: DonutProduct;
  quantity: number;
}

interface CartToast {
  id: number;
  message: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  promoApplied: boolean;
  promoCode: string;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  toast: CartToast | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (donut: DonutProduct, quantity?: number) => void;
  removeItem: (donutId: string) => void;
  updateQuantity: (donutId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  removePromoCode: () => void;
  showToast: (message: string) => void;
}

const VALID_PROMO_CODE = 'SWEET15';
const PROMO_RATE = 0.15;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (donut: DonutProduct, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.donut.id === donut.id);
        if (existing) {
          return prev.map((item) =>
            item.donut.id === donut.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { donut, quantity }];
      });
      showToast(`Added ${donut.name} to your box`);
    },
    [showToast],
  );

  const removeItem = useCallback((donutId: string) => {
    setItems((prev) => prev.filter((item) => item.donut.id !== donutId));
  }, []);

  const updateQuantity = useCallback((donutId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.donut.id !== donutId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.donut.id === donutId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string): { ok: boolean; message: string } => {
      const normalized = rawCode.trim().toUpperCase();
      if (normalized === VALID_PROMO_CODE) {
        setPromoApplied(true);
        showToast('15% OFF first-order code SWEET15 applied');
        return { ok: true, message: 'Code SWEET15 applied (15% OFF).' };
      }
      return {
        ok: false,
        message: 'Invalid code. Try SWEET15 for 15% off your first order.',
      };
    },
    [showToast],
  );

  const removePromoCode = useCallback(() => {
    setPromoApplied(false);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.donut.price * item.quantity, 0),
    [items],
  );

  const discountAmount = useMemo(
    () => (promoApplied ? subtotal * PROMO_RATE : 0),
    [promoApplied, subtotal],
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      promoApplied,
      promoCode: VALID_PROMO_CODE,
      itemCount,
      subtotal,
      discountAmount,
      total,
      toast,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
      showToast,
    }),
    [
      items,
      isOpen,
      promoApplied,
      itemCount,
      subtotal,
      discountAmount,
      total,
      toast,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
      showToast,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
