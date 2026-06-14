import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  TrendingUp,
  Tag,
  MessageSquare,
  FileText,
  ShieldCheck,
  Bell,
  Search,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const SIDEBAR_ITEMS = [
  { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { name: 'Products', icon: Package, path: '/admin/products' },
  { name: 'Categories', icon: Layers, path: '/admin/categories' },
  { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { name: 'Customers', icon: Users, path: '/admin/customers' },
  { name: 'Blog', icon: FileText, path: '/admin/blog' },
  { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  { name: 'Coupons', icon: Tag, path: '/admin/coupons' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-indigo-900 text-white transition-all duration-300 fixed lg:static inset-y-0 left-0 z-50 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/admin" className={cn("font-serif font-bold text-xl tracking-tighter truncate transition-all", !isSidebarOpen && "scale-0 w-0")}>
            ZYRA <span className="text-amber-400">ADMIN</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl transition-all group relative",
                  isActive ? "bg-amber-400 text-indigo-900 shadow-lg shadow-amber-400/20" : "hover:bg-white/5 text-slate-300 hover:text-white"
                )}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={cn("font-medium transition-opacity whitespace-nowrap", !isSidebarOpen && "opacity-0 w-0")}>
                  {item.name}
                </span>
                {!isSidebarOpen && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn("font-medium transition-opacity whitespace-nowrap", !isSidebarOpen && "opacity-0 w-0")}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="flex items-center gap-8 flex-grow max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search orders, products, customers..." 
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl py-3 pl-12 pr-4 text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{profile?.displayName || 'Admin User'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{profile?.role || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                {profile?.displayName?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
