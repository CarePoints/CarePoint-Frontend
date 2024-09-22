'use client'
import React, { useState } from 'react';
import { PlusCircle, ArrowLeft, Camera } from 'lucide-react';
import axiosInstance from '@/app/hooks/useApi';
import axios from 'axios';
import {useRouter} from 'next/navigation'


interface FormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  dosage: string;
  sideEffects: string;
  expiryDate: string;
}


const AddProductPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    dosage: '',
    sideEffects: '',
    expiryDate: '',
  });

  const navigation = useRouter()


  const [image,setImage] = useState<File |null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("e.target.files[0]",e.target.files[0])
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();


    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      }
    }

      formDataToSend.append('productName', 'Example Product');
      formDataToSend.append('image', image as File); 
    

    try {
      // Send the form data to the server
      console.log('the image is', image)
      console.log("gmvnedkfjmvg",formData,formData);
      
      let data={
        formData,
        image
      }

      console.log("data",data)
      const response = await axios.post('http://localhost/admin-service/addProducts', formDataToSend,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      if(response){
        navigation.push('/admin/productsListing')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 sm:p-6 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button className="mr-4 hover:text-blue-400 transition duration-300">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Add New Medicine</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Medicine Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="painkillers">Painkillers</option>
                  <option value="antibiotics">Antibiotics</option>
                  <option value="vitamins">Vitamins</option>
                  <option value="cardiovascular">Cardiovascular</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dosage" className="text-sm font-medium">Dosage</label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                  required
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <label htmlFor="sideEffects" className="text-sm font-medium">Side Effects</label>
              <textarea
                id="sideEffects"
                name="sideEffects"
                value={formData.sideEffects}
                onChange={handleChange}
                // rows="3"
                className="w-full bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white px-4 py-2 transition duration-300"
                required
              ></textarea>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Product Image</h2>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 bg-opacity-50 hover:bg-gray-700 transition duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera size={48} className="mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            name='image'
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
      {image && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">Selected Image:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mt-2 max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md flex items-center transition duration-300"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;