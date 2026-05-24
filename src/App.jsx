import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import MessagesPage from './pages/MessagesPage';
import ReviewsPage from './pages/ReviewsPage';
import StatsPage from './pages/StatsPage';

// MetaMask xatolarini bostirish
const suppressMetaMaskErrors = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('MetaMask') ||
      args[0].includes('Failed to connect to MetaMask') ||
      args[0].includes('inpage.js')
    )) {
      return;
    }
    originalError.apply(console, args);
  };
  
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('MetaMask') ||
      args[0].includes('inpage.js')
    )) {
      return;
    }
    originalWarn.apply(console, args);
  };
};

function AppContent() {
  const { isAdmin } = useAdmin();
  
  useEffect(() => {
    suppressMetaMaskErrors();
  }, []);
  
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/" element={
        isAdmin ? (
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/orders" element={
        isAdmin ? (
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/products" element={
        isAdmin ? (
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/messages" element={
        isAdmin ? (
          <AdminLayout>
            <MessagesPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/reviews" element={
        isAdmin ? (
          <AdminLayout>
            <ReviewsPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/stats" element={
        isAdmin ? (
          <AdminLayout>
            <StatsPage />
          </AdminLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <AdminProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AdminProvider>
    </ToastProvider>
  );
}

export default App;