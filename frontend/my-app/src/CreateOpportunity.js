import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOpportunity.css';

const CreateOpportunity = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole !== 'Professional') {
      setErrorMessage('Only professionals can create opportunities.');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOpportunity = {
      title,
      description,
      location,
      email,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Send cookies (auth session)
        body: JSON.stringify(newOpportunity)
      });

      if (response.ok) {
        alert('✅ Opportunity created successfully!');
        // Clear the form
        setTitle('');
        setDescription('');
        setLocation('');
        setEmail('');
        navigate('/browseOpportunities'); // Redirect to browse
      } else {
        const data = await response.json();
        alert(`❌ Failed to create opportunity: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
      alert("❌ An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-container">
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : (
        <>
          <h2 className="create-title">Create Opportunity</h2>
          <form onSubmit={handleSubmit} className="create-form">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Title"
              required 
              className="create-input"
            />
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Description"
              required 
              className="create-textarea"
            />
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Location"
              required 
              className="create-input"
            />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email"
              required 
              className="create-input"
            />
            <button type="submit" className="create-button">Add Opportunity</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateOpportunity;
