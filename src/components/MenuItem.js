import React, { useState } from "react";

const MenuItem = ({ item, onAddToCart }) => {
  const { name, description, price, image, dietary = [], featured } = item;
  const [quantity, setQuantity] = useState(1);
  const [showCustomization, setShowCustomization] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...item,
      quantity,
      specialInstructions
    });
    setQuantity(1);
    setSpecialInstructions("");
    setShowCustomization(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg ${
      featured ? "border-2 border-amber-400" : ""
    }`}>
      {image && (
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          {featured && (
            <span className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
              Chef's Choice
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <span className="text-amber-600 font-bold">
            ${typeof price === "number" ? price.toFixed(2) : price}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-3">
            {dietary.map((diet, index) => (
              <span 
                key={index} 
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {diet}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </button>
            </div>
          </div>

          {/* Customization Toggle */}
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="flex items-center text-sm text-amber-600 hover:text-amber-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            <span className="ml-1">Add Special Instructions</span>
          </button>

          {/* Special Instructions Input */}
          {showCustomization && (
            <div className="mt-2">
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (allergies, preparation preferences, etc.)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                rows="2"
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M20,32H40L76.75,164.28A16,16,0,0,0,92.16,176H191a16,16,0,0,0,15.42-11.72L232,72H51.11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="88" cy="220" r="20"/><circle cx="192" cy="220" r="20"/></svg>
            Add to Cart
            {quantity > 1 && (
              <span className="text-sm bg-amber-600 px-2 py-0.5 rounded-full">
                x{quantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;