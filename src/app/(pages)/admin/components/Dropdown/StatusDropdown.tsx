'use client';

import React from 'react';

const StatusDropdown = ({ isOpen, toggleDropdown }: any) => {
  return (
    <div className="relative inline-block text-left mt-10">
      <button
        onClick={toggleDropdown}
        className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-500 ease-in-out transform hover:scale-110 hover:-translate-y-1"
      >
        Status
        <svg className="w-5 h-5 inline-block ml-2 transition-transform duration-500 ease-in-out transform hover:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${isOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`}
      >
        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Block</a>
        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Unblock</a>
      </div>
    </div>
  );
};

export default StatusDropdown;
