import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { type Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div 
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-[2.5rem] bg-brand-accent/20 mb-3 md:mb-8 shadow-sm md:shadow-xl group-hover:shadow-2xl group-hover:shadow-brand-secondary/5 transition-all duration-700">
          <img 
            src={product.image} 
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 md:top-8 md:left-8 px-2 md:px-4 py-0.5 md:py-1.5 bg-brand-secondary text-brand-background text-[7px] md:text-[9px] font-bold uppercase tracking-widest md:tracking-[0.3em] rounded-full">
              {product.badge}
            </span>
          )}
          <div className="absolute inset-x-2 md:inset-x-4 bottom-2 md:bottom-4 p-2 md:p-4 bg-white/20 backdrop-blur-xl rounded-lg md:rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex items-center justify-between">
            <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-white">View</span>
            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-brand-primary">
              <ArrowRight className="w-2.5 h-2.5 md:w-4 md:h-4" />
            </div>
          </div>
        </div>
      </Link>
      <div className="space-y-1 md:space-y-4 px-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-1">
          <div className="min-w-0 flex-grow">
            <p className="text-[7px] md:text-[9px] uppercase tracking-widest text-brand-secondary font-bold mb-0.5">{product.category}</p>
            <h3 className="text-[10px] md:text-lg font-serif font-bold tracking-tight hover:text-brand-secondary transition-colors cursor-pointer truncate md:whitespace-normal">{product.title}</h3>
          </div>
          <p className="text-[11px] md:text-lg font-serif font-bold text-brand-primary tracking-tight">{formatPrice(product.price)}</p>
        </div>
      </div>
    </div>
  );
}
