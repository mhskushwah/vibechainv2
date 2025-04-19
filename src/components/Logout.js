import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  useEffect(() => {
    // Perform logout functionality here (e.g., clearing session, localStorage, etc.)
    localStorage.removeItem('user'); // Example: Remove user data from localStorage

    // Redirect to home page after logout
    navigate('/'); // Navigating to home page
  }, [navigate]); // 'navigate' is a dependency here

  return (
    <div>
      <h2>Logging out...</h2>
      {/* You can display a loading message if needed */}
    </div>
  );
};

export default Logout;
