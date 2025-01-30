import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ApplyPage() {
  const { id } = useParams(); // Get the opportunity ID from the URL
  const [resume, setResume] = useState(null);
  const [whyApply, setWhyApply] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!whyApply || !resume) {
      setError("Please provide a reason and upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("whyApply", whyApply);
    formData.append("additionalInfo", additionalInfo);
    formData.append("opportunityId", id); // Using the opportunity ID from the URL

    try {
      // Send application to the server
      const response = await axios.post("/api/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 200) {
        navigate("/confirmation"); // Redirect to a confirmation page after successful submission
      } else {
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error applying for opportunity: ", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "500px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Apply for Opportunity</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="whyApply" style={{ display: "block", marginBottom: "0.5rem" }}>Why do you want to apply?</label>
            <textarea
              id="whyApply"
              value={whyApply}
              onChange={(e) => setWhyApply(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="Explain why you're interested in this opportunity"
              rows="4"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="resume" style={{ display: "block", marginBottom: "0.5rem" }}>Upload Your Resume</label>
            <input
              type="file"
              id="resume"
              onChange={handleResumeChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="additionalInfo" style={{ display: "block", marginBottom: "0.5rem" }}>Additional Information</label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="Provide any additional information (optional)"
              rows="4"
            />
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
