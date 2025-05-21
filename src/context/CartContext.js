import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
export const CartContext = createContext();

// Create Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(
        cartItem => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity
        };
        return updatedCart;
      }

      // Item doesn't exist, add new item
      return [...currentCart, { ...item, cartId: Date.now() }];
    });
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCart(currentCart => 
      currentCart.filter(item => item.cartId !== cartId)
    );
  };

  // Update item quantity
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Update special instructions
  const updateInstructions = (cartId, instructions) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.cartId === cartId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = typeof item.price === "string" 
        ? parseFloat(item.price.split(" - ")[0]) 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Calculate tax
  const getTax = () => {
    return getSubtotal() * 0.0825; // 8.25% tax rate
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  // Get total number of items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if cart has items
  const hasItems = () => {
    return cart.length > 0;
  };

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateInstructions,
    clearCart,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
    getTotalItems,
    hasItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};