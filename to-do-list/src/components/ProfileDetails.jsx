import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import defaultProfilePic from "../assets/profile.jpg";

const ProfileDetails = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [editedFname, setEditedFname] = useState("");
  const [editedLname, setEditedLname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      setEditedFname(userData.firstName || "");
      setEditedLname(userData.lastName || "");
    } catch (error) {
      setErrorMessage("Error fetching user profile");
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setErrorMessage("No token found. Please log in.");
      return;
    }
  
    try {
      const updatedData = {
        firstName: editedFname,
        lastName: editedLname,
      };
  
      const response = await axios.patch("http://localhost:3000/api/users/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Profile updated successfully:", response.data);
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      setErrorMessage("");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile details:", error.response?.data || error.message);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:5173/login";
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No token found. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await axios.post(
        "http://localhost:3000/api/users/profile/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile picture uploaded successfully!");
      
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile picture:", error.response?.data || error.message);
      setErrorMessage("Failed to upload profile picture. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <div className="header">
        <h1 className="title">
          <Link to="/todo" style={{ textDecoration: "none", color: "black" }}>
            {user?.firstName ? `${user.firstName}'s Todo List` : "Todo List"}
          </Link>
        </h1>

        <div className="profile-container">
          <img
            src={user?.profilePicture || defaultProfilePic}
            alt="Profile"
            className="profile-pic"
            onClick={() => setShowProfile(!showProfile)}
          />
          {showProfile && (
            <div className="profile-popup">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Full Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p
                className="clickable-text"
                onClick={() => navigate("/profile")}
              >
                Profile Details
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pd-profile-container">
        <h2>Profile Details</h2>
        <img
          src={user?.profilePicture || defaultProfilePic}
          alt="Profile"
          className="pd-profile-pic"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ marginTop: "20px" }}>
          <label>First Name:</label>
          <input
            type="text"
            value={editedFname}
            onChange={(e) => setEditedFname(e.target.value)}
            className="profile-input"
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <label>Last Name:</label>
          <input
            type="text"
            value={editedLname}
            onChange={(e) => setEditedLname(e.target.value)}
            className="profile-input"
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <label>Upload Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="profile-input"
          />
        </div>
        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;