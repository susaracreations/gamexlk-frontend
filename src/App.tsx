import React, { useCallback, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';
import './mobile.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Loader from './components/Loader';
import { useToast } from './hooks/useToast';

import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NoticeBar from './components/NoticeBar';
import UserLoginPage from './pages/UserLoginPage';
import UserSignUpPage from './pages/UserSignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import UserProfilePage from './pages/UserProfilePage';
import AboutPage from './pages/AboutPage';
import AddGamePage from './pages/AddGamePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AllProductsPage from './pages/AllProductsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { toasts, toast, removeToast } = useToast();

  const handleToast = useCallback((msg: string, type: string) => {
    toast(msg, type as any);
  }, [toast]);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader fullScreen message="Initializing Store" />;
  }

  return (
    <BrowserRouter>
      <NoticeBar />
      <Navbar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Routes>
        <Route path="/" element={<HomePage onToast={handleToast} />} />
        <Route path="/products" element={<AllProductsPage onToast={handleToast} />} />
        <Route path="/products/:pageSlug" element={<AllProductsPage onToast={handleToast} />} />
        <Route path="/product/:idOrSlug" element={<GameDetailPage onToast={handleToast} />} />
        <Route path="/signin" element={<UserLoginPage onToast={handleToast} />} />
        <Route path="/signup" element={<UserSignUpPage onToast={handleToast} />} />
        <Route path="/onboarding" element={<OnboardingPage onToast={handleToast} />} />
        <Route path="/profile" element={<UserProfilePage onToast={handleToast} />} />
        <Route path="/add-game" element={<AddGamePage onToast={handleToast} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminDashboardPage onToast={handleToast} />} />
        <Route path="/checkout" element={<CheckoutPage onToast={handleToast} />} />
        <Route path="/adminlogin" element={<AdminLoginPage onToast={handleToast} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
