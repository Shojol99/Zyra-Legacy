import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, Search, ArrowRight, Clock } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate tracking data
    setTracking({
      status: 'In Transit',
      location: 'Sorting Facility, Dhaka',
      estimate: 'Oct 28, 2025',
      steps: [
        { status: 'Order Placed', date: 'Oct 24, 10:30 AM', completed: true },
        { status: 'Quality Assured', date: 'Oct 24, 02:15 PM', completed: true },
        { status: 'Dispatched', date: 'Oct 25, 09:00 AM', completed: true },
        { status: 'In Transit', date: 'Oct 26, 11:45 AM', completed: false },
        { status: 'Delivered', date: 'Estimated Oct 28', completed: false },
      ]
    });
  };

  return (
    <div className="bg-brand-background min-h-screen py-20 lg:py-32 text-brand-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-20 space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            Logistics Transparency
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tighter"
          >
            Track Your Order
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-light tracking-widest uppercase text-xs"
          >
            Real-time guardianship of your Zyra Legacy items
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-brand-accent shadow-2xl mb-16"
        >
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-secondary transition-colors" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Signature Order ID (e.g. #ZY-9821)"
                className="w-full pl-16 pr-8 py-5 bg-brand-accent/30 border-transparent rounded-2xl focus:bg-white focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none font-light tracking-widest placeholder:text-gray-300"
              />
            </div>
            <button className="px-12 py-5 bg-brand-primary text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-brand-secondary transition-all duration-500 shadow-xl active:scale-95 shrink-0">
              Locate Item
            </button>
          </form>
        </motion.div>

        {tracking && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-brand-accent/30 p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Current Status</p>
                <p className="text-2xl font-serif font-bold text-brand-secondary tracking-tight">{tracking.status}</p>
              </div>
              <div className="bg-brand-accent/30 p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Last Location</p>
                <p className="text-xl font-serif font-bold tracking-tight">{tracking.location}</p>
              </div>
              <div className="bg-brand-accent/30 p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Est. Presence</p>
                <p className="text-xl font-serif font-bold tracking-tight">{tracking.estimate}</p>
              </div>
            </div>

            <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-brand-accent shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full" />
              <h2 className="text-3xl font-serif font-bold mb-16 tracking-tight">Timeline of Possession</h2>
              <div className="space-y-0 relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-brand-accent" />
                {tracking.steps.map((step: any, i: number) => (
                  <div key={i} className="flex gap-10 pb-12 last:pb-0 relative">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white",
                      step.completed ? "bg-brand-secondary text-white" : "bg-brand-accent text-gray-400"
                    )}>
                      {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1">
                      <p className={cn("text-xl font-serif font-bold tracking-tight", step.completed ? "text-brand-primary" : "text-gray-400")}>
                        {step.status}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
