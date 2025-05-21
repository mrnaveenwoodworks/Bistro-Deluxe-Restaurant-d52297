// Import any required libraries
// For production, you would use the actual Stripe/PayPal SDK
// import { loadStripe } from "@stripe/stripe-js";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Mock API configuration for development
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === "production"
    ? "https://api.bistrodeluxe.com/payments"
    : "https://dev-api.bistrodeluxe.com/payments",
  TIMEOUT: 10000, // 10 seconds
  API_KEY: process.env.REACT_APP_PAYMENT_API_KEY || "test_api_key"
};

// Card validation utilities
export const validateCardNumber = (cardNumber) => {
  const sanitized = cardNumber.replace(/\s+/g, "");

  // Check if the input contains only digits and is the right length
  if (!/^\d{15,16}$/.test(sanitized)) {
    return false;
  }

  // Luhn algorithm (mod 10)
  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiryDate) => {
  // Check format MM/YY
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    return false;
  }

  const [monthStr, yearStr] = expiryDate.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Check if card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

export const detectCardType = (cardNumber) => {
  const sanitized = cardNumber.replace(/\s+/g, "");

  // Visa
  if (/^4\d{12}(\d{3})?$/.test(sanitized)) {
    return "visa";
  }

  // Mastercard
  if (/^5[1-5]\d{14}$/.test(sanitized)) {
    return "mastercard";
  }

  // American Express
  if (/^3[47]\d{13}$/.test(sanitized)) {
    return "amex";
  }

  // Discover
  if (/^6(?:011|5\d{2})\d{12}$/.test(sanitized)) {
    return "discover";
  }

  return "unknown";
};

/**
 * Process a payment through the payment gateway
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (paymentDetails) => {
  // For development/demo purposes, simulate API call
  if (process.env.NODE_ENV !== "production") {
    return simulatePaymentProcess(paymentDetails);
  }

  try {
    // In production, you would use the actual payment service
    // return await processStripePayment(paymentDetails);
    // or
    // return await processPayPalPayment(paymentDetails);
    
    // Mock implementation for now
    return simulatePaymentProcess(paymentDetails);
  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error("Payment processing failed. Please try again.");
  }
};

/**
 * Create a payment intent (for Stripe integration)
 * @param {Object} orderData - Order data including amount and currency
 * @returns {Promise<Object>} - Client secret and payment intent ID
 */
export const createPaymentIntent = async (orderData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        amount: Math.round(orderData.total * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: orderData.orderNumber
        }
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Unable to initialize payment process");
  }
};

/**
 * Get saved payment methods for a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} - List of saved payment methods
 */
export const getSavedPaymentMethods = async (customerId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/payment-methods/${customerId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_CONFIG.API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};

/**
 * Save a payment method for future use
 * @param {Object} paymentMethod - Payment method data
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} - Result of save operation
 */
export const savePaymentMethod = async (paymentMethod, customerId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/save-payment-method`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        paymentMethod,
        customerId
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving payment method:", error);
    throw new Error("Unable to save payment method");
  }
};

/**
 * Simulate payment process for development/testing
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Simulated payment result
 */
const simulatePaymentProcess = async (paymentDetails) => {
  // Validate inputs
  if (!validateCardNumber(paymentDetails.cardNumber)) {
    return { success: false, error: "Invalid card number" };
  }

  if (!validateExpiryDate(paymentDetails.cardExpiry)) {
    return { success: false, error: "Invalid expiry date" };
  }

  if (!/^\d{3,4}$/.test(paymentDetails.cardCvc)) {
    return { success: false, error: "Invalid CVC" };
  }

  // Generate deterministic failures for testing
  // Fail if amount is exactly $11.11 or if card number ends with 1111
  const amountMatchesTestCase = Math.abs(paymentDetails.amount - 11.11) < 0.001;
  const cardEndsWithTestPattern = paymentDetails.cardNumber.replace(/\s/g, "").endsWith("1111");
  
  if (amountMatchesTestCase || cardEndsWithTestPattern) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for realism
    return {
      success: false,
      error: "Your card was declined. Please try a different payment method.",
      declineCode: "card_declined"
    };
  }

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate a fake transaction ID
  const transactionId = `tr_${Math.random().toString(36).substr(2, 9)}${Date.now().toString().substr(-4)}`;

  return {
    success: true,
    transactionId,
    timestamp: new Date().toISOString(),
    cardType: detectCardType(paymentDetails.cardNumber),
    last4: paymentDetails.cardNumber.slice(-4),
    amount: paymentDetails.amount,
  };
};

/**
 * Process a payment through Stripe
 * This is a placeholder for actual Stripe integration
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Payment result
 */
const processStripePayment = async (paymentDetails) => {
  // In production code, this would use the Stripe SDK
  // Example implementation:
  /*
  const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
  const { error, paymentIntent } = await stripe.confirmCardPayment(
    paymentDetails.clientSecret,
    {
      payment_method: {
        card: paymentDetails.cardElement,
        billing_details: {
          name: paymentDetails.nameOnCard,
        },
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    transactionId: paymentIntent.id,
    timestamp: new Date().toISOString(),
    last4: paymentDetails.cardElement._implementation._frame.innerText.slice(-4),
    amount: paymentIntent.amount / 100,
  };
  */

  // Temporary placeholder implementation
  return simulatePaymentProcess(paymentDetails);
};

/**
 * Process a payment through PayPal
 * This is a placeholder for actual PayPal integration
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Payment result
 */
const processPayPalPayment = async (paymentDetails) => {
  // In production code, this would use the PayPal SDK
  // Example implementation:
  /*
  const response = await fetch(`${API_CONFIG.BASE_URL}/process-paypal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_CONFIG.API_KEY}`
    },
    body: JSON.stringify({
      orderID: paymentDetails.orderId,
      amount: paymentDetails.amount,
    })
  });

  if (!response.ok) {
    throw new Error("PayPal payment failed");
  }

  const data = await response.json();
  return {
    success: true,
    transactionId: data.transactionId,
    timestamp: new Date().toISOString(),
    paymentMethod: "paypal",
    amount: paymentDetails.amount,
  };
  */

  // Temporary placeholder implementation
  return simulatePaymentProcess(paymentDetails);
};

/**
 * Generate receipt for completed payment
 * @param {Object} paymentData - Payment transaction data
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Receipt data
 */
export const generateReceipt = async (paymentData, orderData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate-receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        paymentData,
        orderData
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating receipt:", error);
    
    // Fallback to local receipt generation
    return {
      receiptId: `rcpt_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: paymentData.transactionId,
      orderNumber: orderData.orderNumber,
      date: new Date().toISOString(),
      total: orderData.total,
      items: orderData.items,
      paymentMethod: {
        type: paymentData.cardType || "card",
        last4: paymentData.last4 || "****"
      },
      customerEmail: orderData.customerEmail
    };
  }
};