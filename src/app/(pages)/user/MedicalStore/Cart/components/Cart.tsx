
'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';
import { useRouter } from 'next/navigation';
import ModalComponent from './ModalComponent'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  dosage?: string;
  expiryDate?: string;
  image?: string[];
  sideEffects?: string;
  status?: string;
  totalPrice?: number;
  userid?: string;
  _id: string;
}

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const prescriptionData = useSelector((state:RootState) => state.search.prescriptionData);

  useEffect(() => {
    if(prescriptionData) {
      console.log('prescriptionData in cart side', prescriptionData.medications);
      console.log('cartItems in cart side', cartItems);
      checkPrescriptionMatch(prescriptionData.medications, cartItems);
      setIsModalOpen(false); // Close the modal after prescription upload
    }
  }, [prescriptionData, cartItems]);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const result = await axiosInstance.post('/user-service/getCartProducts', { user });
          setCartItems(result.data.medicines || []);
        } catch (error) {
          console.error('Error fetching cart products:', error);
        }
      }
    };

    fetchProducts();
  }, []);

  const checkPrescriptionMatch = (prescriptionData: string[], cartItems: CartItem[]): void => {
    if (!prescriptionData || !cartItems) return;
  
    let allVerified = true;
    for (const cartItem of cartItems) {
      const isInPrescription = prescriptionData.includes(cartItem.productName);
  
      if (isInPrescription) {
        console.log(`The medicine ${cartItem.productName} is in the prescription.`);
      } else {
        console.log(`The medicine ${cartItem.productName} is NOT in the prescription.`);
        allVerified = false;
        setErrorMessage(`The medicine ${cartItem.productName} is NOT in the prescription.`);
        break;
      }
    }
    setIsVerified(allVerified);
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      try {
        const result = await axiosInstance.post('/user-service/updateQuantity', {
          userId: parsedData._id,
          productId: id,
          quantity: newQuantity,
        });

        if (result.status === 200) {
          setCartItems(cartItems.map(item => 
            item.productid === id ? { ...item, quantity: newQuantity } : item
          ));
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const removeItem = async (productId: string) => {
    const result = await axiosInstance.post('/user-service/removeItem', { productId });
    setCartItems(cartItems.filter(item => item._id !== productId));
  };

  const total = cartItems.reduce((sum, item) => {
    if (item && item.price !== undefined && item.quantity !== undefined) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  const handleCheckout = () => {
    if (isVerified) {
      router.push('/user/MedicalStore/Checkout');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 p-6">
      <div className="flex items-center mb-4">
        <ShoppingCart className="mr-2 text-blue-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
      </div>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <div className="border-t border-gray-200">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item._id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    className="h-20 w-20 rounded-md object-cover"
                    src={item.image[0]}
                    alt={item.productName}
                  />
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">{item.productName}</p>
                    <p className="text-md text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.productid, item.quantity - 1)}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="mx-2 text-lg text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productid, item.quantity + 1)}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="flex justify-between items-center bg-gray-50 p-4 mt-4 rounded-lg">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
      )}
      {cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          className={`mt-4 w-full text-white py-2 px-4 rounded-md transition duration-150 ease-in-out ${
            isVerified 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {isVerified ? "Proceed to Checkout" : "Add Prescription"}
        </button>
      )}
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AddToCartPage;