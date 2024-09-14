import React from 'react';
import axios from 'axios';
import axiosInstance from '@/app/hooks/useApi';
import logo from '../../../../../../public/images/logo.png'

interface RazorpayButtonProps {
  amount: number;
  onSuccess: () => Promise<void>;  // Ensure the onSuccess prop is correctly typed
}


const RazorpayButton: React.FC<RazorpayButtonProps> = ({ amount , onSuccess}) => {

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // Step 1: Create an order in the backend
      const { data } = await axiosInstance.post('/user-service/payments', { amount });

      if (!data.success) {
        alert('Unable to create order. Please try again.');
        return;
      }

      // Step 2: Initialize Razorpay and open the checkout UI
      const options = {
        key: 'rzp_test_j6Z5wtQQMu2gyk', // Ensure you have this in your .env file
        amount: data.amount, // in paise (INR)
        currency: "INR",
        name: "Care Point",
        description: "Test Transaction",
        image: logo, // Add your logo
        order_id: data.order.id, // Razorpay order ID from backend
        handler: function (response: any) {
          onSuccess()
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <button 
    onClick={handlePayment} 
    className="razorpay-button ml-[370px] bg-blue-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
  >
    Pay ₹{amount}
  </button>
  );
};

export default RazorpayButton;
