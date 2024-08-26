"use client";

import React, { useEffect, useState } from "react";
import StatusDropdown from "../../components/Dropdown/StatusDropdown";
import DateFilterDropdown from "../../components/Dropdown/DateFilterDropdown";
import Image from "next/image";
// import Calendar from "@/public/images/folder-icon.png";
import axiosInstance from "@/app/hooks/useApi";

// Define TypeScript interfaces
interface Appointment {
  _id: string;
  userId: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

const AppointmentManagement: React.FC = () => {
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isDateFilterOpen, setDateFilterOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  const toggleStatusDropdown = () => {
    setStatusOpen(!isStatusOpen);
    setDateFilterOpen(false);
  };

  const toggleDateFilterDropdown = () => {
    setDateFilterOpen(!isDateFilterOpen);
    setStatusOpen(false);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get<{ appointments: Appointment[] }>('/admin-service/getAppointments');
        setAppointments(response.data.appointments);
        
        // Create an object to store unique userIds
        const uniqueUserIds: { [key: string]: boolean } = {};
        response.data.appointments.forEach(a => {
          uniqueUserIds[a.userId] = true;
        });
        
        // Convert the object keys to an array of userIds
        const userIds = Object.keys(uniqueUserIds);
        
        const userPromises = userIds.map(id => axiosInstance.get<User>(`/admin-service/getUser/${id}`));
        const userResponses = await Promise.all(userPromises);
        
        const userMap: { [key: string]: User } = {};
        userResponses.forEach(response => {
          const user = response.data;
          userMap[user._id] = user;
        });
        
        setUsers(userMap);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    };
  
    fetchAppointments();
  }, []);
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.userId]) {
      acc[appointment.userId] = [];
    }
    acc[appointment.userId].push(appointment);
    return acc;
  }, {} as { [key: string]: Appointment[] });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Appointment Management</h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <StatusDropdown isOpen={isStatusOpen} toggleDropdown={toggleStatusDropdown} />
          <DateFilterDropdown isOpen={isDateFilterOpen} toggleDropdown={toggleDateFilterDropdown} />
        </div>

        <div className="space-y-8">
          {Object.entries(groupedAppointments).map(([userId, userAppointments]) => (
            <div key={userId} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transition duration-300 hover:bg-opacity-20">
              <h2 className="text-xl font-semibold text-white mb-4">
                {users[userId] ? `${users[userId].firstname} ${users[userId].lastname}` : 'Loading...'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAppointments.map((appointment) => (
                  <div key={appointment._id} className="bg-gray-800 rounded-lg p-4 flex items-start space-x-3">
                    {/* <Image src={Calendar} alt="Calendar" width={24} height={24} className="mt-1" /> */}
                    <div>
                      <p className="text-white font-medium">{appointment.service}</p>
                      <p className="text-gray-400 text-sm">{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${
                        appointment.status === 'confirmed' ? 'bg-green-500 text-white' :
                        appointment.status === 'pending' ? 'bg-yellow-500 text-black' :
                        'bg-red-500 text-white'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;



// "use client";

// import React, { useEffect, useState } from "react";
// import StatusDropdown from "../../components/Dropdown/StatusDropdown";
// import DateFilterDropdown from "../../components/Dropdown/DateFilterDropdown";
// import ToggleButton from "../../components/ToggleButton/ToggleButton";
// import Image from "next/image";
// import Folder from "../../../../../../public/images/folder-icon.png";
// import axiosInstance from "@/app/hooks/useApi";

// // Define TypeScript interface for user data
// interface User {
//   _id: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   phonenumber: string;
//   isActive: boolean;
//   lastVisit: string;
// }

// const UserManagement: React.FC = () => {
//   const [isStatusOpen, setStatusOpen] = useState(false);
//   const [isDateFilterOpen, setDateFilterOpen] = useState(false);
//   const [users, setUsers] = useState<User[]>([]); // State to store user data

//   const toggleStatusDropdown = () => {
//     setStatusOpen(!isStatusOpen);
//     setDateFilterOpen(false);
//   };

//   const toggleDateFilterDropdown = () => {
//     setDateFilterOpen(!isDateFilterOpen);
//     setStatusOpen(false);
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axiosInstance.get<{ values: User[] }>('/admin-service/getUserManagement');
//         setUsers(response.data.values); // Update state with user data
//         console.log('user datas are', response.data.values); // Debug log
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-wrap justify-center gap-4 mt-10 sm:mt-20 md:mt-24 lg:mt-32">
//           <StatusDropdown
//             isOpen={isStatusOpen}
//             toggleDropdown={toggleStatusDropdown}
//           />
//           <DateFilterDropdown
//             isOpen={isDateFilterOpen}
//             toggleDropdown={toggleDateFilterDropdown}
//           />
//         </div>

//         <div className="mt-10 sm:mt-16 ">
//           <div className="grid grid-cols-5 gap-4 text-white  mb-6 px-4 sm:px-6 md:px-8 text-sm sm:text-base font-semibold">
//             <h2 className="hidden sm:block text-center relative left-[20px]">Name</h2>
//             <h2 className="text-center absolute right-[632px]">Email</h2>
//             <h2 className="text-center absolute right-[380px]">Contact</h2>
//             <h2 className="text-center absolute right-56">Status</h2>
//           </div>

//           <div className="space-y-4">
//             {users.map((user) => (
//               <div
//                 key={user._id} // Use a unique key for each user
//                 className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 sm:p-6 transition duration-300 hover:bg-opacity-20"
//               >
//                 <div className="grid grid-cols-5 gap-4 items-center">
//                   <div className="col-span-2 sm:col-span-1 flex items-center space-x-3">
//                     <Image
//                       src={Folder}
//                       alt="Folder"
//                       width={24}
//                       height={24}
//                       className="hidden sm:block"
//                     />
//                     <p className="text-white font-medium relative left-[55px]">{user.firstname} {user.lastname}</p>
//                   </div>
//                   <p className="hidden sm:block text-gray-300 text-center relative left-[360px]">{user.email}</p>
//                   <p className="text-gray-300 text-center relative left-[360px]">{user.phonenumber}</p>
//                   <div className="flex justify-center relative left-[270px]">
//                   <ToggleButton email={user.email} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
