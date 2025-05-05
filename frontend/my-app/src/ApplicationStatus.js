import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ApplicationStatus() {
  const { id } = useParams(); // Get the 'id' from the URL
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the current application status
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/application_status/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch application status');
        }
        const data = await response.json();
        setStatus(data.status); // Set the fetched status
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/application_status/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), // Send the new status
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // If successful, redirect to a different page (e.g., View Applications)
      navigate(`/view-applications/${id}`);
    } catch (err) {
      setError(err.message); // Display error if it happens
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="application-status">
      <h2>Application Status</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="status">Current Status: </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
}

export default ApplicationStatus;
