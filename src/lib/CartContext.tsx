import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

export type ShippingLocation = 'inside' | 'outside' | null;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingLocation: ShippingLocation;
  setShippingLocation: (location: ShippingLocation) => void;
  shippingCost: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zyra_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingLocation, setShippingLocation] = useState<ShippingLocation>(null);

  useEffect(() => {
    localStorage.setItem('zyra_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === newItem.id && item.size === newItem.size);
      if (existing) {
        return prev.map(item => 
          (item.id === newItem.id && item.size === newItem.size) 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item.id === id && item.size === size) ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setShippingLocation(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const shippingCost = shippingLocation === 'inside' ? 70 : (shippingLocation === 'outside' ? 120 : 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      shippingLocation,
      setShippingLocation,
      shippingCost
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
