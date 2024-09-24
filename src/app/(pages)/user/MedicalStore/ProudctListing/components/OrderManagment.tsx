'use client';
import React, { useEffect, useState } from 'react';
import { Package, Search, RefreshCw, RotateCcw, Truck, XCircle } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Initialize as empty array
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser._id;
        const result = await axiosInstance.post('/user-service/orderData', { userId });
        if (result) {
          const productData = result.data.medicines;
          const orders = productData.map((product: any) => ({
            id: product._id,
            date: product.orderDate,
            status: product.status,
            total: product.totalPrice,
            items: product.products.map((item: any) => ({
              id: item._id,
              name: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
          }));
          setOrders(orders);
        }
      }
    };
    fetchProducts();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.date.includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );


const handleCancel = async (orderId: string) => {
  try {
    const result = await axiosInstance.post('/user-service/orderCancel', { orderId });

    if (result) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      alert(`Order #${orderId} has been cancelled.`);
    }
  } catch (error) {
    console.error('Error cancelling the order:', error);
    alert('Failed to cancel the order. Please try again.');
  }
};


  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-500';
      case 'Shipped':
        return 'text-blue-500';
      case 'Delivered':
        return 'text-green-500';
      case 'Cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Render buttons based on the order status
  const ActionButton: React.FC<{ order: Order }> = ({ order }) => {
    switch (order.status) {

      case 'Shipped':
        return (
          <button
          onClick={() => handleCancel(order.id)}
          className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center"
        >
          <XCircle className="mr-2" size={18} /> Cancel
        </button>
        );
      case 'Processing':
        return (
          <button
            onClick={() => handleCancel(order.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center"
          >
            <XCircle className="mr-2" size={18} /> Cancel
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => (
          <div key={order.id} className="mb-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <div>
                <span className="font-bold">Order #{order.id}</span>
                <span className="ml-4 text-gray-600">{order.date}</span>
              </div>
              <div className={`font-semibold ${getStatusColor(order.status)}`}>
                <Package className="inline-block mr-2" size={18} />
                {order.status}
              </div>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">Total: ${order.total.toFixed(2)}</span>
                <ActionButton order={order} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderManagement;
