import React from 'react';
import ReactDOM from 'react-dom/client';  // Update import
import './index.css';
import App from './App';

// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
