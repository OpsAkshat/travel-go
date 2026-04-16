import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        navigate('/packages');
      } else {
        setError(data.detail || 'Login failed');
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
            <h1 className="auth-title">Log In</h1>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

              <div className="form-group">
                <label>user name</label>
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
              
              <div className="checkbox-group">
                <input type="checkbox" id="remember" defaultChecked />
                <label htmlFor="remember">Remember me</label>
              </div>

              <p className="auth-terms">
                By continuing, you agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy.</a>
              </p>

              <p className="auth-switch" style={{ textAlign: "center", marginBottom: "16px", fontSize: "14px" }}>
                Don't have an account? <Link to="/signup" style={{ color: "#FDE047", fontWeight: "600" }}>Sign Up</Link>
              </p>

              <button type="submit" className="auth-submit-btn">
                Log in
              </button>

              <div className="auth-bottom-links">
                <a href="#" className="forgot-password">Forget your password</a>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
