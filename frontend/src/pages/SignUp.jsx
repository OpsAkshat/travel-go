import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Auth.css'; // Shared CSS for both Auth pages

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/user/register2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          username: username,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Please Log in.");
        navigate('/login');
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Make sure backend is running.');
    }
  };

  return (
    <div className="page-container">
      <HeroHeader />
      
      <main className="auth-content">
        <div className="auth-left">
          <Link to="/" className="auth-logo">TRAVEL GO</Link>
        </div>
        
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Sign Up</h1>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
              
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  <button type="button" className="hide-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={14} /> : <EyeOff size={14} />} {showPassword ? 'Show' : 'Hide'}
                  </button>
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <p className="auth-terms">
                By creating an account, you agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
              </p>

              <p className="auth-switch" style={{ textAlign: "center", marginBottom: "16px", fontSize: "14px" }}>
                Already have an account? <Link to="/login" style={{ color: "#FDE047", fontWeight: "600" }}>Log in</Link>
              </p>

              <button type="submit" className="auth-submit-btn signup-btn-yellow">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
