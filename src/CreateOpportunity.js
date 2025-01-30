import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to redirect
import './CreateOpportunity.css';  // Import the CSS for styling

const CreateOpportunity = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');  // Retrieve the role from localStorage
    if (storedRole !== 'Professional') {
      setErrorMessage('Only professionals can create opportunities.');
      // Redirect to the home page or another page after showing the error message
      setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    }
  }, [navigate]);  // Add navigate as a dependency

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Creating a new opportunity object
    const newOpportunity = {
      id: Date.now(),  // Unique ID based on timestamp
      title,
      description,
      location,
    };

    // Pass the new opportunity to the parent component
    onAdd(newOpportunity);

    // Reset the form
    setTitle('');
    setDescription('');
    setLocation('');
  };

  return (
    <div className="create-container">
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>  // Display error message if the user is a student
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
            <button type="submit" className="create-button">Add Opportunity</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateOpportunity;
