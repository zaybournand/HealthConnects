import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation
import axios from 'axios'; // make sure axios is imported

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Make the request to the backend to log out the user
        await axios.get("http://127.0.0.1:5000/logout");
        
        // Clear the user's authentication data (token or session)
        localStorage.removeItem("authToken"); // Or use cookies if you store the token in cookies

        // Redirect to the login page after logout
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    // Call the handleLogout function when the component is mounted
    handleLogout();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>You have been logged out successfully!</h2>
      <p>Redirecting to login page...</p>
    </div>
  );
};

export default Logout;
