'use client';

// import { useState, FormEvent, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '@/app/hooks/useApi';

// export default function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState<string | null>(null);
//   const router = useRouter();

//   // Ensure the component is mounted before using the router
//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const emailParam = queryParams.get('email');
//     setEmail(emailParam);
//   }, []);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }

//     if (!email) {
//       setError('Invalid email address');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post('/resetPassword',{ email, password })

//       console.log('responce is ', response);
//       if(response.status==200){
//       alert("password changed successfully")
//       router.push('/login')
//       }
      
//     } catch (err) {
//       console.error(err);
//       setError('An error occurred. Please try again later.');
//     }
//   };

//   if (!email) return null; // Render nothing until the email parameter is available

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Set New Password</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/hooks/useApi';
import MyModal from '@/app/components/headlessUi/modal'; // Adjust the import path as needed

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const router = useRouter();

  // Ensure the component is mounted before using the router
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get('email');
    setEmail(emailParam);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!email) {
      setError('Invalid email address');
      return;
    }

    try {
      const response = await axiosInstance.post('/resetPassword', { email, password });

      console.log('response is ', response);
      if (response.status === 200) {
        setIsModalOpen(true);
       
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    }
  };

  if (!email) return null; // Render nothing until the email parameter is available

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Set New Password</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
      </div>

      {/* Conditionally render the MyModal component */}
      {isModalOpen && <MyModal />}
    </div>
  );
}