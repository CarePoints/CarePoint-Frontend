import React from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X } from 'lucide-react';

export const NotificationModal = ({ isOpen, onClose, doctorName }: any) => {
  const router = useRouter();

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 relative overflow-hidden">
        <div className="bg-blue-500 p-4 text-white">
          <h2 className="text-2xl font-bold">Incoming Video Call</h2>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <Camera size={64} className="text-blue-500" />
          </div>
          <p className="text-center text-lg mb-6">
            Doctor is requesting a video call
          </p>
          <div className="flex justify-center space-x-4">
            <a href="http://localhost:3000/user/Appointments/camara">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Accept
            </button>
            </a>
            {/* <button 
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Decline
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};