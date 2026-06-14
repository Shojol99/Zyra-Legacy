import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Truck, ShieldCheck, RefreshCw, Plus, Minus, Heart, Share2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { formatPrice, cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../lib/CartContext';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('37');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    async function fetchProductData() {
      if (!id) return;
      setLoading(true);
      try {
        const productSnap = await getDoc(doc(db, 'products', id));
        if (productSnap.exists()) {
          const productData = { 
            id: productSnap.id, 
            ...productSnap.data(),
            image: productSnap.data().images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'
          } as any;
          setProduct(productData);
          setCurrentImage(productData.image);
          if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);

          // Fetch related products
          const q = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            limit(5)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(d => ({ 
              id: d.id, 
              ...d.data(),
              image: d.data().images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'
            }))
            .filter(p => p.id !== id);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      color: product.colors?.[0] || 'Standard',
      size: selectedSize,
      image: product.image
    });
    navigate('/cart');
  };

  const SIZES = product?.sizes || ['36', '37', '38', '39', '40', '41'];

  const GALLERY = useMemo(() => {
    if (!product) return [];
    return product.images && product.images.length > 0 ? product.images : [product.image];
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-brand-secondary" />
        <p className="text-[10px] uppercase font-bold tracking-[0.6em] text-brand-primary/60">Opening Archive...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-4xl font-serif font-bold text-brand-primary">Masterpiece Not Found</h1>
        <p className="text-gray-500 max-w-md italic">The requested piece does not exist in our current collection or has been moved to the private archive.</p>
        <Link to="/shop" className="px-12 py-5 bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:text-brand-primary transition-all">
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-background text-brand-primary min-h-screen font-sans">
      <Helmet>
        <title>{product.title} | Zyra Legecy</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 lg:py-32">
        {/* Breadcrumbs */}
        <nav className="flex mb-12 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">
          <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
          <span className="mx-4">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-brand-secondary transition-colors">{product.category}</Link>
          <span className="mx-4">/</span>
          <span className="text-brand-secondary">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          {/* Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              key={currentImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/5] md:aspect-[4/5] max-h-[50vh] md:max-h-none rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-brand-accent/30 shadow-2xl mx-auto md:mx-0 w-full"
            >
              <img 
                src={currentImage} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Selection */}
            <div className="grid grid-cols-4 gap-3 md:gap-6 px-4 md:px-0">
              {GALLERY.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(img)}
                  className={cn(
                    "aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-brand-accent/30 border-2 transition-all",
                    currentImage === img ? "border-brand-secondary scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-5 py-1.5 bg-brand-secondary/10 text-brand-secondary text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-5 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tighter leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-serif font-bold text-brand-secondary tracking-tight">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center gap-2 border-l border-brand-primary/10 pl-6">
                  <div className="flex text-brand-secondary">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">48 Reviews</span>
                </div>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed tracking-wide">
                {product.shortDescription}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Select Size (EU)</label>
                <button className="text-[9px] font-bold uppercase tracking-widest text-brand-secondary border-b border-brand-secondary/30 pb-0.5">Size Guide</button>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-14 flex items-center justify-center text-[10px] font-bold tracking-widest transition-all duration-300 rounded-xl",
                      selectedSize === size 
                        ? "bg-brand-primary text-white shadow-xl" 
                        : "bg-brand-accent/50 text-gray-500 hover:bg-brand-accent border border-transparent hover:border-brand-secondary/30"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Area */}
            <div className="pt-6 space-y-6">
              <div className="flex gap-4">
                <div className="flex items-center bg-brand-accent/50 rounded-2xl p-2 border border-brand-primary/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm tracking-widest">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-brand-primary text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-secondary hover:text-brand-primary transition-all duration-500 flex items-center justify-center gap-4"
                >
                  Add to Cart
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="p-5 bg-brand-accent/50 rounded-2xl border border-brand-primary/5 hover:bg-white hover:text-red-500 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 font-medium tracking-[0.2em] flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-brand-secondary" /> 
                Authenticity Guaranteed by Zyra Legecy
              </p>
            </div>

            {/* Product Tabs */}
            <div className="pt-12 border-t border-brand-primary/5">
              <div className="flex gap-12 mb-10 overflow-x-auto pb-4 no-scrollbar">
                {['description', 'specifications', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap",
                      activeTab === tab ? "text-brand-secondary border-b-2 border-brand-secondary pb-4" : "text-gray-400"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-gray-500 text-sm font-light leading-relaxed tracking-wide min-h-[100px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'description' && (
                      <div className="prose prose-sm prose-brand max-w-none prose-p:font-light prose-p:leading-relaxed prose-p:tracking-wide prose-p:text-gray-500" dangerouslySetInnerHTML={{ __html: product.fullDescription || product.shortDescription }} />
                    )}
                    {activeTab === 'specifications' && (
                      <ul className="space-y-4">
                        <li className="flex justify-between border-b border-brand-primary/5 pb-2">
                          <span className="font-bold text-[10px] uppercase tracking-widest">Material</span>
                          <span>Italian Nappa Leather</span>
                        </li>
                        <li className="flex justify-between border-b border-brand-primary/5 pb-2">
                          <span className="font-bold text-[10px] uppercase tracking-widest">Sole</span>
                          <span>Cushioned Rubber Grid</span>
                        </li>
                        <li className="flex justify-between border-b border-brand-primary/5 pb-2">
                          <span className="font-bold text-[10px] uppercase tracking-widest">Country of Origin</span>
                          <span>Artisan Crafted in BD</span>
                        </li>
                      </ul>
                    )}
                    {activeTab === 'shipping' && "Complimentary priority shipping on all acquisitions within Dhaka Division. Regional logistics handled via premium couriers with full insurance."}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-20 md:mt-40">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-secondary font-bold">Curated for You</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Related Pieces</h2>
          </div>
          
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={3}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              1024: { slidesPerView: 4, spaceBetween: 48, enabled: false }
            }}
            className="related-swiper pb-12 lg:pb-0 !px-0"
          >
            {relatedProducts.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-24 left-0 right-0 z-40 px-4 md:hidden pointer-events-none">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-start pointer-events-auto"
        >
          <button 
            onClick={handleAddToCart}
            className="w-[60vw] bg-brand-primary text-white py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-transform border border-white/20 backdrop-blur-md bg-opacity-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}

