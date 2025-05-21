import React, { useState } from "react";
import { processPayment } from "../services/paymentService";

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    nameOnCard: ""
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date
    if (name === "cardExpiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    // Format CVC
    if (name === "cardCvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Validate card number (16 digits)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!cleanCardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cleanCardNumber)) {
      newErrors.cardNumber = "Invalid card number";
    }

    // Validate expiry date (MM/YY format)
    if (!formData.cardExpiry) {
      newErrors.cardExpiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = "Invalid expiry date";
    } else {
      // Check if card is expired
      const [month, year] = formData.cardExpiry.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        newErrors.cardExpiry = "Card has expired";
      }
    }

    // Validate CVC (3-4 digits)
    if (!formData.cardCvc) {
      newErrors.cardCvc = "CVC is required";
    } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
      newErrors.cardCvc = "Invalid CVC";
    }

    // Validate name
    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const paymentResult = await processPayment({
        amount,
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        cardExpiry: formData.cardExpiry,
        cardCvc: formData.cardCvc,
        nameOnCard: formData.nameOnCard
      });

      if (paymentResult.success) {
        onSuccess(paymentResult.transactionId);
      } else {
        onError(paymentResult.error);
        setErrors({ submit: paymentResult.error });
      }
    } catch (error) {
      onError(error.message);
      setErrors({ submit: "Payment processing failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Icons */}
      <div className="flex justify-start space-x-2 mb-4">
        <img
          src="https://example.com/visa-icon.png"
          alt="Visa"
          className="h-8"
        />
        <img
          src="https://example.com/mastercard-icon.png"
          alt="Mastercard"
          className="h-8"
        />
        <img
          src="https://example.com/amex-icon.png"
          alt="American Express"
          className="h-8"
        />
      </div>

      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className={`w-full px-4 py-2 border ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            {/* Card type icon based on number */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="24" y="56" width="208" height="144" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="164" y1="164" x2="196" y2="164" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="164" x2="128" y2="164" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="24" y1="100" x2="232" y2="100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
        </div>
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
        )}
      </div>

      {/* Name on Card */}
      <div>
        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card
        </label>
        <input
          type="text"
          id="nameOnCard"
          name="nameOnCard"
          value={formData.nameOnCard}
          onChange={handleChange}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border ${
            errors.nameOnCard ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
        />
        {errors.nameOnCard && (
          <p className="mt-1 text-sm text-red-500">{errors.nameOnCard}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div>
          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            id="cardExpiry"
            name="cardExpiry"
            value={formData.cardExpiry}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
            className={`w-full px-4 py-2 border ${
              errors.cardExpiry ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.cardExpiry && (
            <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
          )}
        </div>

        {/* CVC */}
        <div>
          <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardCvc"
              name="cardCvc"
              value={formData.cardCvc}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className={`w-full px-4 py-2 border ${
                errors.cardCvc ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            <div className="absolute right-3 top-2.5 text-gray-400 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="180" r="16"/><path d="M128,144v-8a28,28,0,1,1,28-28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
          </div>
          {errors.cardCvc && (
            <p className="mt-1 text-sm text-red-500">{errors.cardCvc}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M128,32S96,80,40,88c0,72,32,123.58,88,136,56-12.42,88-64,88-136C160,80,128,32,128,32Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 128 112 152 168 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        <span className="ml-2">Secure Payment</span>
      </div>
    </form>
  );
};

export default PaymentForm;