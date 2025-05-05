import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Added name state
    const [userType, setUserType] = useState('Professional'); // Default to "Professional"
    const [error, setError] = useState("");  // To capture error messages
    const navigate = useNavigate();

    const registerUser = () => {
        if (!email || !password || !name) {
            setError("Name, email, and password are required.");
            return;
        }

        // Make the API request
        axios.post('http://127.0.0.1:5000/signup', {
            name: name, // Send name to backend
            email: email,
            password: password,
            userType: userType
        })
        .then(response => {
            console.log(response);
            // Store user data in localStorage
            localStorage.setItem('userName', name);  // Save name
            localStorage.setItem('userEmail', email);  // Save email
            localStorage.setItem('userRole', userType);  // Save role
            navigate("/");
        })
        .catch(error => {
            console.error(error);
            if (error.response && error.response.status === 409) {
                setError("Email already exists. Please use a different email.");
            } else {
                setError("An error occurred. Please try again.");
            }
        });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
            <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "400px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Your Account</h2>
                <form>
                    {/* Name field */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Other fields */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            placeholder="Enter a valid email address"
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            placeholder="Enter password"
                        />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="userType" style={{ display: "block", marginBottom: "0.5rem" }}>User Type</label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}
                        >
                            <option value="Professional">Professional</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>
                    {error && (
                        <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
                            {error}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={registerUser}
                        style={{ width: "100%", padding: "0.75rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
                    >
                        Sign Up
                    </button>
                    <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
                        Already have an account? <a href="/login" style={{ color: "#007bff" }}>Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
