import { motion } from 'motion/react';
import { ShoppingBag, Heart, Star, LogOut, Settings, Package, MapPin } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const RECENT_ORDERS = [
    { id: '#ZY-9821', date: 'Oct 24, 2025', total: 2570, status: 'Delivered' },
    { id: '#ZY-7652', date: 'Sep 12, 2025', total: 1850, status: 'Processing' },
  ];

  return (
    <div className="bg-brand-background min-h-screen py-20 lg:py-32 text-brand-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="flex-grow space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-accent/40 backdrop-blur-2xl p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
              <div className="w-32 h-32 bg-white text-black rounded-full flex items-center justify-center text-5xl font-serif font-bold shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 border-4 border-brand-accent">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="text-center md:text-left flex-grow relative z-10 space-y-3">
                <h1 className="text-5xl font-serif font-bold tracking-tighter">Salve, {user?.displayName?.split(' ')[0] || 'Member'}!</h1>
                <p className="text-gray-400 text-sm font-light tracking-wide max-w-lg leading-relaxed uppercase text-[10px] tracking-[0.2em]">Curating your personal style legacy at Zyra</p>
              </div>
              <div className="flex gap-6 relative z-10">
                <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                  <Settings className="w-5 h-5 text-gray-500 group-hover:text-brand-secondary group-hover:rotate-45 transition-all duration-500" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-4 bg-red-500/5 rounded-2xl hover:bg-red-500/10 transition-all border border-red-500/10 group"
                >
                  <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { label: 'Orders Placed', value: '02', icon: ShoppingBag, color: 'brand-secondary' },
                { label: 'Exquisite List', value: '12', icon: Heart, color: 'brand-secondary' },
                { label: 'Style Reviews', value: '01', icon: Star, color: 'brand-secondary' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-brand-accent/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center space-x-8 group hover:border-brand-secondary/30 transition-all duration-700"
                >
                  <div className="p-5 bg-brand-background rounded-[1.5rem] border border-white/5 group-hover:bg-brand-secondary transition-all duration-500">
                    <stat.icon className="w-6 h-6 text-brand-secondary group-hover:text-black" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-serif font-bold tracking-tighter group-hover:text-brand-secondary transition-colors">{stat.value}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-brand-accent/40 backdrop-blur-2xl p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-bold tracking-tight">Order Archives</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">Tracking your latest acquisitions</p>
                </div>
                <button className="text-[10px] font-bold text-white uppercase tracking-[0.2em] border-b border-brand-secondary/50 pb-1 hover:border-brand-secondary transition-all">Archived History</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 border-b border-white/5">
                      <th className="pb-6">Signature ID</th>
                      <th className="pb-6">Aquisition Date</th>
                      <th className="pb-6">Valuation</th>
                      <th className="pb-6">Status</th>
                      <th className="pb-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 last:border-0 group">
                        <td className="py-8 font-bold font-serif tracking-widest text-brand-secondary">{order.id}</td>
                        <td className="py-8 text-gray-400 font-light">{order.date}</td>
                        <td className="py-8 font-bold tracking-widest">{formatPrice(order.total)}</td>
                        <td className="py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-8 text-right">
                          <button className="text-[10px] font-bold text-white uppercase tracking-[0.2em] border border-white/10 px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl group-hover:border-brand-secondary">
                            INSPECT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 shrink-0 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-brand-accent/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-10"
            >
              <h3 className="text-2xl font-serif font-bold tracking-tight mb-8">Registered Abode</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 rounded-2xl mr-5 border border-white/5">
                    <MapPin className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Shipping Destination</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-light">
                      House #12, Road #4, Sector 7, Uttara, Dhaka - 1230, Bangladesh
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-3 bg-white/5 rounded-2xl mr-5 border border-white/5">
                    <Package className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Standard Logistics</p>
                    <p className="text-sm text-gray-300 font-light">White Glove Delivery (Global)</p>
                  </div>
                </div>
                <button className="w-full mt-6 text-[10px] font-bold text-black bg-white py-4 rounded-xl hover:bg-brand-secondary transition-all uppercase tracking-[0.3em] shadow-2xl">
                  REVISE DESTINATION
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-accent/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative group"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-serif font-bold tracking-tighter text-white">Zyra Elite</h3>
                  <div className="p-2 bg-brand-secondary text-black rounded-lg"><Star className="w-4 h-4 fill-current" /></div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-light uppercase tracking-widest leading-loose">
                  Ascend to Elite for complimentary global passage, curated gifting, and premier access to the haute couture collection.
                </p>
                <button className="group relative w-full bg-white/5 border border-white/10 text-white py-5 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-700 rounded-2xl overflow-hidden">
                  <span className="relative z-10 group-hover:text-black transition-colors">ASCEND NOW</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-all duration-700" />
                </button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
