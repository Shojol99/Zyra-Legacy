import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Eye,
  CreditCard,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { formatPrice, cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';

const SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [productCount, orderSnap, usersCount] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10))),
          getCountFromServer(collection(db, 'users'))
        ]);

        const totalOrders = orderSnap.docs.length;
        const totalRevenue = orderSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);
        
        setStats([
          { name: 'Total Revenue', value: totalRevenue, change: '+0%', trend: 'neutral', icon: TrendingUp, color: 'bg-emerald-500' },
          { name: 'Total Orders', value: totalOrders, change: '+0%', trend: 'neutral', icon: ShoppingCart, color: 'bg-indigo-500' },
          { name: 'Total Products', value: productCount.data().count, change: '0%', trend: 'neutral', icon: Package, color: 'bg-amber-500' },
          { name: 'Total Customers', value: usersCount.data().count, change: '0%', trend: 'neutral', icon: Users, color: 'bg-rose-500' },
        ]);

        setRecentOrders(orderSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? new Date(doc.data().createdAt.toDate()).toLocaleTimeString() : 'Just now'
        })));

      } catch (error) {
        console.error('Error fetching admin overview:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-indigo-600">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.4em]">Aggregating Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back to the Zyra Legecy control center.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            Manage Products
          </Link>
          <Link to="/admin/products" className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Create Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl text-white", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : stat.trend === 'down' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
              </div>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              {stat.name.includes('Revenue') ? formatPrice(stat.value) : stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Revenue Trends</h2>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
          </div>
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic">No orders recorded.</div>
            ) : (
              recentOrders.map((order, i) => (
                <div key={order.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors p-2 rounded-xl">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{order.shippingDetails?.fullName || 'Anonymous'}</p>
                      <p className="text-sm font-bold text-slate-900 ml-4">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {order.date}
                      </p>
                      <span className={cn(
                        "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                        order.status === 'Processing' ? "bg-amber-50 text-amber-600" :
                        order.status === 'Shipped' ? "bg-indigo-50 text-indigo-600" :
                        order.status === 'Delivered' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                      )}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
