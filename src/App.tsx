import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './lib/CartContext';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';

// Lazy load non-critical pages for better initial bundle size
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const SeedData = lazy(() => import('./pages/SeedData'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Login = lazy(() => import('./pages/Login'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Policy pages (Named Exports)
const ShippingPolicy = lazy(() => import('./pages/Policies').then(m => ({ default: m.ShippingPolicy })));
const ReturnsPolicy = lazy(() => import('./pages/Policies').then(m => ({ default: m.ReturnsPolicy })));
const PrivacyPolicy = lazy(() => import('./pages/Policies').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/Policies').then(m => ({ default: m.TermsConditions })));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/Admin/Overview'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminCustomers = lazy(() => import('./pages/Admin/Customers'));
const AdminBlog = lazy(() => import('./pages/Admin/Blog'));
const AdminReviews = lazy(() => import('./pages/Admin/Reviews'));
const AdminCoupons = lazy(() => import('./pages/Admin/Coupons'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));

// Loading component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPostDetail />} />
                  <Route path="/seed-data" element={<SeedData />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/returns" element={<ReturnsPolicy />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/track" element={<OrderTracking />} />
                </Route>

                {/* Login Page */}
                <Route path="/login" element={<Login />} />

                {/* Admin Routes (Protected) */}
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminOverview />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/blog" element={<AdminBlog />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/coupons" element={<AdminCoupons />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
