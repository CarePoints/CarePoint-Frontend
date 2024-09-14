"use client";

import  { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}


const AdminProductListing = () => {
  const [products,setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const result = await axiosInstance.get('/admin-service/productListing');
        console.log('productListing result is', result);
        setProducts(result.data.result);
      
      } catch (error) {
        console.error('Error fetching product listing:', error);
      }
    };

    fetchProductsData();
  }, []);

  console.log('product is',products)
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto p-6 mt-32">
        <h1 className="text-3xl font-bold mb-6 text-white">Product Listing</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-md text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <a href="/admin/productsListing/addProducts"><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus size={18} className="mr-2" />
            Add Product
          </button></a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transition duration-300 hover:bg-opacity-20">
              <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
              <p className="text-gray-300 mb-1">Category: {product.category}</p>
              <p className="text-gray-300 mb-1">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-300 mb-4">Stock: {product.stock}</p>
              <div className="flex justify-between items-center">
                <button className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductListing;