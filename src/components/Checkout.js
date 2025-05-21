import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cart,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
    clearCart,
    hasItems
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    orderType: "delivery",
    paymentMethod: "creditCard",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    nameOnCard: "",
    specialInstructions: "",
    preferredTime: "asap"
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  // Redirect if cart is empty
  if (!hasItems()) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    // Validate address if delivery is selected
    if (formData.orderType === "delivery") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    }
    
    // Validate payment info
    if (formData.paymentMethod === "creditCard") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) 
        newErrors.cardNumber = "Card number must be 16 digits";
      
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) 
        newErrors.cardExpiry = "Expiry date must be in MM/YY format";
        
      if (!formData.cardCvc.trim()) newErrors.cardCvc = "CVC is required";
      else if (!/^\d{3,4}$/.test(formData.cardCvc)) 
        newErrors.cardCvc = "CVC must be 3 or 4 digits";
        
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({
        top: document.querySelector(".checkout-form").offsetTop - 100,
        behavior: "smooth"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to process order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Calculate estimated time
      const now = new Date();
      let estimatedDelivery;
      
      if (formData.preferredTime === "asap") {
        // Add 30-45 minutes for delivery, 15-25 for pickup
        const minOffset = formData.orderType === "delivery" ? 30 : 15;
        const maxOffset = formData.orderType === "delivery" ? 45 : 25;
        const offset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
        
        estimatedDelivery = new Date(now.getTime() + offset * 60000);
      } else {
        // Use selected time
        const [hours, minutes] = selectedTime.split(':');
        estimatedDelivery = new Date();
        estimatedDelivery.setHours(parseInt(hours, 10));
        estimatedDelivery.setMinutes(parseInt(minutes, 10));
      }
      
      // Store order confirmation details in sessionStorage
      const orderConfirmation = {
        orderNumber,
        orderTime: now.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        customerName: `${formData.firstName} ${formData.lastName}`,
        orderType: formData.orderType,
        items: cart,
        subtotal: getSubtotal(),
        tax: getTax(),
        deliveryFee: getDeliveryFee(),
        total: getTotal(),
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions
      };
      
      sessionStorage.setItem("orderConfirmation", JSON.stringify(orderConfirmation));
      
      // Clear the cart
      clearCart();
      
      // Navigate to confirmation page
      navigate("/order-confirmation");
      
    } catch (error) {
      console.error("Error processing order:", error);
      setIsProcessing(false);
      // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>
              
              {/* Order Type */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Type</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.orderType === "delivery" 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleChange({ target: { name: "orderType", value: "delivery" } })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="delivery"
                        name="orderType"
                        value="delivery"
                        checked={formData.orderType === "delivery"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-amber-500"
                      />
                      <label htmlFor="delivery" className="ml-2 block text-sm font-medium text-gray-700">
                        Delivery
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Delivered to your doorstep in 30-45 minutes
                    </p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.orderType === "pickup" 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleChange({ target: { name: "orderType", value: "pickup" } })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pickup"
                        name="orderType"
                        value="pickup"
                        checked={formData.orderType === "pickup"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-amber-500"
                      />
                      <label htmlFor="pickup" className="ml-2 block text-sm font-medium text-gray-700">
                        Pickup
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Ready for pickup in 15-25 minutes
                    </p>
                  </div>
                </div>
                
                {/* Delivery Address (if delivery is selected) */}
                {formData.orderType === "delivery" && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Delivery Address</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code*
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${errors.zipCode ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                        />
                        {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Preferred Time */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Preferred Time</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${
                        formData.preferredTime === "asap" 
                          ? "border-amber-500 bg-amber-50" 
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleChange({ target: { name: "preferredTime", value: "asap" } })}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="asap"
                          name="preferredTime"
                          value="asap"
                          checked={formData.preferredTime === "asap"}
                          onChange={handleChange}
                          className="form-radio h-5 w-5 text-amber-500"
                        />
                        <label htmlFor="asap" className="ml-2 block text-sm font-medium text-gray-700">
                          As Soon As Possible
                        </label>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${
                        formData.preferredTime === "scheduled" 
                          ? "border-amber-500 bg-amber-50" 
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleChange({ target: { name: "preferredTime", value: "scheduled" } })}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="scheduled"
                          name="preferredTime"
                          value="scheduled"
                          checked={formData.preferredTime === "scheduled"}
                          onChange={handleChange}
                          className="form-radio h-5 w-5 text-amber-500"
                        />
                        <label htmlFor="scheduled" className="ml-2 block text-sm font-medium text-gray-700">
                          Schedule for Later
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.preferredTime === "scheduled" && (
                    <div className="mt-4">
                      <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time
                      </label>
                      <input
                        type="time"
                        id="scheduledTime"
                        name="scheduledTime"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        min="11:00"
                        max="21:30"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.paymentMethod === "creditCard" 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleChange({ target: { name: "paymentMethod", value: "creditCard" } })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                        checked={formData.paymentMethod === "creditCard"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-amber-500"
                      />
                      <label htmlFor="creditCard" className="ml-2 block text-sm font-medium text-gray-700">
                        Credit / Debit Card
                      </label>
                    </div>
                    
                    {formData.paymentMethod === "creditCard" && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number*
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full px-4 py-2 border ${errors.cardNumber ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          />
                          {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card*
                          </label>
                          <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.nameOnCard ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          />
                          {errors.nameOnCard && <p className="mt-1 text-sm text-red-500">{errors.nameOnCard}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date (MM/YY)*
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className={`w-full px-4 py-2 border ${errors.cardExpiry ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                            {errors.cardExpiry && <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                              CVC*
                            </label>
                            <input
                              type="text"
                              id="cardCvc"
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              placeholder="123"
                              className={`w-full px-4 py-2 border ${errors.cardCvc ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                            {errors.cardCvc && <p className="mt-1 text-sm text-red-500">{errors.cardCvc}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.paymentMethod === "cashOnDelivery" 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleChange({ target: { name: "paymentMethod", value: "cashOnDelivery" } })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cashOnDelivery"
                        name="paymentMethod"
                        value="cashOnDelivery"
                        checked={formData.paymentMethod === "cashOnDelivery"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-amber-500"
                      />
                      <label htmlFor="cashOnDelivery" className="ml-2 block text-sm font-medium text-gray-700">
                        {formData.orderType === "delivery" ? "Cash on Delivery" : "Cash on Pickup"}
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Pay with cash when your order is delivered or when you pick it up.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Special Instructions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
                
                <div>
                  <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any delivery instructions, allergies, or special requests?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="max-h-64 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">{item.quantity}x</span>
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-amber-600 font-medium">
                      ${typeof item.price === "number" 
                        ? (item.price * item.quantity).toFixed(2)
                        : item.price
                      }
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Cost Breakdown */}
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                {formData.orderType === "delivery" && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${getDeliveryFee().toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between font-semibold text-gray-900 text-lg mt-4">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - $${getTotal().toFixed(2)}`
                )}
              </button>
              
              {/* Security Message */}
              <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="88" width="176" height="128" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M92,88V56a36,36,0,0,1,72,0V88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;