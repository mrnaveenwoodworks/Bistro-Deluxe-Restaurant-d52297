import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Navigation Bar - Fixed Position */}
          <Navbar />
          
          {/* Main Content Container */}
          <main className="relative pb-20">
            <Routes>
              <Route path="/" element={
                <>
                  {/* Hero Section - Full Height */}
                  <section id="hero" className="relative z-0">
                    <Hero />
                  </section>
                  
                  {/* Menu Section - With Proper Spacing */}
                  <section id="menu" className="relative z-10 bg-white">
                    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                      <Menu />
                    </div>
                  </section>
                  
                  {/* Contact Section - With Background */}
                  <section id="contact" className="relative z-10 bg-gray-50">
                    <div className="container mx-auto max-w-7xl">
                      <Contact />
                    </div>
                  </section>
                </>
              } />

              {/* Cart Page */}
              <Route path="/cart" element={
                <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <Cart />
                </div>
              } />

              {/* Checkout Page */}
              <Route path="/checkout" element={
                <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <Checkout />
                </div>
              } />

              {/* Order Confirmation Page */}
              <Route path="/order-confirmation" element={
                <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <OrderConfirmation />
                </div>
              } />
            </Routes>
          </main>
          
          {/* Footer - Always at Bottom */}
          <footer className="relative z-10">
            <Footer />
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;