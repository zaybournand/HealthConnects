import React, { useState, useEffect } from "react";
import './BrowseOpportunities.css';

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/opportunities", {
          credentials: "include" // needed if your backend requires login
        });
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        setOpportunities(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) =>
    (opp.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (opp.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (opp.location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (opp.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse-container">
      <h2 className="browse-title">Browse Opportunities</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search opportunities..."
        className="search-input"
      />

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        <ul className="opportunities-list">
          {filteredOpportunities.map((opp) => (
            <li key={opp.id} className="opportunity-item">
              <h3 className="opportunity-title">{opp.title}</h3>
              <p className="opportunity-description">{opp.description}</p>
              <p className="opportunity-location">
                <strong>Location:</strong> {opp.location}
              </p>
              <p className="opportunity-email">
                <strong>Contact:</strong>{" "}
                <a
                  href={`mailto:${opp.email}?subject=Interested in ${encodeURIComponent(opp.title)}`}
                  className="email-link"
                >
                  {opp.email}
                </a>
              </p>
            </li>
          ))}

          {filteredOpportunities.length === 0 && (
            <p className="no-results">No opportunities found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default BrowseOpportunities;
