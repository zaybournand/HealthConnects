import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Send logout request and include credentials (cookies)
        await axios.get("http://127.0.0.1:5000/logout", {
          withCredentials: true
        });

        // Clear auth-related data (in case token is used too)
        localStorage.removeItem("authToken");

        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

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

