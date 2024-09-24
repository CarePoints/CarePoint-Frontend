import axiosInstance from '@/app/hooks/useApi';
import React, { useState, useEffect } from 'react';

interface ToggleButtonProps {
  email: string; 
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ email }) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Fetch the user's status from the backend when the component mounts
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        
        const response = await axiosInstance.get(`/admin-service/user-status/${email}`);
        setIsBlocked(response.data.isBlocked);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchUserStatus();
  }, [email]);

  // Function to handle button click
  const handleClick = async () => {
    const newStatus = !isBlocked;
    setIsBlocked(newStatus);
  
    try {
      const response = await axiosInstance.post('/admin-service/blockAndUnblock', {
        email, 
        isBlocked: newStatus,
      });
      // Ensure the state is updated based on the backend's response
      setIsBlocked(response.data.isBlocked);
      console.log('isBlocked',isBlocked);
      
    } catch (error) {
      console.error('Error updating user status:', error);
      setIsBlocked(!newStatus); // Revert the state if the request fails
    }
  };

  // Determine button color based on the state
  const buttonColor = isBlocked ? 'bg-red-500' : 'bg-green-500';
  const hoverColor = isBlocked ? 'hover:bg-red-600' : 'hover:bg-green-600';

  return (
    <button
      onClick={handleClick}
      className={`text-white py-2 px-4 rounded-full absolute ml-[370px] ${buttonColor} ${hoverColor}`}
    >
      {isBlocked ? 'Unblock' : 'Block'}
    </button>
  );
};

export default ToggleButton;
