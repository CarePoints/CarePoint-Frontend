
'use client'
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import axiosInstance from "@/app/hooks/useApi";
import cartIcon from "../../../../../../public/images/cartIcon.png";
import {useRouter} from 'next/navigation'

export interface IMedicine {
  _id:any;
  name: string;
  category: string;
  price: number;
  stock: number;
  dosage: string;
  expiryDate: Date;
  sideEffects: string;
  productImage?: string;
}

const Medicines = () => {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    const fetchMedicines = async () => {
      const response = await axiosInstance.get("/user-service/medicines");
      setMedicines(response.data.result);
    };
    fetchMedicines();
  }, []);

  // Filter medicines based on search query
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle Add to Cart
  const handleAddToCart = async (medicineId: string) => {
    try {
      console.log('handle add to cart is working');
      const user = localStorage.getItem('user') ;
      if(user){
        const userData = JSON.parse(user)
        let userId = userData._id
       console.log('user',user)
      const response = await axiosInstance.post('/user-service/add-to-cart', {
        userId,
        medicineId
      });
      console.log('Added to cart:', response.data);
      if(response){
        router.push('/user/MedicalStore/Cart')
      }
    }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optionally, show error message
    }
  };


  return (
    <div className="bg-gradient-to-br bg-[#0E0A3C] rounded-3xl m-3 p-6 md:p-12 lg:p-16 mt-10 min-h-screen">
      <main className="flex-1 flex flex-col relative p-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-white text-3xl font-bold">Give All You Need</h1>
          <div className="relative flex items-center">
            <a href="/user/MedicalStore/Cart">
              <Image
                src={cartIcon}
                alt="profileImg"
                width={50}
                height={50}
                className="rounded-full mr-8"
              />
            </a>
            <input
              type="text"
              placeholder="Search medicines..."
              className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMedicines.map((medicine, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
            >
              <img
                src={medicine.productImage}
                alt={medicine.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {medicine.name}
                </h3>
                <p className="text-gray-300 mb-1">Category: {medicine.category}</p>
                <p className="text-gray-300 mb-1">Dosage: {medicine.dosage}</p>
                <p className="text-gray-300 mb-1">Price: ${medicine.price.toFixed(2)}</p>
                <p className="text-gray-300 mb-4">Stock: {medicine.stock} available</p>
                <div className="flex justify-between space-x-4">
                  <button  onClick={() => handleAddToCart(medicine._id)} className="flex-1 bg-white text-purple-800 px-4 py-2 rounded-full shadow-md hover:bg-purple-100 transition duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-700 transition duration-300 transform hover:-translate-y-1">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Medicines;
