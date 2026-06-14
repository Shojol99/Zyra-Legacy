import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>((location.state as any)?.error || null);

  const { user, isAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Handle MasterAdmin bypass
    if (username.trim().toLowerCase() === 'masteradmin' && password === 'MasterAdmin') {
      try {
        await auth.signOut();
        await signInAnonymously(auth);
        sessionStorage.setItem('is_master_admin', 'true');
        navigate('/admin');
        return;
      } catch (err) {
        console.error('Anonymous admin login error:', err);
        setError('Master access failed. Ensure anonymous auth is enabled.');
        setLoading(false);
        return;
      }
    }

    try {
      await signInWithEmailAndPassword(auth, username, password);
      sessionStorage.removeItem('is_master_admin');
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Identity verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 font-sans selection:bg-brand-secondary/30">
      <Helmet>
        <title>Admin Access | Zyra Legacy</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {user && (
          <div className="mb-8 p-4 bg-white/50 backdrop-blur border border-brand-accent/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary uppercase">
                {user.email?.[0] || 'M'}
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-primary truncate max-w-[150px]">{user.email || 'Master Session'}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-brand-secondary">
                  {isAdmin ? 'Authenticated Admin' : 'Basic Access'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <Link to="/admin" className="text-[8px] font-bold uppercase tracking-widest bg-brand-primary text-white px-3 py-2 rounded-lg hover:bg-brand-secondary transition-colors">
                Dashboard
              </Link>
            )}
          </div>
        )}
        <div className="text-center mb-12">
           <Link to="/" className="inline-block mb-8">
              <h1 className="text-4xl font-serif font-bold text-brand-primary tracking-tighter">ZYRA <span className="text-brand-secondary">LEGACY</span></h1>
           </Link>
           <h2 className="text-xl font-medium tracking-tight text-brand-primary/80">Authority Verification</h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-2">Accessing Restricted Systems</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border border-brand-accent/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-brand-secondary/10 transition-colors duration-1000" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 ml-2">Username</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-secondary transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. MasterAdmin"
                    className="w-full bg-brand-accent/10 border-transparent rounded-[1.2rem] py-4 pl-14 pr-6 text-sm font-medium focus:bg-white focus:border-brand-secondary/30 outline-none transition-all ring-offset-0 focus:ring-4 focus:ring-brand-secondary/5"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 ml-2">Access Key (Password)</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-secondary transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-brand-accent/10 border-transparent rounded-[1.2rem] py-4 pl-14 pr-14 text-sm font-medium focus:bg-white focus:border-brand-secondary/30 outline-none transition-all ring-offset-0 focus:ring-4 focus:ring-brand-secondary/5"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-brand-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-primary text-white py-5 rounded-[1.2rem] font-bold text-[10px] uppercase tracking-[0.4em] relative overflow-hidden group shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-4"
                  >
                    Authenticate Access <ArrowRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-primary/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-widest text-gray-400 font-bold">
                <span className="bg-white px-4">Or bypass for testing</span>
              </div>
            </div>

            <button 
              type="button" 
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await signInAnonymously(auth);
                  navigate('/');
                } catch (err) {
                  setError('Anonymous access failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-transparent border-2 border-brand-accent/30 text-brand-primary py-4 rounded-[1.2rem] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent/5 transition-all"
            >
              Enter Anonymously
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
           <Link to="/" className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-secondary transition-colors underline-offset-8 hover:underline">
              Return to Public Gallery
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
