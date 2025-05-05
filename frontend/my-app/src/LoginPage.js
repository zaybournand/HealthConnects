import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const logInUser = () => {
        if (email.length === 0) {
            alert("Email has been left blank!");
        } else if (password.length === 0) {
            alert("Password has been left blank!");
        } else {
            axios.post('http://127.0.0.1:5000/login', {
                email: email,
                password: password
            })
            .then(response => {
                console.log(response);
                navigate("/");
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    alert("Invalid credentials");
                }
            });
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5",
        }}>
            <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "400px",
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Log Into Your Account</h2>
                <form>
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
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
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={logInUser}
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
                        Login
                    </button>
                    <p style={{
                        textAlign: "center",
                        marginTop: "1rem",
                        fontSize: "0.9rem",
                        color: "#555",
                    }}>
                        Don't have an account? <a href="/register" style={{ color: "#007bff" }}>Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
