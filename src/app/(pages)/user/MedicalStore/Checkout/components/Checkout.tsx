// 'use client'
// import axiosInstance from '@/app/hooks/useApi';
// import React, { useEffect, useState } from 'react';

// const CheckoutPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     country: '',
//     zipCode: '',
//   });

//   const [cartItems, setCartItems] = useState<any[]>([]);



//   useEffect(()=>{
//     const featchCartProducts = async ()=>{
//       const user = localStorage.getItem('user');
//       if(user){
//         const parsedUserData = JSON.parse(user);
//         const userID = parsedUserData._id;
//         console.log('the userid is', userID)
//         const result = await axiosInstance.post('/user-service/cartProducts',{userID});
//         console.log('result',result.data.medicines)
//         setCartItems(result.data.medicines)
//       }
//     }
//     featchCartProducts()
//   },[])

//   const handleInputChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const calculateSubtotal = () => {
//     if (!Array.isArray(cartItems)) return 0;
    
//     return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
//   };
  

//   const calculateTotal  = () =>{
//     const shippingCost = 99.99;
//     return calculateSubtotal() + shippingCost;
//   }


//   const handlePayment = () => {
//     console.log('Form data for Razorpay payment:', formData);  
//     // Example of Razorpay integration
//   };



//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white py-12 px-6 lg:px-12">
//       <div className="max-w-6xl mx-auto shadow-2xl rounded-lg overflow-hidden bg-white">
//         <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-12 p-8 bg-gradient-to-r from-blue-100 to-blue-50">
//           Checkout
//         </h1>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-8">
//           {/* Shipping Info */}
//           <div className="lg:col-span-2 bg-gray-50 p-8 rounded-lg border border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
//             <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">City</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     required
//                     className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Country</label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={formData.country}
//                     onChange={handleInputChange}
//                     required
//                     className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Zip Code</label>
//                 <input
//                   type="text"
//                   name="zipCode"
//                   value={formData.zipCode}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-8 rounded-lg border border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
//             <div className="space-y-4">
//               <div className="flex justify-between text-lg">
//                 <span>Subtotal</span>
//                 <span>₹{calculateSubtotal()}</span>
//               </div>
//               <div className="flex justify-between text-lg">
//                 <span>Shipping</span>
//                 <span>₹99.99</span>
//               </div>
//               <div className="flex justify-between text-xl font-bold">
//                 <span>Total</span>
//                 <span>₹{calculateTotal().toFixed(2)}</span>
//               </div>
//             </div>
//             <button
//               className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-md shadow-lg font-semibold hover:opacity-90 transition-opacity"
//               onClick={handlePayment}
//             >
//               Pay with Razorpay
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/app/hooks/useApi';
import RazorpayButton from '../../../Appointments/razorpay/RazorpayButton';
import {useRouter} from 'next/navigation'

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter()

  useEffect(() => {
    const fetchCartProducts = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUserData = JSON.parse(user);
        const userID = parsedUserData._id;
        const result = await axiosInstance.post('/user-service/cartProducts', { userID });
        setCartItems(result.data.medicines);
      }
    };
    fetchCartProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateForm({ ...formData, [name]: value });
  };

  const validateForm = (data: typeof formData) => {
    const { name, email, address, city, country, zipCode } = data;
    setIsFormValid(Boolean(name && email && address && city && country && zipCode));
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTotal = () => {
    const shippingCost = 99.99;
    return calculateSubtotal() + shippingCost;
  };

  const handlePaymentSuccess = async () => {
    let user = localStorage.getItem("user");
    if(user){
    const parsedUser = JSON.parse(user)
    let userID = parsedUser._id;
    try {
      const response = await axiosInstance.post("/user-service/productsOrders", { userID,cartItems,formData});
      if (response.status==200) {
        alert("Order placed successfully!");
        router.push('/user/MedicalStore')
      } else {
        alert("Order placement failed. Please try again.");
        
      }
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
          
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-12">
          Complete Your Order
        </h1>
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Shipping Info */}
            <div className="p-8 bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="p-8 bg-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-lg font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-lg font-medium">₹99.99</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xl font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                
                <div className="mt-8">
                  {isFormValid ? (
                    <div className="w-full flex justify-center">
                      <RazorpayButton 
                        amount={1} 
                        onSuccess={handlePaymentSuccess}
                      />
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm text-center">Please fill in all required fields to proceed with payment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;