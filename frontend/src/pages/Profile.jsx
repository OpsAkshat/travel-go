import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Profile.css';

const Profile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/user/auth', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (profileImg) {
      localStorage.setItem(`profilePic_${user?.email}`, profileImg);
    }
    alert("Profile details saved successfully!");
  };

  // On auth load, fetch saved profile pic
  useEffect(() => {
    if (user && user.email) {
      const savedPic = localStorage.getItem(`profilePic_${user.email}`);
      if (savedPic) {
        setProfileImg(savedPic);
      }
    }
  }, [user]);

  if (loading) return <div>Loading Profile...</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <HeroHeader />

      <div className="container profile-container">
        <h1 className="page-title">My Profile ({user.username})</h1>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-image-upload">
              <div className="image-preview">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" />
                ) : (
                  <div className="placeholder-avatar">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                )}
              </div>
              <label htmlFor="upload-photo" className="upload-btn">
                Upload Photo
              </label>
              <input 
                type="file" 
                id="upload-photo" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden-input" 
              />
            </div>
          </div>

          <div className="profile-form-section">
            <form className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" defaultValue={user.username} disabled style={{background: '#f3f4f6'}} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="form-row border-top-row">
                <div className="form-group full-width">
                  <label>Date of Birth</label>
                  <input type="date" />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-save" onClick={handleSave}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
