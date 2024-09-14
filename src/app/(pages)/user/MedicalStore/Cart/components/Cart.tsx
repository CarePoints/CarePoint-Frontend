'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // Use any[] or define a more specific type if needed

  useEffect(() => {
    const fetchProducts = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const result = await axiosInstance.post('/user-service/getCartProducts', { user });
          console.log('result is', result.data);
          setCartItems(result.data.medicines || []); // Ensure result.data.medicine is an array
        } catch (error) {
          console.error('Error fetching cart products:', error);
        }
      }
    };

    fetchProducts();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(cartItems.map(item =>
      item.productid === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto bg-slate-100 shadow-md rounded-lg overflow-hidden mt-16">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
          <ShoppingCart className="mr-2" /> Your Cart
        </h2>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <img
                  className="h-20 w-20 rounded-md object-cover"
                  src={item.image[0]} // Assuming image is an array with at least one URL
                  alt={item.productName}
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.productid, item.quantity - 1)}
                    className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-2 text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productid, item.quantity + 1)}
                    className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 p-1 rounded-full text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddToCartPage;
