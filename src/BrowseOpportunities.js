import React, { useState } from "react";
import './BrowseOpportunities.css'; // Import the CSS file for styling

const BrowseOpportunities = ({ opportunities }) => {
  const [applied, setApplied] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term

  const handleApply = (id) => {
    if (!applied.includes(id)) {
      setApplied([...applied, id]);
      alert("You have successfully applied!");
    }
  };

  // Filter opportunities based on the search term
  const filteredOpportunities = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse-container">
      <h2 className="browse-title">Browse Opportunities</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        placeholder="Search opportunities..."
        className="search-input"
      />
      <ul className="opportunities-list">
        {filteredOpportunities.map((opp) => (
          <li key={opp.id} className="opportunity-item">
            <h3 className="opportunity-title">{opp.title}</h3>
            <p className="opportunity-description">{opp.description}</p>
            <p className="opportunity-location">
              <strong>Location:</strong> {opp.location}
            </p>
            <button
              onClick={() => handleApply(opp.id)}
              disabled={applied.includes(opp.id)}
              className={`apply-button ${applied.includes(opp.id) ? "applied" : ""}`}
            >
              {applied.includes(opp.id) ? "Applied" : "Apply"}
            </button>
          </li>
        ))}
        {filteredOpportunities.length === 0 && (
          <p className="no-results">No opportunities found.</p>
        )}
      </ul>
    </div>
  );
};

export default BrowseOpportunities;
