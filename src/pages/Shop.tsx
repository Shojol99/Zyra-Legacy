import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, Grid, List as ListIcon, X, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ProductCard } from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

const CATEGORIES = ['Heels', 'Sneakers', 'Flats', 'Sandals', 'Boots'];
const SIZES = ['36', '37', '38', '39', '40', '41'];
const COLORS = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Nude', hex: '#E3C5AF' },
  { name: 'Crimson', hex: '#8B0000' },
  { name: 'Champagne Gold', hex: '#C5A358' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Ensure structure matches what ProductCard expects
          image: doc.data().images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'
        }));
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  
  const filteredProducts = useMemo(() => {
    let result = [...products];
    setCurrentPage(1); // Reset to page 1 when filters change
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Top Sales') {
      result.sort((a, b) => b.sales - a.sales);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-brand-background min-h-screen text-brand-primary font-sans md:pt-12">
      <Helmet>
        <title>Shop Collection | Zyra Legacy</title>
        <meta name="description" content="Explore our exquisite collection of luxury footwear." />
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.6em] text-brand-secondary font-bold"
          >
            The Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tighter"
          >
            Sophisticated <br /> <span className="italic">Footwear</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-[1px] bg-brand-primary/10 mt-12"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-6 pb-32">
        <div className="flex flex-row gap-4 md:gap-16">
          {/* Sidebar - Desktop & Mobile Side-by-Side */}
          <aside className="w-16 sm:w-20 lg:w-72 shrink-0 space-y-12 md:space-y-16 py-4 border-r md:border-r-0 border-brand-primary/5">
            {/* Mobile Icons / Desktop Full Side Bar */}
            <div className="flex flex-col items-center lg:items-start space-y-12">
              {/* Search */}
              <div className="relative group w-full lg:block hidden">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-secondary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-brand-primary/10 pb-4 pl-8 text-[11px] font-bold uppercase tracking-widest focus:border-brand-secondary outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden p-3 bg-brand-primary text-white rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Categories - Vertical Bar on Mobile */}
              <div className="space-y-10 w-full text-center lg:text-left">
                <h3 className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Categories</h3>
                <div className="flex flex-col gap-8 lg:gap-5 items-center lg:items-start">
                  {['All', ...CATEGORIES].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={cn(
                        "block text-[9px] lg:text-[11px] font-bold uppercase tracking-widest transition-all lg:hover:translate-x-2 text-center lg:text-left shrink-0",
                        selectedCategory === cat ? "text-brand-secondary" : "text-brand-primary/60 lg:hover:text-brand-primary"
                      )}
                    >
                      <span className="hidden lg:inline">{cat}</span>
                      <span className="lg:hidden vertical-text tracking-[0.2em]">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Only Filters */}
              <div className="hidden lg:block space-y-16 w-full">
                {/* Price Range */}
                <div className="space-y-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Invest Range</h3>
                  <div className="space-y-6">
                    <input type="range" className="w-full accent-brand-secondary h-1 bg-brand-accent rounded-full appearance-none cursor-pointer" min="0" max="10000" />
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      <span>0 BDT</span>
                      <span>10,000 BDT</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Select Size</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {SIZES.map(size => (
                      <button 
                        key={size}
                        className="h-12 border border-brand-primary/5 text-[10px] font-bold tracking-widest hover:border-brand-secondary hover:text-brand-secondary transition-all bg-brand-accent/30 rounded-xl"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12 md:mb-16 pb-8 border-b border-brand-primary/5">
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">
                Displaying {filteredProducts.length} <span className="text-brand-secondary">Pieces</span>
              </p>

              <div className="flex items-center gap-8 md:gap-12 w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                {['Newest', 'Top Sales', 'Price: H to L'].map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option === 'Price: H to L' ? 'Price: High to Low' : option)}
                    className={cn(
                      "whitespace-nowrap text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all",
                      (sortBy === option || (option === 'Price: H to L' && sortBy === 'Price: High to Low')) ? "text-brand-secondary border-b border-brand-secondary pb-1" : "text-gray-400 hover:text-brand-primary"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4 text-brand-secondary">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="text-[10px] uppercase font-bold tracking-[0.4em]">Retrieving Archive...</p>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-12 md:gap-y-20"
                >
                  {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
                    <motion.div 
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="py-40 text-center space-y-6">
                <p className="text-2xl md:text-4xl font-serif italic text-gray-300">No pieces found</p>
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary border-b border-brand-secondary/30 pb-1"
                  >
                    Clear All Filters
                  </button>
                  {products.length === 0 && (
                    <Link 
                      to="/admin/products"
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-accent px-6 py-3 rounded-full mt-4"
                    >
                      Add Products in Dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-20 md:mt-40 flex justify-center items-center gap-6 md:gap-12">
                <div className="h-[1px] w-12 md:w-20 bg-brand-primary/5 hidden sm:block" />
                <div className="flex gap-3 md:gap-4">
                  {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-[9px] md:text-[10px] transition-all tracking-widest rounded-xl",
                        currentPage === i + 1 ? "bg-brand-primary text-white shadow-xl" : "border border-brand-primary/5 hover:border-brand-secondary text-gray-500"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="h-[1px] w-12 md:w-20 bg-brand-primary/5 hidden sm:block" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-primary/40 backdrop-blur-md z-[100]"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 top-0 w-4/5 sm:w-[400px] bg-white z-[110] overflow-y-auto p-12 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-4xl font-serif font-bold tracking-tighter leading-none">Side <br /> <span className="text-brand-secondary italic text-2xl">Menu</span></h3>
                <button onClick={() => setShowMobileFilters(false)} className="bg-brand-accent p-3 rounded-full">
                  <X className="w-5 h-5 text-brand-primary" />
                </button>
              </div>
              
              <div className="space-y-16 pb-12">
                {/* Search in Side Menu */}
                <div className="space-y-6 text-center">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Discover</h4>
                  <div className="relative mx-auto max-w-[200px]">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary" />
                    <input 
                      type="text" 
                      placeholder="Keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-b border-brand-primary/10 pb-4 pl-8 text-[11px] font-bold uppercase tracking-widest focus:border-brand-secondary outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-8 text-center">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Categories</h4>
                  <div className="flex flex-col gap-6 items-center">
                    {['All', ...CATEGORIES].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { handleCategoryChange(cat); setShowMobileFilters(false); }}
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-widest transition-all",
                          selectedCategory === cat ? "text-brand-secondary" : "text-brand-primary/60"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-10 text-center">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Size Matrix</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {SIZES.map(size => (
                      <button 
                        key={size}
                        className="h-12 border border-brand-primary/5 text-[10px] font-bold tracking-widest hover:border-brand-secondary hover:text-brand-secondary transition-all bg-brand-accent/30 rounded-xl"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setShowMobileFilters(false); }}
                    className="w-full py-5 border border-brand-primary/10 text-[10px] font-bold tracking-[0.3em] rounded-2xl text-gray-500 active:scale-95"
                  >
                    RESET ALL
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

