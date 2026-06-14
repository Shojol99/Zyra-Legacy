export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  shortDescription: string;
  description: string;
  badge?: string;
  sales: number;
  createdAt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Stiletto High Heels',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80',
    category: 'Heels',
    shortDescription: 'Elegant stiletto heels for the modern queen.',
    description: 'Elevate your presence with our signature stiletto heels. Meticulously crafted with premium leather and featuring a balanced 4-inch heel for confidence and relative comfort.',
    badge: 'New',
    sales: 120,
    createdAt: '2025-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Urban Comfort Sneakers',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80',
    category: 'Sneakers',
    shortDescription: 'Street-ready style meets everyday comfort.',
    description: 'Our Urban Comfort Sneakers are designed for the high-paced Dhaka lifestyle. Featuring a breathable upper and cushioned sole technology.',
    badge: 'Best Seller',
    sales: 450,
    createdAt: '2025-09-15T12:30:00Z'
  },
  {
    id: '3',
    title: 'Classic Leather Flats',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80',
    category: 'Flats',
    shortDescription: 'Timeless flats for daily sophistication.',
    description: 'The Classic Leather Flats offer a minimalist approach to luxury. Perfect for office wear or a sophisticated casual outing.',
    sales: 85,
    createdAt: '2025-08-20T09:15:00Z'
  },
  {
    id: '4',
    title: 'Summer Strap Sandals',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1603487742131-416079991794?auto=format&fit=crop&q=80',
    category: 'Sandals',
    shortDescription: 'Lightweight sandals for sunny adventures.',
    description: 'Breathable and sturdy, our Summer Strap Sandals are your perfect companion for weekend getaways and casual sunny days.',
    sales: 310,
    createdAt: '2025-07-10T15:45:00Z'
  },
  {
    id: '5',
    title: 'Elegant Suede Boots',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80',
    category: 'Boots',
    shortDescription: 'Premium suede boots for a bold statement.',
    description: 'Make a statement with these luxury suede boots. Expertly finished with a side zipper and a comfortable block heel.',
    badge: 'Popular',
    sales: 65,
    createdAt: '2025-06-05T11:20:00Z'
  },
  {
    id: '6',
    title: 'Pointy Toe Pumps',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1596702952706-9bc6823fd37a?auto=format&fit=crop&q=80',
    category: 'Heels',
    shortDescription: 'Chic pointy toe pumps for professional elegance.',
    description: 'The ultimate professional shoe. These pointy toe pumps provide a sharp silhouette that commands respect in any boardroom.',
    sales: 190,
    createdAt: '2025-10-15T08:00:00Z'
  },
  {
    id: '7',
    title: 'Platform Sneakers',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80',
    category: 'Sneakers',
    shortDescription: 'Elevated platform sneakers for a modern edge.',
    description: 'Add a few inches to your height without sacrificing the comfort of a sneaker. Bold design meets functional architecture.',
    badge: 'Trending',
    sales: 240,
    createdAt: '2025-10-20T14:10:00Z'
  },
  {
    id: '8',
    title: 'Block Heel Sandals',
    price: 1950,
    image: 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&q=80',
    category: 'Sandals',
    shortDescription: 'Comfortable block heels for all-day wear.',
    description: 'Stability meets style. These block heel sandals are designed for those long event days where you need to look your best and stay on your feet.',
    sales: 155,
    createdAt: '2025-09-30T10:30:00Z'
  },
  {
    id: '9',
    title: 'Velvet Evening Heels',
    price: 2950,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    category: 'Heels',
    shortDescription: 'Luxurious velvet heels for the evening gala.',
    description: 'The pinnacle of evening luxury. Our velvet heels feature a deep plum hue and a wrap-around ankle strap for ultimate sophistication.',
    badge: 'Limited',
    sales: 45,
    createdAt: '2025-10-25T18:00:00Z'
  },
  {
    id: '10',
    title: 'Crystal Embellished Pumps',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1590673846645-316499827011?auto=format&fit=crop&q=80',
    category: 'Heels',
    shortDescription: 'Dazzling crystal pumps for special occasions.',
    description: 'When regular luxury isn\'t enough. These pumps are adorned with fine crystals that catch the light at every angle.',
    sales: 25,
    createdAt: '2025-10-26T12:00:00Z'
  },
  {
    id: '11',
    title: 'Minimalist White Trainers',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80',
    category: 'Sneakers',
    shortDescription: 'Clean, minimalist sneakers for versatile styling.',
    description: 'The foundation of any modern wardrobe. Clean white lines and premium leather construction that pairs with anything.',
    sales: 520,
    createdAt: '2025-08-01T09:00:00Z'
  },
  {
    id: '12',
    title: 'Luxe Metallic Sandals',
    price: 2600,
    image: 'https://images.unsplash.com/photo-1562273103-912079781d69?auto=format&fit=crop&q=80',
    category: 'Sandals',
    shortDescription: 'Shining metallic sandals for high-end events.',
    description: 'A shimmering addition to your festive attire. Gold-toned metallic finish that exalts the foot and the outfit.',
    badge: 'New',
    sales: 78,
    createdAt: '2025-10-18T11:45:00Z'
  }
];
