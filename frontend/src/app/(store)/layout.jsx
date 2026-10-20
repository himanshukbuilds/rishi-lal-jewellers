import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ShoppingAccessGate from '@/components/common/ShoppingAccessGate';
import JewelryChatbot from '@/components/chat/JewelryChatbot';

export default function StoreLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-50">
      {/* Stage 3: Full Shopping Homepage Experience */}
      <Header />
      <CartDrawer />
      <main className="flex-1"><ShoppingAccessGate>{children}</ShoppingAccessGate></main>
      <JewelryChatbot />
      <Footer />
    </div>
  );
}
