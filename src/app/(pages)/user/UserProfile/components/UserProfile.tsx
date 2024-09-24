'use client'

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle } from 'lucide-react';

interface User {
  _id: string;
  createdAt: string;
  email: string;          
  firstname: string;      
  lastname: string;
  isBlocked: boolean;
  phonenumber: string;    
  profilePic: string | null;
  roles?: string; 
  isVerified?: boolean;
}
  
const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('parsedData', parsedData);
      const userDataObj = {
        _id: parsedData._id,
        createdAt: parsedData.createdAt,
        firstname: parsedData.firstname,
        lastname: parsedData.lastname,
        email: parsedData.email,
        isBlocked: parsedData.isBlocked,
        phonenumber: parsedData.phonenumber,
        profilePic: parsedData.profilePic,
        roles: parsedData.roles, 
        isVerified: parsedData.isVerified
      };
      setUser(userDataObj);
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="flex flex-col items-center">
          {user?.profilePic ? ( 
            <img
              src={user.profilePic}
              alt={`${user.firstname} ${user.lastname}`}
              className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 bg-gray-300 flex items-center justify-center">
              <User size={64} className="text-gray-600" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">{`${user?.firstname} ${user?.lastname}`}</h1>
          <p className="text-gray-600 mb-4">{user?.roles}</p>
          <div className="flex items-center text-gray-600 mb-4">
            {user?.isVerified ? (
              <CheckCircle size={18} className="mr-2 text-green-500" />
            ) : (
              <Shield size={18} className="mr-2 text-yellow-500" />
            )}
            <span>{user?.isVerified ? 'Verified User' : 'Unverified User'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />
              <span className="font-semibold">Email:</span>
            </div>
            <p className="text-gray-600 ml-7">{user?.email}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-semibold">Phone:</span>
            </div>
            <p className="text-gray-600 ml-7">{user?.phonenumber}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2" />
              <span>Joined: {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Shield size={18} className="mr-2" />
              <span>Account Status: {user?.isBlocked ? 'Blocked' : 'Active'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
