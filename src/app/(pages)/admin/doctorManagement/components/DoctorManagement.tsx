

'use client'
import React, { useEffect, useState } from "react";
import StatusDropdown from "../../components/Dropdown/StatusDropdown";
import DateFilterDropdown from "../../components/Dropdown/DateFilterDropdown";
import ToggleButton from "../../components/ToggleButton/ToggleButton";
import Image from "next/image";
import Folder from "../../../../../../public/images/folder-icon.png";
import axiosInstance from "@/app/hooks/useApi";
import { Button, Modal } from 'antd';

interface Appointment {
  _id: string;
  doctor: string; // Doctor's ID
  users: User | null; // Include user details or null if not available
  appointmentDate: string; // Use string if the date is returned as ISO string
  appointmentTime: string;
  appointmentType: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string; // Use string if the date is returned as ISO string
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  isActive: boolean;
  lastVisit: string;
  licenseNumber: string;
  consultationTypes: string[];
  appointments?: Appointment[]; // Add this if you want to show appointments
}

const DoctorManagement: React.FC = () => {
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isDateFilterOpen, setDateFilterOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

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
        const response = await axiosInstance.get<{ values: User[] }>("/admin-service/getDoctorManagement");
        const appointmentsResponse = await axiosInstance.get<{ result: Appointment[] }>("/admin-service/doctorAppoinments");
        setAppointments(appointmentsResponse.data.result);
        setUsers(response.data.values);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setLoading(true);

    // Filter appointments for the selected user's doctor
    const filtered = appointments.filter(appointment => appointment.doctor === user._id);
    setFilteredAppointments(filtered);
console.log('filteredAppointments',filteredAppointments)
    setModalOpen(true);

    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

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

        <div className="mt-10 sm:mt-16">
          <div className="hidden sm:grid grid-cols-12 gap-8 text-white mb-6 px-4 sm:px-6 md:px-8 text-sm sm:text-base font-semibold">
            <h2 className="col-span-3">Name</h2>
            <h2 className="col-span-2 text-center ml-[49px]">License Number</h2>
            <h2 className="col-span-3 text-center ml-[35px]">Email</h2>
            <h2 className="col-span-1 text-center ml-[30px]">Contact</h2>
            <h2 className="col-span-1 text-center ml-[80px]">Status</h2>
            <h2 className="col-span-1 text-center ml-[105px]">Details</h2>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 sm:p-6 transition duration-300 hover:bg-opacity-20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                  <div className="col-span-3 flex items-center space-x-3">
                    <Image
                      src={Folder}
                      alt="Folder"
                      width={24}
                      height={24}
                      className="hidden sm:block"
                    />
                    <p className="text-white font-medium">Dr. 
                       {user.firstname} {user.lastname}
                    </p>
                  </div>
                  <p className="col-span-2 text-gray-300 text-center hidden sm:block ml-[50px]">
                    {user.licenseNumber}
                  </p>
                  <p className="col-span-3 text-gray-300 text-center hidden sm:block ml-[60px]">
                    {user.email}
                  </p>
                  <p className="col-span-1 text-gray-300 text-center ml-4">
                    {user.phonenumber}
                  </p>
                  <div className="col-span-1 flex justify-center ml-[106px]">
                    <ToggleButton email={user.email} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 ml-44 rounded text-sm"
                      onClick={() => handleViewClick(user)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={selectedUser ? `Details of ${selectedUser.firstname} ${selectedUser.lastname}` : "Loading..."}
        width={800} // Adjust the width as needed
        footer={
          <Button type="primary" onClick={() => setLoading(true)}>
            Reload
          </Button>
        }
        loading={loading}
        open={isModalOpen}
        onCancel={handleModalClose}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p><strong>Email:</strong> {selectedUser?.email}</p>
            <p><strong>Phone Number:</strong> {selectedUser?.phonenumber}</p>
            <p><strong>License Number:</strong> {selectedUser?.licenseNumber}</p>

            {/* Display appointments */}
            {filteredAppointments && filteredAppointments.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mt-4">Appointments</h3>
                <ul className="list-disc pl-5 mt-2">
                  {filteredAppointments.map((appointment) => (
                    <li key={appointment._id}>
                      <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                      <p><strong>Type:</strong> {appointment.appointmentType}</p>
                      <p><strong>Status:</strong> {appointment.status}</p>
                      <p><strong>Patient Name:</strong> {appointment.users?.firstname} {appointment.users?.lastname}</p>
                      <p><strong>Patient Email:</strong> {appointment.users?.email}</p>
                      <p><strong>Patient Phone Number:</strong> {appointment.users?.phonenumber}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No appointments available.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorManagement;
