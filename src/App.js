import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BrowseOpportunities from './BrowseOpportunities'; // Component for browsing opportunities
import CreateOpportunity from './CreateOpportunity'; // Component for creating opportunities
import ProfilePage from './ProfilePage'; // Profile Page component

import Logout from "./Logout";

import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome for icons

// Navigation Bar Component
function NavigationBar() {
  const navigate = useNavigate();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem', backgroundColor: '#007bff' }}>
      <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Home</button>
      <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Login</button>
      <button onClick={() => navigate('/register')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Register</button>
      <button onClick={() => navigate('/browseOpportunities')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Browse Opportunities</button>
      <button onClick={() => navigate('/create-opportunity')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Create Opportunity</button>
      <button onClick={() => navigate('/profile')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Profile</button>
     
      <button onClick={() => navigate('/logout')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
    </nav>
  );
}

// App Component
function App() {
  // State for storing opportunities
  const [opportunities, setOpportunities] = useState([
    { id: 1, title: "Blood Drive Volunteer", description: "Assist with organizing a blood drive event.", location: "New York, NY" },
    { id: 2, title: "Hospital Aid", description: "Help patients with non-medical tasks.", location: "Chicago, IL" },
    { id: 3, title: "Medical Camp Assistant", description: "Support doctors in a rural medical camp.", location: "Austin, TX" },
  ]);

  // Function to add a new opportunity
  const addOpportunity = (newOpportunity) => {
    setOpportunities([...opportunities, newOpportunity]);
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <NavigationBar />

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />  {/* Home page route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/browseOpportunities" element={<BrowseOpportunities opportunities={opportunities} />} />
          <Route path="/create-opportunity" element={<CreateOpportunity onAdd={addOpportunity} />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Profile Page Route */}
         
          <Route path="/logout" element={<Logout />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
