export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  subcategory: string;
  colors: string[];
  sizes: string[];
  status: 'active' | 'draft' | 'out_of_stock';
  isNewArrival: boolean;
  isTopSale: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    altText: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
  createdAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  published: boolean;
  createdAt: string;
}
