'use client'

import { useState } from 'react';
import akbar from "../../../../../../public/images/akbar.jpg";
import Image from "next/image";
import "animate.css";
import { useRouter } from 'next/navigation';

const CustomHeader = ({ currentPage }: any) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'users':
        router.push('/admin/userManagement');
        break;
      case 'doctors':
        router.push('/admin/doctorManagement');
        break;
      case 'productsListing':
        router.push('/admin/productsListing');
        break;
      case 'orderManagment':
        router.push('/admin/orderManagment');
        break;
      
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row justify-center">
      {/* Mobile menu toggle button */}
      <button 
        className="md:hidden absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
      
      <div className="relative">
        <div className="absolute w-12 h-12 overflow-hidden rounded-full left-[1310px] top-10">
          <Image
            src={akbar}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <h1 className="absolute text-white text-[13px] font-bold left-[1370px] top-14 whitespace-nowrap">Akbar Haleel</h1>
      </div>
      
      <div className="relative mr-[1460px] whitespace-nowrap">
        <h1 className="absolute text-white text-[22px] font-bold top-8 left-8 lg:left-0 xl:left-0">
          Care Point
        </h1>
      </div>
      
      {/* Navigation Menu */}
      <div className={`absolute bg-white px-[30px] py-[14px] top-20 rounded-full flex flex-row gap-4 md:gap-16 animate__animated animate__jackInTheBox ${isMenuOpen ? 'block w-full md:w-auto px-4 md:px-[80px] py-4 md:py-[15px] bg-white' : 'hidden'} md:flex items-center justify-center`}>
   
        <div 
          className={`px-8 py-2 rounded-full ${currentPage === 'users' ? 'bg-blue-500' : 'bg-violet-600'}`}
          onClick={() => handleNavigation('users')}
        >
          <h1 className="text-[13px] text-white">Users</h1>
        </div>
        <div 
          className={`px-8 py-2 rounded-full ${currentPage === 'doctors' ? 'bg-blue-500' : 'bg-violet-600'}`}
          onClick={() => handleNavigation('doctors')}
        >
          <h1 className="text-[13px] text-white">Doctors</h1>
        </div>
        <div 
          className={`px-8 py-2 rounded-full ${currentPage === 'productsListing' ? 'bg-blue-500' : 'bg-violet-600'}`}
          onClick={() => handleNavigation('productsListing')}
        >
          <h1 className="text-[13px] text-white">Products</h1>
        </div>
        <div 
          className={`px-8 py-2 rounded-full ${currentPage === 'orderManagment' ? 'bg-blue-500' : 'bg-violet-600'}`}
          onClick={() => handleNavigation('orderManagment')}
        >
          <h1 className="text-[13px] text-white">Order Managment</h1>
        </div>

      </div>
    </div>
  );
};

export default CustomHeader;
