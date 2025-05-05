import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [bio, setBio] = useState('');  // Optional bio field
    const [resume, setResume] = useState(null);  // State for resume file

    useEffect(() => {
        // Fetch user data from localStorage
        const savedName = localStorage.getItem('userName');
        const savedEmail = localStorage.getItem('userEmail');
        const savedRole = localStorage.getItem('userRole');
        const savedBio = localStorage.getItem('userBio');
        const savedResume = localStorage.getItem('userResume');

        // If saved data exists, set it to state
        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
        if (savedRole) setRole(savedRole);
        if (savedBio) setBio(savedBio);
        if (savedResume) setResume(savedResume);  // Assuming you store the resume as a URL or base64 string
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Save the updated profile information to localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userBio', bio);

        // For the resume, if you want to store a URL or base64, save it accordingly
        if (resume) {
            localStorage.setItem('userResume', resume.name);  // Or resume URL or base64 data
        }

        setIsEditing(false);  // Exit editing mode after saving
    };

    const handleResumeChange = (e) => {
        setResume(e.target.files[0]);  // Update the resume state with the selected file
    };

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            <div className="profile-info">
                <div className="profile-item">
                    <label htmlFor="name">Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <span>{name}</span>
                    )}
                </div>
                <div className="profile-item">
                    <label htmlFor="email">Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <span>{email}</span>
                    )}
                </div>
                <div className="profile-item">
                    <label htmlFor="role">Role:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    ) : (
                        <span>{role}</span>
                    )}
                </div>
                <div className="profile-item">
                    <label htmlFor="bio">Bio:</label>
                    {isEditing ? (
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    ) : (
                        <span>{bio}</span>
                    )}
                </div>
                {/* Resume Upload Section */}
  
            </div>
            <button
                className="edit-btn"
                onClick={isEditing ? handleSaveClick : handleEditClick}
            >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>
    );
}

export default ProfilePage;
