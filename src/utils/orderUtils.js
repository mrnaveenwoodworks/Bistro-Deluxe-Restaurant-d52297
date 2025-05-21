// Base preparation times (in minutes) for different item types
const BASE_PREP_TIMES = {
  starters: 8,
  mainCourses: 15,
  pasta: 12,
  sides: 8,
  desserts: 10,
  beverages: 3
};

// Delivery time estimates based on distance
const DELIVERY_TIME_ESTIMATES = {
  near: 15,    // 0-2 miles
  medium: 25,  // 2-4 miles
  far: 35      // 4-5 miles
};

/**
 * Generates a unique order number
 * Format: YYYYMMDD-XXXX (where X is random)
 */
export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `${year}${month}${day}-${random}`;
};

/**
 * Calculates the base preparation time for an order based on items
 * @param {Array} items - Array of order items
 * @returns {number} - Preparation time in minutes
 */
export const calculatePrepTime = (items) => {
  // Find the item that takes longest to prepare
  const maxPrepTime = Math.max(...items.map(item => BASE_PREP_TIMES[item.category] || 10));
  
  // Add additional time for large orders
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const volumeAdjustment = Math.floor(totalItems / 4) * 5; // Add 5 mins for every 4 items
  
  return maxPrepTime + volumeAdjustment;
};

/**
 * Estimates delivery time based on distance and traffic conditions
 * @param {number} distance - Distance in miles
 * @param {boolean} isHighTraffic - Whether it's high traffic time
 * @returns {number} - Delivery time in minutes
 */
export const estimateDeliveryTime = (distance, isHighTraffic = false) => {
  let baseTime;
  
  if (distance <= 2) {
    baseTime = DELIVERY_TIME_ESTIMATES.near;
  } else if (distance <= 4) {
    baseTime = DELIVERY_TIME_ESTIMATES.medium;
  } else {
    baseTime = DELIVERY_TIME_ESTIMATES.far;
  }
  
  // Add 10 minutes during high traffic
  return isHighTraffic ? baseTime + 10 : baseTime;
};

/**
 * Checks if current time is during high traffic hours
 * @returns {boolean}
 */
export const isHighTrafficTime = () => {
  const currentHour = new Date().getHours();
  return (currentHour >= 11 && currentHour <= 14) || // Lunch rush
         (currentHour >= 17 && currentHour <= 19);   // Dinner rush
};

/**
 * Calculates the total estimated time for order completion
 * @param {Array} items - Order items
 * @param {string} orderType - "delivery" or "pickup"
 * @param {number} distance - Distance in miles (for delivery)
 * @returns {Object} - Estimated times and completion time
 */
export const calculateEstimatedTimes = (items, orderType, distance = 0) => {
  const prepTime = calculatePrepTime(items);
  const isHighTraffic = isHighTrafficTime();
  const deliveryTime = orderType === "delivery" ? 
    estimateDeliveryTime(distance, isHighTraffic) : 0;
  
  const totalTime = prepTime + deliveryTime;
  const completionTime = new Date(Date.now() + totalTime * 60000);
  
  return {
    prepTime,
    deliveryTime,
    totalTime,
    completionTime,
    isHighTraffic
  };
};

/**
 * Validates if an order can be processed
 * @param {Array} items - Order items
 * @param {string} orderType - "delivery" or "pickup"
 * @param {Object} customerInfo - Customer information
 * @returns {Object} - Validation result
 */
export const validateOrder = (items, orderType, customerInfo) => {
  const errors = [];
  
  // Check if restaurant is open
  const currentHour = new Date().getHours();
  if (currentHour < 11 || currentHour >= 22) {
    errors.push("Restaurant is currently closed. Operating hours are 11 AM - 10 PM");
  }
  
  // Validate order items
  if (!items || items.length === 0) {
    errors.push("Order must contain at least one item");
  }
  
  // Validate delivery information
  if (orderType === "delivery") {
    if (!customerInfo.address) {
      errors.push("Delivery address is required");
    }
    if (!customerInfo.phone) {
      errors.push("Phone number is required for delivery");
    }
  }
  
  // Validate customer information
  if (!customerInfo.name || !customerInfo.email) {
    errors.push("Customer name and email are required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Processes order status updates
 * @param {string} orderNumber - Order number
 * @param {string} status - New status
 * @param {Object} details - Additional status details
 * @returns {Object} - Updated order status
 */
export const updateOrderStatus = (orderNumber, status, details = {}) => {
  const validStatuses = [
    "received",
    "preparing",
    "ready_for_delivery",
    "out_for_delivery",
    "ready_for_pickup",
    "completed",
    "cancelled"
  ];
  
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }
  
  const timestamp = new Date().toISOString();
  
  return {
    orderNumber,
    status,
    timestamp,
    details,
    isCompleted: ["completed", "cancelled"].includes(status)
  };
};

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};

/**
 * Checks if delivery is available for given address
 * @param {Object} address - Delivery address
 * @returns {Object} - Availability result
 */
export const checkDeliveryAvailability = (address) => {
  // Simplified check - in real app would use geocoding service
  const { zipCode } = address;
  const validZipCodes = ["10001", "10002", "10003", "10004", "10005"];
  
  return {
    available: validZipCodes.includes(zipCode),
    maxDistance: 5, // miles
    minOrder: 15,   // dollars
    deliveryFee: 5.99
  };
};

/**
 * Gets the next available delivery/pickup time slots
 * @param {string} type - "delivery" or "pickup"
 * @returns {Array} - Available time slots
 */
export const getAvailableTimeSlots = (type) => {
  const slots = [];
  const now = new Date();
  const closing = new Date();
  closing.setHours(22, 0, 0, 0);
  
  // Start from next 30-minute interval
  const start = new Date(now);
  start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30);
  start.setSeconds(0, 0);
  
  // Add minimum preparation/delivery time
  const minDelay = type === "delivery" ? 45 : 25;
  start.setMinutes(start.getMinutes() + minDelay);
  
  // Generate slots until closing
  let current = start;
  while (current < closing) {
    slots.push({
      time: current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: current.toISOString()
    });
    current = new Date(current.setMinutes(current.getMinutes() + 30));
  }
  
  return slots;
};