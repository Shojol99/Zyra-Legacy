import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  X,
  Type
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this token?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Privilege Tokens</h1>
          <p className="text-slate-500 text-sm">Design and distribute bespoke value incentives for your clientele.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Mint Token
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : coupons.map((coupon, i) => (
          <motion.div 
            key={coupon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative flex flex-col"
          >
            <div className="p-8 flex-grow">
              <div className="flex items-center justify-between mb-8">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Tag className="w-6 h-6" />
                 </div>
                 <span className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border",
                    coupon.status === 'Active' ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-rose-100 text-rose-600 bg-rose-50"
                  )}>
                    {coupon.status || 'Active'}
                  </span>
              </div>
              
              <div className="space-y-1 mb-8">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Token Signature</p>
                <h3 className="text-3xl font-serif font-bold text-slate-900 tracking-tighter">{coupon.code}</h3>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl space-y-4 mb-8">
                 <div className="flex justify-between items-center pb-3 border-b border-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Yield Value</span>
                    <span className="font-bold text-indigo-600">{coupon.type === 'percent' ? `${coupon.value}% Off` : `${formatPrice(coupon.value)} Off`}</span>
                 </div>
                 <div className="flex justify-between items-center pb-3 border-b border-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Circulation Limit</span>
                    <span className="font-bold text-slate-700">{coupon.used || 0} / {coupon.limit}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Valid Until</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-indigo-400" /> {coupon.expiry}</span>
                 </div>
              </div>

              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${((coupon.used || 0) / coupon.limit) * 100}%` }}
                   className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", coupon.status === 'Active' ? 'bg-indigo-600' : 'bg-slate-400')}
                 />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                 <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="flex-grow text-slate-400 hover:text-rose-500 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Decommission
                 </button>
                 <div className="h-4 w-[1px] bg-slate-100" />
                 <button 
                  onClick={() => {
                    setEditingCoupon(coupon);
                    setShowForm(true);
                  }}
                  className="flex-grow text-slate-400 hover:text-indigo-600 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    Edit Parameters <ArrowRight className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
            {coupon.status === 'Expired' && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                 <div className="bg-white border border-rose-100 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Access Restricted</span>
                 </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <CouponForm 
            coupon={editingCoupon}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchCoupons();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CouponForm({ coupon, onClose, onSuccess }: { coupon?: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    type: coupon?.type || 'percent',
    value: coupon?.value || 0,
    expiry: coupon?.expiry || new Date().toISOString().split('T')[0],
    limit: coupon?.limit || 100,
    status: coupon?.status || 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.value <= 0) return alert('Invalid parameters');
    setLoading(true);

    try {
      if (coupon?.id) {
        await updateDoc(doc(db, 'coupons', coupon.id), {
          ...formData,
          createdAt: coupon.createdAt || serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...formData,
          used: 0,
          createdAt: serverTimestamp()
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to mint token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden"
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Token Orchestration</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Signature Code</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-2xl font-mono font-bold text-indigo-600 focus:bg-white transition-all outline-none"
                  placeholder="LEGACY25"
                />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Incentive Tier</label>
                   <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                   >
                     <option value="percent">Percentage Yield (%)</option>
                     <option value="fixed">Fixed Reduction (BDT)</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Value Projection</label>
                   <input 
                    type="number" 
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-lg font-bold text-slate-900 focus:bg-white outline-none"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Sunset Date (Expiry)</label>
                   <input 
                    type="date" 
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white outline-none"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Threshold Limit</label>
                   <input 
                    type="number" 
                    value={formData.limit}
                    onChange={e => setFormData({...formData, limit: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white outline-none"
                   />
                </div>
             </div>

             <div className="pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {coupon?.id ? 'Adjust Parameters' : 'Authorize Minting'}
                </button>
             </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
