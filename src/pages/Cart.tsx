import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, ArrowRight, Truck, Lock, MessageCircle, Check } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useCart } from '../lib/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, shippingLocation, setShippingLocation, shippingCost } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>(cart.map(i => `${i.id}-${i.size}`));
  
  const toggleItemSelection = (uniqueId: string) => {
    setSelectedItems(prev => 
      prev.includes(uniqueId) ? prev.filter(item => item !== uniqueId) : [...prev, uniqueId]
    );
  };

  const selectedProducts = cart.filter(item => selectedItems.includes(`${item.id}-${item.size}`));
  const subtotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="bg-brand-background min-h-screen flex items-center justify-center pt-20">
        <Helmet>
          <title>Your Bag | Zyra Legacy</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-16 bg-white rounded-full mb-10 shadow-2xl relative border border-brand-accent group"
          >
            <div className="absolute inset-0 bg-brand-secondary/5 blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000" />
            <ShoppingBag className="w-24 h-24 text-brand-secondary relative z-10" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">Your Bag is Empty</h2>
            <p className="text-gray-400 mb-12 text-lg font-light max-w-md mx-auto leading-relaxed tracking-wide">
              It seems your selection is awaiting its first masterpiece. Discover our latest arrivals today.
            </p>
          </div>
          <Link to="/shop" className="inline-flex items-center justify-center px-16 py-6 bg-brand-primary text-white font-bold tracking-[0.4em] uppercase hover:bg-brand-secondary hover:text-brand-primary transition-all duration-700 shadow-2xl rounded-2xl group">
            BEGIN SHOPPING
            <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen text-brand-primary font-sans md:pt-12">
      <Helmet>
        <title>Shopping Bag | Zyra Legacy</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-20 gap-6 text-center md:text-left items-center md:items-end">
          <div className="space-y-2 md:space-y-6">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-brand-secondary">Bespoke Selection</p>
            <h1 className="text-4xl md:text-8xl font-serif font-bold tracking-tighter leading-none">Shopping Bag</h1>
          </div>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <p className="text-gray-400 font-bold tracking-[0.3em] text-[9px] md:text-[10px] uppercase md:border-r border-brand-primary/10 md:pr-6">
                {cart.length} Pieces • {selectedItems.length} Selected
              </p>
              <span className="text-brand-secondary font-serif italic text-xl md:text-3xl tracking-tighter">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="hidden md:grid grid-cols-12 gap-10 pb-8 border-b border-brand-primary/5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                <div className="col-span-12 md:col-span-6">Exquisite Selection</div>
                <div className="md:col-span-2 text-center text-brand-secondary">Investment</div>
                <div className="md:col-span-2 text-center">Volume</div>
                <div className="md:col-span-2 text-right">Subtotal</div>
              </div>

              {/* Container - Show all items */}
              <div className="space-y-4 md:space-y-12">
                {cart.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.size}`} 
                    layout
                    className={cn(
                      "flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-10 p-3 md:p-0 md:pb-12 border border-brand-primary/5 md:border-0 md:border-b md:border-brand-primary/5 items-center group rounded-2xl md:rounded-none relative transition-all bg-white md:bg-transparent shadow-sm md:shadow-none",
                      !selectedItems.includes(`${item.id}-${item.size}`) && "opacity-50 grayscale bg-gray-50/10"
                    )}
                  >
                    {/* Multi-select logic */}
                    <button 
                      onClick={() => toggleItemSelection(`${item.id}-${item.size}`)}
                      className={cn(
                        "absolute top-3 left-3 z-10 w-5 h-5 rounded-full border border-brand-primary/10 flex items-center justify-center transition-all",
                        selectedItems.includes(`${item.id}-${item.size}`) ? "bg-brand-secondary border-brand-secondary text-white" : "bg-white hover:border-brand-secondary"
                      )}
                    >
                      {selectedItems.includes(`${item.id}-${item.size}`) && <Check className="w-3 h-3" />}
                    </button>

                    <div className="md:col-span-6 flex flex-row gap-4 md:gap-10 items-center w-full pl-6 md:pl-0">
                      <div className="w-16 h-20 md:w-36 md:h-48 bg-brand-accent/40 rounded-xl md:rounded-[2rem] overflow-hidden shrink-0 shadow-sm border border-white/5 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      </div>
                      <div className="flex flex-col space-y-1 md:space-y-6 flex-grow">
                        <div className="space-y-0.5">
                          <Link to={`/product/${item.id}`} className="font-serif font-bold text-sm md:text-2xl tracking-tight leading-tight hover:text-brand-secondary transition-colors inline-block">{item.title}</Link>
                          <p className="text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">ID: ZL-00{item.id}</p>
                        </div>
                        <div className="flex gap-4 md:gap-8 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-brand-secondary mr-2" /> {item.color}</span>
                          <span>Size {item.size}</span>
                        </div>
                        <div className="flex gap-6 md:gap-8 pt-0.5">
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 flex items-center transition-all"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center w-full md:col-span-2 pt-1 md:pt-0 border-t md:border-0 border-brand-primary/5">
                      <span className="text-[7px] md:hidden font-bold uppercase tracking-widest text-gray-400">Price</span>
                      <span className="font-bold tracking-widest text-[9px] md:text-sm text-brand-secondary">{formatPrice(item.price)}</span>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center w-full md:col-span-2">
                      <span className="text-[7px] md:hidden font-bold uppercase tracking-widest text-gray-400">Qty</span>
                      <div className="inline-flex items-center bg-brand-accent/50 border border-brand-primary/5 rounded-md p-0.5 px-1.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center hover:bg-white text-gray-400 hover:text-brand-primary rounded transition-all font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-5 md:w-8 text-[9px] md:text-[11px] font-bold text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center hover:bg-white text-gray-400 hover:text-brand-primary rounded transition-all font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between md:justify-end items-center w-full md:col-span-2">
                      <span className="text-[7px] md:hidden font-bold uppercase tracking-widest text-gray-400">Total</span>
                      <span className="font-serif font-bold text-base md:text-2xl tracking-tighter text-brand-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

            <div className="flex justify-center md:justify-start">
              <Link to="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-brand-secondary group py-8 md:py-16 hover:translate-x-4 transition-all duration-500">
                <ArrowLeft className="w-4 h-4 mr-4 md:mr-6 group-hover:-translate-x-2 transition-transform duration-500" />
                Explore Archives
              </Link>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-brand-accent shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 md:mb-12 tracking-tighter text-center md:text-left">Synopsis</h2>
              
              <div className="space-y-6 md:space-y-8 mb-10 md:mb-16">
                <div className="flex justify-between items-center pb-4 md:pb-6 border-b border-brand-primary/5">
                  <span className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">Valuation</span>
                  <span className="font-bold tracking-widest text-sm">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">Fulfillment Passage</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => setShippingLocation('inside')}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                        shippingLocation === 'inside' ? "border-brand-secondary bg-brand-secondary/5 shadow-sm" : "border-brand-primary/5 hover:border-brand-secondary/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-all", shippingLocation === 'inside' ? "border-brand-secondary bg-brand-secondary" : "border-gray-200 bg-white")}>
                           {shippingLocation === 'inside' && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Inside Dhaka</span>
                      </div>
                      <span className="font-bold text-[10px] tracking-widest">{formatPrice(70)}</span>
                    </button>
                    <button 
                      onClick={() => setShippingLocation('outside')}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                        shippingLocation === 'outside' ? "border-brand-secondary bg-brand-secondary/5 shadow-sm" : "border-brand-primary/5 hover:border-brand-secondary/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-all", shippingLocation === 'outside' ? "border-brand-secondary bg-brand-secondary" : "border-gray-200 bg-white")}>
                           {shippingLocation === 'outside' && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Outside Dhaka</span>
                      </div>
                      <span className="font-bold text-[10px] tracking-widest">{formatPrice(120)}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 pt-4 border-t border-brand-primary/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xl md:text-2xl font-serif font-bold tracking-tight">Total Assets</span>
                    <span className="text-3xl md:text-4xl font-serif font-bold text-brand-primary tracking-tighter leading-none">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {!shippingLocation && selectedItems.length > 0 && (
                  <p className="text-[8px] text-brand-secondary font-bold uppercase tracking-widest text-center animate-pulse">Please select a shipping passage</p>
                )}
                <Link 
                  to="/checkout" 
                  className={cn(
                    "group relative flex items-center justify-center w-full bg-brand-primary text-white py-6 md:py-8 font-bold tracking-[0.4em] uppercase transition-all duration-700 rounded-2xl md:rounded-3xl overflow-hidden active:scale-95 shadow-xl",
                    (selectedItems.length === 0 || !shippingLocation) && "opacity-50 pointer-events-none grayscale"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-4">
                    Checkout
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-brand-secondary transition-all duration-700 scale-x-0 group-hover:scale-x-100 origin-left" />
                </Link>
                <div className="flex items-center justify-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
                  <span className="flex items-center gap-2"><Lock className="w-3 h-3 md:w-4 md:h-4" /> Secure</span>
                  <span className="flex items-center gap-2"><Truck className="w-3 h-3 md:w-4 md:h-4" /> Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Checkout Button - Mobile Only (Top Position) */}
      <div className="fixed top-[4.5rem] left-0 right-0 z-[60] px-4 md:hidden flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto"
        >
          <Link 
            to="/checkout"
            className={cn(
              "bg-brand-primary text-white py-3 px-8 rounded-full shadow-2xl flex items-center gap-3 font-bold text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-all border border-white/20 backdrop-blur-md bg-opacity-90",
              (selectedItems.length === 0 || !shippingLocation) && "opacity-50 cursor-not-allowed pointer-events-none grayscale"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {!shippingLocation ? "Select Passage" : "Secure Checkout"}
          </Link>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

