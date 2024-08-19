'use client';

import React from 'react';

const DateFilterDropdown = ({ isOpen, toggleDropdown }: any) => {
  return (
    <div className="relative inline-block text-left mt-10">
      <button
        onClick={toggleDropdown}
        className="relative bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-2 px-4 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(66,153,225,0.6)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        <span className="relative z-10">Date Filter</span>
        <svg className="w-5 h-5 inline-block ml-2 transform transition-transform duration-300 ease-in-out hover:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-50 blur-md rounded-full z-0"></div>
      </button>
      <div
        className={`absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${isOpen ? 'block' : 'hidden'} transition-opacity duration-200 ease-in-out`}
      >
        <div className="px-4 py-2">
          <label className="block text-gray-700 text-sm font-medium">Start Date</label>
          <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="px-4 py-2">
          <label className="block text-gray-700 text-sm font-medium">End Date</label>
          <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>
    </div>
  );
};

export default DateFilterDropdown;
