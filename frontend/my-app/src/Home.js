import React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate(); 

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
      <h1 >HealthConnect</h1>


      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>HealthConnect</h1>
        <p>Connecting healthcare professionals with students for real-world experience</p>
        <button className="cta-button" onClick={() => navigate('/browseOpportunities')}>
          Get Started
        </button>
      </section>

      {/* About Section */}
      <section className="about">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><h2>About the Project</h2></div>
        
        <p>
          HealthConnect is a platform designed to help healthcare students connect with professionals
          to gain essential volunteer experience and certifications required for their programs.
        </p>
        <p>Here's how it works:</p>
        <ol>
          <li>Sign up as a student or healthcare professional.</li>
          <li>Browse or post volunteer opportunities and certifications.</li>
          <li>Apply for opportunities and track your volunteer hours.</li>
        </ol>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', listStyleType: 'none', paddingLeft: 0 }}>
    <li>✅ Easy registration for both students and healthcare professionals</li>
    <li>✅ Search and apply for relevant opportunities</li>
    <li>✅ Track your volunteer hours and certifications</li>
  </ul>

      </section>

      {/* Footer Section */}
      <footer>
        <p><div style={{ color: 'black' }}>Contact us:</div>
        <a href="mailto:zaybournand@gmail.com">zaybournand@gmail.com</a></p>
        <a href="https://github.com/zaybournand?tab=repositories">
          <img src="/githubpic.png" alt="GitHub" />
        </a>
      </footer>
    </div>
  );
}

export default HomePage;
