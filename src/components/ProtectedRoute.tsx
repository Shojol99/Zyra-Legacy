import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="w-12 h-12 border-4 border-brand-secondary/20 border-t-brand-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" state={{ from: window.location.pathname, error: "Administrative privileges required." }} replace />;
  }

  return <Outlet />;
}
