import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Instagram, Facebook, Phone, Mail, MapPin, Home, LayoutGrid, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const NAV_LINKS = [
  { name: 'Heels', href: '/shop?category=Heels' },
  { name: 'Sneakers', href: '/shop?category=Sneakers' },
  { name: 'Flats', href: '/shop?category=Flats' },
  { name: 'Sandals', href: '/shop?category=Sandals' },
  { name: 'Boots', href: '/shop?category=Boots' },
  { name: 'Blog', href: '/blog' },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-secondary selection:text-white bg-brand-background">
      <ScrollToTop />
      {/* Sticky Header */}
      <header 
        className={cn(
          "fixed top-0 z-50 transition-all duration-500 w-full",
          "bg-white/95 backdrop-blur-xl border-b border-brand-primary/5 shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-24">
          {/* Mobile Search - Left */}
          <Link to="/shop" className="lg:hidden p-2 text-brand-primary/70 hover:text-brand-secondary">
            <Search className="w-5 h-5" />
          </Link>

          {/* Logo - Center */}
          <Link to="/" className="mx-auto lg:mx-0 h-full flex items-center">
            <img 
              src="https://i.ibb.co.com/DDTmMpnK/Whats-App-Image-2026-04-27-at-7-54-40-PM-removebg-preview.png" 
              alt="Zyra Legacy"
              className="h-20 md:h-32 w-auto object-contain transition-transform hover:scale-105 duration-500" 
            />
          </Link>

          {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-12">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-[13px] font-bold tracking-[0.4em] uppercase transition-all hover:text-brand-secondary text-brand-primary/70"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 md:space-x-8">
            {isAdmin && (
              <Link to="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all">
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </Link>
            )}
            <button className="hidden lg:block p-2 transition-colors text-brand-primary/70 hover:text-brand-secondary">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 relative transition-colors text-brand-primary/70 hover:text-brand-secondary">
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 md:w-4 md:h-4 bg-brand-secondary text-white text-[7px] md:text-[9px] font-bold flex items-center justify-center rounded-full shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-primary/40 backdrop-blur-md z-[60] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-brand-background z-[70] lg:hidden p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <img 
                  src="https://i.ibb.co.com/DDTmMpnK/Whats-App-Image-2026-04-27-at-7-54-40-PM-removebg-preview.png" 
                  alt="Zyra Legacy"
                  className="h-24 w-auto object-contain"
                />
                <button onClick={() => setIsMenuOpen(false)} className="bg-brand-accent p-2 rounded-full">
                  <X className="w-5 h-5 text-brand-primary" />
                </button>
              </div>
              <div className="flex flex-col space-y-5 flex-grow">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 text-brand-secondary font-bold text-sm uppercase tracking-widest mb-4">
                    <ShieldCheck className="w-5 h-5" /> Admin Portal
                  </Link>
                )}
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href}
                    className="text-xl font-serif font-bold tracking-tight hover:text-brand-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="w-10 h-[1px] bg-brand-primary/10 my-4" />
                <Link to="/about" className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">About Us</Link>
                <Link to="/contact" className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Contact</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-24">
        <Outlet />
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-brand-primary/5 lg:hidden flex items-center justify-around py-3 px-2 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
          <div className="p-2 rounded-xl transition-all">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest">Menu</span>
        </button>
        <Link to="/" className={cn("flex flex-col items-center gap-1", location.pathname === '/' ? "text-brand-primary" : "text-slate-400")}>
          <div className={cn("p-2 rounded-xl transition-all", location.pathname === '/' && "bg-brand-accent/50")}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link to="/shop" className={cn("flex flex-col items-center gap-1", location.pathname === '/shop' ? "text-brand-primary" : "text-slate-400")}>
          <div className={cn("p-2 rounded-xl transition-all", location.pathname === '/shop' && "bg-brand-accent/50")}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest">Shop</span>
        </Link>
        <Link to="/cart" className={cn("flex flex-col items-center gap-1", location.pathname === '/cart' ? "text-brand-primary" : "text-slate-400")}>
          <div className={cn("p-2 rounded-xl transition-all relative", location.pathname === '/cart' && "bg-brand-accent/50")}>
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-brand-secondary text-white text-[7px] font-bold flex items-center justify-center rounded-full shadow-lg">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest">Bag</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="bg-white text-brand-primary pt-8 md:pt-32 pb-16 md:pb-16 relative border-t border-brand-primary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20 mb-8 md:mb-24 text-center">
          <div className="space-y-4 md:space-y-10">
            <Link to="/" className="inline-block">
              <img 
                src="https://i.ibb.co.com/DDTmMpnK/Whats-App-Image-2026-04-27-at-7-54-40-PM-removebg-preview.png" 
                alt="Zyra Legacy"
                className="h-32 md:h-56 w-auto object-contain mx-auto"
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed font-light tracking-wide italic max-w-sm mx-auto">
              Crafting timeless luxury for the modern woman. Every pair tells a story of elegance and confidence.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-brand-accent/30 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-500">
                <Instagram className="w-4 h-4 md:w-5 md:h-5 font-light" />
              </a>
              <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-brand-accent/30 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-500">
                <Facebook className="w-4 h-4 md:w-5 md:h-5 font-light" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 md:mb-10 text-brand-secondary">The Archive</h4>
            <ul className="space-y-4 md:space-y-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-brand-secondary border-b border-transparent hover:border-brand-secondary/30 pb-1 transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 md:mb-10 text-brand-secondary">Concierge</h4>
            <ul className="space-y-4 md:space-y-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <li><Link to="/shipping" className="hover:text-brand-secondary transition-all">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-brand-secondary transition-all">Returns & Refund</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-secondary transition-all">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-secondary transition-all">Terms & Conditions</Link></li>
              <li><Link to="/track" className="hover:text-brand-secondary transition-all tracking-[0.1em]">Bespoke Order Tracking</Link></li>
            </ul>
          </div>

          <div className="space-y-8 md:space-y-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 md:mb-10 text-brand-secondary">The Atelier</h4>
            <ul className="space-y-4 md:space-y-6 text-xs text-gray-500 font-light tracking-wide">
              <li className="flex flex-col items-center text-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-brand-secondary" />
                <span>Dhaka, Bangladesh <br /> <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Flagship Boutique</span></span>
              </li>
              <li className="flex flex-col items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-brand-secondary" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex flex-col items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-brand-secondary" />
                <span className="border-b border-brand-primary/10">hello@zyralegecy.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-16 border-t border-brand-primary/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-gray-400 text-center">
              © {new Date().getFullYear()} Zyra Legacy. Crafted in Bangladesh.
            </p>
            <div className="flex gap-8 md:gap-10 items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/BKash_Logo.svg" alt="bKash" className="h-4 md:h-6 grayscale opacity-30" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Nagad_Logo.svg" alt="Nagad" className="h-4 md:h-6 grayscale opacity-30" />
            </div>
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-secondary hidden md:block">
              Synchronized Luxury
            </p>
          </div>
        </div>
      </footer>


      {/* WhatsApp Button */}
      <motion.a 
        drag
        dragConstraints={{ left: -300, right: 0, top: -700, bottom: 0 }}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, zIndex: 50 }}
        href="https://wa.me/8801234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg transition-transform flex items-center justify-center border border-white/20 cursor-grab active:cursor-grabbing"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.218 3.074.151.198 2.097 3.202 5.084 4.495.71.309 1.265.494 1.696.633.713.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </div>
  );
}
