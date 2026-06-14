import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Award, RefreshCw, DollarSign, ExternalLink, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '../lib/utils';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CATEGORIES = [
  { name: 'Heels', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80', href: '/shop?category=Heels' },
  { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80', href: '/shop?category=Sneakers' },
  { name: 'Flats', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80', href: '/shop?category=Flats' },
  { name: 'Sandals', image: 'https://images.unsplash.com/photo-1603487742131-416079991794?auto=format&fit=crop&q=80', href: '/shop?category=Sandals' },
  { name: 'Boots', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80', href: '/shop?category=Boots' },
];

const FEATURES = [
  { icon: Award, title: 'Heritage Quality', desc: 'Crafted with top-grain leather and ancestral techniques.' },
  { icon: DollarSign, title: 'Transparent Value', desc: 'Direct-to-consumer luxury without unnecessary markups.' },
  { icon: Truck, title: 'Priority Logistics', desc: 'Safe, expedited delivery across every division of Bangladesh.' },
  { icon: RefreshCw, title: 'Honored Returns', desc: 'Seamless, graceful return process within 7 days.' },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = React.useState<any[]>([]);
  const [topSales, setTopSales] = React.useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [latestBlogs, setLatestBlogs] = React.useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(20));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          image: doc.data().images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'
        })) as any[];
        
        setNewArrivals(data.slice(0, 10));
        setTopSales([...data].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 10));
        setFeaturedProducts(data.filter(p => p.isFeatured).slice(0, 6));
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setProductsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const DEFAULT_POSTS: any[] = [
    {
      id: "architecture-of-elegance",
      title: "The Architecture of Elegance: A Study in Modern Heels",
      category: "Heels",
      shortDescription: "Discover how we blend structural engineering with avant-garde aesthetics to create the perfect stiletto.",
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80"]
    },
    {
      id: "sustainable-sophistication",
      title: "Sustainable Sophistication: The Future of Luxury",
      category: "Ethics",
      shortDescription: "Exploring the intersection of eco-conscious craftsmanship and the allure of premium Italian leathers.",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80"]
    },
    {
      id: "urban-zenith-sandals",
      title: "Urban Zenith: The Minimalist Manifesto for Sandals",
      category: "Style",
      shortDescription: "Stripping away the noise to reveal the pure essence of luxury comfort for the cosmopolitan summer.",
      images: ["https://images.unsplash.com/photo-1520639889413-5d5558c97386?auto=format&fit=crop&q=80"]
    }
  ];

  React.useEffect(() => {
    async function fetchLatestBlogs() {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(3));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetched.length > 0) {
          setLatestBlogs(fetched);
        } else {
          setLatestBlogs(DEFAULT_POSTS);
        }
      } catch (err) {
        console.error('Error fetching latest blogs:', err);
        setLatestBlogs(DEFAULT_POSTS);
      } finally {
        setBlogsLoading(false);
      }
    }
    fetchLatestBlogs();
  }, []);

  return (
    <div className="overflow-hidden bg-brand-background text-brand-primary">
      <Helmet>
        <title>Zyra Legacy | The Pinnacle of Women's Footwear</title>
        <meta name="description" content="Elevate your presence with Zyra Legacy. Luxury heels, premium sneakers, and elegant flats designed for the sophisticated woman of Bangladesh." />
      </Helmet>

      {/* Responsive Hero Section - Brand Vision */}
      <section className="relative w-full bg-brand-background overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full"
        >
          <img 
            src="http://uploadimages.free.nf/wp-content/uploads/2026/04/Zyra-Brand.png" 
            alt="Zyra Legacy Brand" 
            className="w-full h-auto block mx-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
        </motion.div>
      </section>

      {/* Narrative Section - The Zyra Standard */}
      <section className="relative py-20 md:py-32 bg-brand-background overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="z-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 md:w-12 h-[1px] bg-brand-secondary" />
              <span className="text-brand-secondary font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em]">
                Authenticity • Excellence • Legacy
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8 tracking-tighter">
              Elevate <br />
              <span className="text-brand-secondary italic">Every Stride</span> <br />
              with Zyra.
            </h2>
            <p className="text-gray-500 text-base md:text-xl mb-12 max-w-lg font-light leading-relaxed">
              Chic designs, premium quality, and ultimate comfort for every modern woman. Step into the Zyra standard of luxury footwear.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto px-10 md:px-12 py-5 bg-brand-primary text-brand-background font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-secondary hover:text-brand-primary transition-all duration-500 rounded-sm flex items-center justify-center group"
              >
                Explore Archive
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
              <Link 
                to="/about" 
                className="text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] hover:text-brand-secondary transition-colors flex items-center border-b border-transparent hover:border-brand-secondary pb-1"
              >
                The Manifesto <ExternalLink className="ml-2 w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] relative z-10 overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] shadow-2xl group">
              <img 
                src="http://uploadimages.free.nf/wp-content/uploads/2026/04/zyra.png" 
                alt="Architectural Luxury Heel"
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-primary/5 group-hover:opacity-0 transition-opacity duration-700" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-accent/30 rounded-full blur-[80px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="py-8 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16 space-y-4">
            <div className="space-y-2 md:space-y-4">
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-brand-secondary font-bold">The Latest Vision</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">New Arrivals</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary border-b border-brand-primary/10 pb-2">
              View All Arrivals
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

            {productsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-brand-secondary" />
              </div>
            ) : newArrivals.length === 0 ? (
              <div className="py-20 text-center text-gray-400 italic">No new arrivals in archive yet.</div>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={3}
                navigation
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  640: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="product-swiper pb-12"
              >
                {newArrivals.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
        </div>
      </section>

      {/* Top Sales Slider */}
      <section className="py-8 md:py-32 bg-brand-accent/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16 space-y-4">
            <div className="space-y-2 md:space-y-4">
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-brand-secondary font-bold">Popular Styles</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">Top Sales</h2>
            </div>
          </div>

            {productsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-brand-secondary" />
              </div>
            ) : topSales.length === 0 ? (
              <div className="py-20 text-center text-gray-400 italic">No top sales recorded yet.</div>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={3}
                navigation
                autoplay={{ delay: 5000, reverseDirection: true }}
                breakpoints={{
                  640: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="product-swiper pb-12"
              >
                {topSales.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-8 md:mb-20 space-y-4 px-4">
            <p className="text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">Curated Domains</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">Shop by Category</h2>
            <p className="text-gray-400 font-light tracking-wide text-sm md:text-base">Select your lifestyle archetype and explore our tailored collections.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 xl:gap-12 max-w-6xl mx-auto">
            {CATEGORIES.map((cat, i) => (
              <div 
                key={cat.name}
                className="flex flex-col items-center"
              >
                <Link 
                  to={cat.href}
                  className="group block relative w-full aspect-square overflow-hidden rounded-full shadow-lg hover:shadow-2xl transition-all duration-700 max-w-[120px] sm:max-w-[140px] md:max-w-none"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-0 bg-brand-primary/30 group-hover:bg-brand-primary/10 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-serif font-bold tracking-widest px-2 text-center">{cat.name}</span>
                  </div>
                </Link>
                <span className="lg:hidden mt-3 text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-8 md:py-32 bg-brand-accent/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-20 space-y-2 md:space-y-4">
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">Signature Pieces</p>
            <h2 className="text-3xl md:text-6xl font-serif font-bold tracking-tighter">Featured Collection</h2>
          </div>
          {productsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-secondary" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 italic">No featured collection currently.</div>
          ) : (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={3}
              autoplay={{ delay: 6000 }}
              breakpoints={{
                1024: { slidesPerView: 3, spaceBetween: 48, enabled: false }
              }}
              className="featured-swiper pb-12 lg:pb-0 !px-4 lg:!p-0"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="mt-20 text-center">
            <Link to="/shop" className="inline-flex items-center gap-4 px-12 py-5 border border-brand-primary text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all duration-500">
              View Complete Archive
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-32 bg-brand-primary text-brand-background overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-secondary/5 -skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="hidden md:grid grid-cols-4 gap-16">
            {FEATURES.map((feature, i) => (
              <div 
                key={i}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold tracking-tight leading-tight">{feature.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed tracking-wide">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swiper for Features */}
          <div className="md:hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={true}
              autoplay={{ delay: 4000 }}
              className="features-swiper pb-10"
            >
              {FEATURES.map((feature, i) => (
                <SwiperSlide key={i}>
                  <div className="flex flex-col items-center text-center space-y-4 px-4 bg-white/5 p-8 rounded-3xl border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-brand-secondary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold tracking-tight leading-tight text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-xs font-light leading-relaxed tracking-wide">{feature.desc}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-24 space-y-2 md:space-y-4">
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">The Registry</p>
            <h2 className="text-3xl md:text-6xl font-serif font-bold tracking-tighter">Voice of Elegance</h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 48, enabled: false }
            }}
            className="review-swiper pb-12 lg:pb-0 !px-4 md:!p-0"
          >
            {[1, 2, 3].map((i) => (
              <SwiperSlide key={i}>
                <div className="bg-brand-accent/20 p-6 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-white/5 relative group text-center md:text-left h-full">
                  <div className="absolute top-4 right-6 md:top-8 md:right-8 text-4xl md:text-6xl font-serif text-brand-secondary/20">“</div>
                  <div className="flex justify-center md:justify-start text-brand-secondary mb-4 md:mb-8 gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
                  </div>
                  <p className="text-brand-primary mb-6 md:mb-10 italic font-light leading-relaxed tracking-wide text-sm md:text-lg">
                    "The craftsmanship in these stilettos is unprecedented for the local market. They have successfully balanced the height with architectural stability. Truly impressed."
                  </p>
                  <div className="flex flex-col md:flex-row items-center md:items-center gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-primary text-brand-background rounded-full flex items-center justify-center font-serif text-base md:text-xl">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] md:text-sm tracking-widest uppercase">Shaila Amin</h4>
                      <p className="text-[7px] md:text-[9px] text-brand-secondary font-bold tracking-[0.2em] uppercase">Private Selection • Dhaka</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Latest Chronicles Section */}
      <section className="py-12 md:py-32 bg-brand-background underline-offset-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6">
            <div className="space-y-4 max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">The Editorial</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">Latest Chronicles</h2>
              <p className="text-gray-500 font-light tracking-wide italic">Explore our curated perspectives on footwear architecture and modern lifestyle.</p>
            </div>
            <Link to="/blog" className="px-10 py-4 bg-brand-primary text-brand-background font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all rounded-sm flex items-center gap-3">
              View Lexicon <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : latestBlogs.length === 0 ? (
            <div className="px-10 py-16 border border-brand-primary/5 rounded-[2rem] text-center space-y-6">
               <p className="text-gray-400 font-light italic">"The lexicon of Zyra is currently being composed."</p>
               <Link to="/seed-data" className="inline-flex items-center gap-4 text-brand-secondary text-[10px] uppercase font-bold tracking-widest hover:text-brand-primary transition-colors">
                  <ArrowRight className="w-4 h-4" /> Inject Initial Chronicles
               </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {latestBlogs.map((blog, i) => (
                <article 
                  key={blog.id}
                  className="group"
                >
                  <Link to={`/blog/${blog.id}`} className="block space-y-6">
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 relative">
                      <img 
                        src={blog.images?.[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80'} 
                        alt={blog.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                      />
                      <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-4">
                      <span className="text-[9px] uppercase font-bold tracking-[0.4em] text-brand-secondary">{blog.category}</span>
                      <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-brand-secondary transition-colors underline-offset-8 group-hover:underline decoration-1">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 italic">
                        "{blog.shortDescription}"
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-32 bg-brand-accent/50 border-y border-brand-primary/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8 md:space-y-12">
          <div className="space-y-2 md:space-y-4">
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">The Inner Circle</p>
            <h2 className="text-3xl md:text-7xl font-serif font-bold tracking-tighter">Bespoke Updates</h2>
            <p className="text-gray-500 text-sm md:text-lg font-light tracking-wide max-w-xl mx-auto">
              Join our private directory to receive earliest priority on limited collections and signature drops.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 md:gap-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your Email Identity"
              className="flex-grow px-8 md:px-10 py-4 md:py-6 bg-white border border-brand-primary/10 text-brand-primary focus:ring-0 focus:border-brand-secondary transition-all outline-none rounded-full text-[10px] md:text-sm font-light tracking-widest placeholder:text-gray-300"
            />
            <button className="px-10 md:px-14 py-4 md:py-6 bg-brand-primary text-brand-background font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em] hover:bg-brand-secondary hover:text-brand-primary transition-all duration-500 rounded-full shadow-2xl active:scale-95">
              REGISTER
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
