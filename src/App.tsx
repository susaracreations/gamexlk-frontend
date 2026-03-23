import React, { useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';

import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import UserLoginPage from './pages/UserLoginPage';
import UserSignUpPage from './pages/UserSignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import AddGamePage from './pages/AddGamePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AllProductsPage from './pages/AllProductsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const { toasts, toast, removeToast } = useToast();

  const handleToast = useCallback((msg: string, type: string) => {
    toast(msg, type as any);
  }, [toast]);

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Routes>
        <Route path="/" element={<HomePage onToast={handleToast} />} />
        <Route path="/products" element={<AllProductsPage onToast={handleToast} />} />
        <Route path="/game/:id" element={<GameDetailPage onToast={handleToast} />} />
        <Route path="/login" element={<LoginPage onToast={handleToast} />} />
        <Route path="/signin" element={<UserLoginPage onToast={handleToast} />} />
        <Route path="/signup" element={<UserSignUpPage onToast={handleToast} />} />
        <Route path="/profile" element={<UserProfilePage onToast={handleToast} />} />
        <Route path="/add-game" element={<AddGamePage onToast={handleToast} />} />
        <Route path="/admin" element={<AdminDashboardPage onToast={handleToast} />} />
        <Route path="/checkout" element={<CheckoutPage onToast={handleToast} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
