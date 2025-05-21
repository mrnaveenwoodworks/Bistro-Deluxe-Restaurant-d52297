import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    // Get order details from sessionStorage
    const storedOrder = sessionStorage.getItem("orderConfirmation");
    if (!storedOrder) {
      navigate("/");
      return;
    }

    const orderData = JSON.parse(storedOrder);
    setOrderDetails(orderData);

    // Set up countdown timer
    const estimatedTime = new Date(orderData.estimatedDelivery);
    const updateTimer = () => {
      const now = new Date();
      const diff = estimatedTime - now;
      
      if (diff > 0) {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      } else {
        setTimeRemaining("0:00");
        clearInterval(timerInterval);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [navigate]);

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" className="text-green-500"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M128,32A96,96,0,1,0,224,128,96,96,0,0,0,128,32Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll start preparing it right away!
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{orderDetails.orderNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {format(new Date(orderDetails.orderTime), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <Link
                to="/#menu"
                className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
              >
                <span>Order Again</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" className="ml-1"><rect width="256" height="256" fill="none"/><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </Link>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-amber-50 p-6 border-b border-amber-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="mr-4">
                  {orderDetails.orderType === "delivery" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="36" height="36" className="text-amber-600"><rect width="256" height="256" fill="none"/><path d="M176,80h42.3a8,8,0,0,1,7.3,4.7L248,128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="224" x2="202" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="224" x2="96" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="132" cy="224" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="220" cy="224" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M176,224h0a32,32,0,0,1-32-32V80a32,32,0,0,1,32-32h0v176Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M176,128h72v64a32,32,0,0,1-32,32h-40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M132,192H47.3a8,8,0,0,1-7.6-5.5L8,80H176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="36" height="36" className="text-amber-600"><rect width="256" height="256" fill="none"/><circle cx="128" cy="104" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,104c0,72-80,128-80,128S48,176,48,104a80,80,0,0,1,160,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Estimated {orderDetails.orderType === "delivery" ? "Delivery" : "Pickup"} Time
                  </p>
                  <p className="text-2xl font-bold text-amber-900">
                    {format(new Date(orderDetails.estimatedDelivery), "h:mm a")}
                  </p>
                  {timeRemaining && (
                    <p className="text-sm text-amber-700">
                      {timeRemaining} minutes remaining
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full animate-progress"></div>
                </div>
                <div className="flex justify-between text-xs text-amber-700 mt-2">
                  <span>Order Placed</span>
                  <span>Preparing</span>
                  <span>{orderDetails.orderType === "delivery" ? "On the Way" : "Ready"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.cartId} className="flex justify-between">
                  <div className="flex items-start">
                    <span className="text-gray-600 mr-2">{item.quantity}x</span>
                    <div>
                      <p className="text-gray-900 font-medium">{item.name}</p>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-500 mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                {orderDetails.deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Need Help?</h4>
                <p className="text-sm text-gray-600">
                  Call us at (212) 555-1234
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Order Updates</h4>
                <p className="text-sm text-gray-600">
                  We'll send updates to {orderDetails.customerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;