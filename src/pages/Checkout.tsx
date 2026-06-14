import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, Lock, CheckCircle2, Loader2, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../lib/CartContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type CheckoutStep = 'details' | 'processing' | 'success';

export default function Checkout() {
  const { cart, subtotal, clearCart, shippingCost } = useCart();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Dhaka',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required if provided';
    if (!formData.phone.trim() || formData.phone.length < 11) newErrors.phone = 'Valid 11-digit phone is required';
    if (!formData.address.trim()) newErrors.address = 'Shipping address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep('processing');
      setLoading(true);
      
      try {
        const orderData = {
          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image
          })),
          subtotal,
          shippingCost,
          total: subtotal + shippingCost,
          paymentMethod,
          shippingDetails: {
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            address: formData.address
          },
          status: 'Pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setOrderRef(docRef.id.slice(0, 8).toUpperCase());
        
        setTimeout(() => {
          setStep('success');
          clearCart();
        }, 1500);
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
        setStep('details');
      } finally {
        setLoading(false);
      }
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-brand-background min-h-screen flex items-center justify-center py-20 px-4">
        <Helmet>
          <title>Order Confirmed | Zyra Legecy</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white p-12 md:p-20 rounded-[4rem] text-center shadow-2xl border border-brand-accent space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full -ml-32 -mb-32" />
          
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-green-200 rounded-full scale-125"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">Order <br />Confirmed</h1>
            <p className="text-brand-secondary font-bold text-[10px] uppercase tracking-[0.4em]">Order Reference: ZL-{orderRef}</p>
          </div>

          <p className="text-gray-500 font-light leading-relaxed tracking-wide">
            Thank you, <span className="font-bold text-brand-primary">{formData.name}</span>. Your selection is now being prepared in our Dhaka fulfillment center under standard legacy protocols.
          </p>

          <div className="pt-6 flex flex-col gap-4">
            <Link 
              to="/shop" 
              className="w-full py-5 bg-brand-primary text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-brand-secondary hover:text-brand-primary transition-all duration-500"
            >
              CONTINUE SHOPPING
            </Link>
            <Link 
              to="/tracking" 
              className="w-full py-5 border border-brand-primary/10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-brand-accent transition-all"
            >
              TRACK SHIPMENT
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen py-10 md:py-20 lg:py-32 text-brand-primary font-sans relative">
      <Helmet>
        <title>Secure Checkout | Zyra Legecy</title>
      </Helmet>
      
      {step === 'processing' && (
        <div className="fixed inset-0 z-[200] bg-brand-background/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-brand-secondary animate-spin" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-brand-secondary/40" />
            </motion.div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold tracking-tight">Securing Your Selection</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 animate-pulse">Establishing Legacy Protocols...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Link to="/cart" className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 mb-16 hover:text-brand-secondary transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-4 group-hover:-translate-x-2 transition-transform duration-500" />
          Review Selections
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 text-center md:text-left items-center">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter">Secure Checkout</h1>
            <p className="text-gray-400 font-light tracking-[0.2em] uppercase text-[9px]">Exquisite handling for your Zyra Legecy items</p>
          </div>
          <div className="flex items-center bg-white px-5 py-2.5 rounded-full border border-brand-accent shadow-sm space-x-3">
            <Lock className="w-2.5 h-2.5 text-brand-secondary" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">SSL Tier 1 Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Form */}
          <div className="lg:col-span-7 space-y-6">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-10 rounded-[2rem] border border-brand-accent shadow-[0_30px_60px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/5 blur-[60px] rounded-full -mr-24 -mt-24" />
              <h2 className="text-xl font-serif font-bold mb-8 flex items-center tracking-tight gap-4">
                <span className="w-8 h-8 bg-brand-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-lg">01</span>
                Shipping Registry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Recipient Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    className={cn(
                      "w-full px-5 py-3 bg-brand-accent/30 border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all border-2 outline-none font-medium placeholder:text-gray-300",
                      errors.name && "border-red-200 bg-red-50/30"
                    )} 
                    placeholder="Enter full identity" 
                  />
                  {errors.name && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Digital Correspondence (Optional)</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    className={cn(
                      "w-full px-5 py-3 bg-brand-accent/30 border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all border-2 outline-none font-medium placeholder:text-gray-300",
                      errors.email && "border-red-200 bg-red-50/30"
                    )} 
                    placeholder="email@luxury.com (Optional)" 
                  />
                  {errors.email && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Telephonic Secure Line</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel" 
                    className={cn(
                      "w-full px-5 py-3 bg-brand-accent/30 border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all border-2 outline-none font-medium placeholder:text-gray-300",
                      errors.phone && "border-red-200 bg-red-50/30"
                    )} 
                    placeholder="+880 1XXX-XXXXXX" 
                  />
                  {errors.phone && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Destination Meta-City</label>
                  <div className="relative">
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 bg-brand-accent/30 border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all border-2 outline-none appearance-none font-medium"
                    >
                      <option>Dhaka</option>
                      <option>Chattogram</option>
                      <option>Khulna</option>
                      <option>Rajshahi</option>
                      <option>Rangpur</option>
                      <option>Sylhet</option>
                      <option>Barishal</option>
                      <option>Mymensingh</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowLeft className="w-3 h-3 rotate-[270deg] text-brand-secondary" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Fulfillment Location Details</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3} 
                    className={cn(
                      "w-full px-5 py-3 bg-brand-accent/30 border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all border-2 outline-none resize-none font-medium placeholder:text-gray-300",
                      errors.address && "border-red-200 bg-red-50/30"
                    )} 
                    placeholder="Grand Avenue, Suite, Landmark details..."
                  ></textarea>
                  {errors.address && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.address}</p>}
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 md:p-10 rounded-[2rem] border border-brand-accent shadow-[0_30px_60px_-20px_rgba(0,0,0,0.03)] overflow-hidden"
            >
              <h2 className="text-xl font-serif font-bold mb-8 flex items-center tracking-tight gap-4">
                <span className="w-8 h-8 bg-brand-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-lg">02</span>
                Transaction Medium
              </h2>
              <div className="space-y-4">
                {[
                  { id: 'cod', name: 'Legacy Cash Handover', desc: 'Secure payment upon physical arrival' },
                  { id: 'bkash', name: 'Digital Ledger Transfer', desc: 'bKash / Nagad / Rocket instant secure transfer' },
                ].map(method => (
                  <label 
                    key={method.id} 
                    className={cn(
                      "flex items-center justify-between p-5 border-2 cursor-pointer transition-all duration-700 rounded-2xl",
                      paymentMethod === method.id ? "border-brand-secondary bg-brand-secondary/5 shadow-inner" : "border-brand-accent hover:border-brand-secondary/30 bg-transparent"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center p-1">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-6 h-6 border-brand-secondary text-brand-secondary focus:ring-brand-secondary bg-transparent appearance-none rounded-full border-2 checked:bg-brand-secondary transition-all" 
                        />
                        {paymentMethod === method.id && <div className="absolute w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif font-bold text-lg tracking-tight leading-none">{method.name}</p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">{method.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-brand-primary text-white p-8 md:p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] relative overflow-hidden"
            >
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/20 blur-[80px] rounded-full -ml-24 -mb-24" />
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full -mr-16 -mt-16 rotate-45" />
              <h2 className="text-2xl font-serif font-bold mb-6 tracking-tighter">Order Synopsis</h2>
              <div className="space-y-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="w-16 h-20 bg-white/10 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/5 relative group">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="flex-grow space-y-1 py-0.5">
                      <p className="font-serif font-bold text-base leading-tight tracking-tight">{item.title}</p>
                      <div className="flex gap-3 text-[8px] font-bold uppercase tracking-[0.1em] text-white/50">
                        <span>QTY: {item.quantity}</span>
                        <span>SIZE: {item.size}</span>
                      </div>
                      <p className="text-brand-secondary font-bold text-xs">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-10 font-light tracking-wide pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-white/60">
                  <span className="uppercase tracking-[0.2em] text-[9px] font-bold">Subtotal Valuation</span>
                  <span className="font-bold tracking-widest">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-white/60">
                  <span className="uppercase tracking-[0.2em] text-[9px] font-bold">Logistics</span>
                  <span className="font-bold tracking-widest">{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between pt-6 border-t border-white/10 items-center">
                  <span className="text-xl font-serif font-bold tracking-tighter">Total Assets</span>
                  <span className="text-3xl font-serif font-bold text-brand-secondary tracking-tighter leading-none">{formatPrice(subtotal + shippingCost)}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="group relative w-full bg-brand-secondary text-brand-primary py-5 px-4 font-bold tracking-[0.3em] uppercase transition-all duration-700 rounded-2xl overflow-hidden active:scale-95 shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Order Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-white transition-all duration-700 -translate-x-full group-hover:translate-x-0" />
              </button>

              <div className="mt-8 grid grid-cols-2 gap-4 text-[8px] uppercase font-bold tracking-[0.2em] text-white/30 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-secondary mx-auto border border-white/10"><ShieldCheck className="w-4 h-4" /></div>
                  Vault Secure
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-secondary mx-auto border border-white/10"><Truck className="w-4 h-4" /></div>
                  Insured Priority
                </div>
              </div>
            </motion.section>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-brand-secondary/5 p-6 rounded-[2rem] border border-brand-secondary/10 backdrop-blur-sm group hover:bg-brand-secondary/10 transition-all duration-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1px] bg-brand-secondary/30" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-secondary">Bespoke Concierge</p>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed mb-6 font-light tracking-[0.1em]">Our human-centered logistics team is at your disposal for unique handling requests regarding your acquisition.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 text-[9px] font-bold text-brand-primary uppercase tracking-[0.3em] group-hover:text-brand-secondary transition-colors duration-500">
                Engage Curator <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}

