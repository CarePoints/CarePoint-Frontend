"use client";

import React, { useEffect, useState } from "react";
import StatusDropdown from "../../components/Dropdown/StatusDropdown";
import DateFilterDropdown from "../../components/Dropdown/DateFilterDropdown";
import ToggleButton from "../../components/ToggleButton/ToggleButton";
import Image from "next/image";
import Folder from "../../../../../../public/images/folder-icon.png";
import axiosInstance from "@/app/hooks/useApi";

// Define TypeScript interface for user data
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  isActive: boolean;
  lastVisit: string;
}

const UserManagement: React.FC = () => {
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isDateFilterOpen, setDateFilterOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // State to store user data

  const toggleStatusDropdown = () => {
    setStatusOpen(!isStatusOpen);
    setDateFilterOpen(false);
  };

  const toggleDateFilterDropdown = () => {
    setDateFilterOpen(!isDateFilterOpen);
    setStatusOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<{ values: User[] }>('/admin-service/getUserManagement');
        setUsers(response.data.values); // Update state with user data
        console.log('user datas are', response.data.values); // Debug log
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mt-10 sm:mt-20 md:mt-24 lg:mt-32">
          <StatusDropdown
            isOpen={isStatusOpen}
            toggleDropdown={toggleStatusDropdown}
          />
          <DateFilterDropdown
            isOpen={isDateFilterOpen}
            toggleDropdown={toggleDateFilterDropdown}
          />
        </div>

        <div className="mt-10 sm:mt-16 ">
          <div className="grid grid-cols-5 gap-4 text-white  mb-6 px-4 sm:px-6 md:px-8 text-sm sm:text-base font-semibold">
            <h2 className="hidden sm:block text-center relative left-[20px]">Name</h2>
            <h2 className="text-center absolute right-[632px]">Email</h2>
            <h2 className="text-center absolute right-[380px]">Contact</h2>
            <h2 className="text-center absolute right-56">Status</h2>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id} // Use a unique key for each user
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 sm:p-6 transition duration-300 hover:bg-opacity-20"
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2 sm:col-span-1 flex items-center space-x-3">
                    <Image
                      src={Folder}
                      alt="Folder"
                      width={24}
                      height={24}
                      className="hidden sm:block"
                    />
                    <p className="text-white font-medium relative left-[55px]">{user.firstname} {user.lastname}</p>
                  </div>
                  <p className="hidden sm:block text-gray-300 text-center relative left-[360px]">{user.email}</p>
                  <p className="text-gray-300 text-center relative left-[360px]">{user.phonenumber}</p>
                  <div className="flex justify-center relative left-[270px]">
                  <ToggleButton email={user.email} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
