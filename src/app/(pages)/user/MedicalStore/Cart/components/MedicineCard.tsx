// components/MedicineCard.js

import React from 'react';

const MedicineCard = ({ medicine }:any) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src={medicine.image}
        alt={medicine.name}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{medicine.name}</h3>
        <p className="text-gray-600 mt-2">{medicine.description}</p>
        <div className="mt-4">
          <span className="text-gray-800 font-bold text-lg">${medicine.price}</span>
          <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
