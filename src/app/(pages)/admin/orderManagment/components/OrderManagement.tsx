
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-200 text-yellow-800',
    Processing: 'bg-blue-200 text-blue-800',
    Shipped: 'bg-purple-200 text-purple-800',
    Delivered: 'bg-green-200 text-green-800',
    Cancelled: 'bg-red-200 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
};

export const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser._id;

        try {
          const result = await axiosInstance.get('/user-service/getAdminOrderData');
          if (result) {
            const productData = result.data.medicines;

            const orders = productData.map((product: any) => ({
              id: product._id,
              customer: product.address.userName || 'Unknown Customer', // Use the correct field from the API or fallback
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
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // Update the status locally
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    // Send the updated status to the backend
    try {
      await axiosInstance.post('/user-service/updateStatus', { orderId, status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Optionally, you could revert the status change locally if the request fails
    }
  };

  // Safely check if customer exists and handle search filtering
  const filteredOrders = orders?.filter(order =>
    order?.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (orderId:string) =>{
     await axiosInstance.post('/user-service/deleteOrder',{orderId})
     setOrders(orders.filter(order=> order.id !==orderId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black ">
      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mt-20">
          <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
          <div className="mb-4 flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{order.customer}</td>
                    <td className="px-4 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="mr-2 p-1 border rounded text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button className="text-red-600 hover:text-red-800" onClick={()=>handleDelete(order.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
