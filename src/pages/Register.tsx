import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-brand-accent/40 backdrop-blur-2xl p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] space-y-10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="text-center relative z-10">
            <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">Join Us</h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Begin your Zyra Legacy journey</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-secondary transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-brand-background border-white/5 rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none border font-light tracking-wide placeholder:text-gray-600" 
                  placeholder="Full Name"
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-secondary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-brand-background border-white/5 rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none border font-light tracking-wide placeholder:text-gray-600" 
                  placeholder="Registry Email"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-secondary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-brand-background border-white/5 rounded-2xl focus:border-brand-secondary focus:ring-0 transition-all text-sm outline-none border font-light tracking-wide placeholder:text-gray-600" 
                  placeholder="Secret Cipher"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-brand-background rounded-2xl border border-white/5">
              <Shield className="w-5 h-5 text-brand-secondary shrink-0" />
              <p className="text-[9px] text-gray-500 leading-relaxed font-medium uppercase tracking-widest">
                By establishing profile, you agree to our <a href="#" className="text-white hover:text-brand-secondary underline underline-offset-4 transition-colors">Manifesto</a> and <a href="#" className="text-white hover:text-brand-secondary underline underline-offset-4 transition-colors">Integrity Clause</a>.
              </p>
            </div>

            <button className="w-full bg-white text-black py-5 rounded-2xl font-bold tracking-[0.3em] uppercase hover:bg-brand-secondary transition-all duration-700 shadow-2xl flex items-center justify-center group active:scale-95">
              CREATE PROFILE
              <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </form>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mr-2">Existing Member?</span>
            <Link to="/login" className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary hover:text-white transition-colors underline underline-offset-8">Identify Yourself</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
