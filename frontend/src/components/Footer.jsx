import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-top">
          <div className="footer-links">
            <div className="footer-col">
              <h4>About us</h4>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="#">Branding</a></li>
                <li><a href="#">Newsroom</a></li>
                <li><a href="#">Partnerships</a></li>
                <li><a href="#">Affiliates</a></li>
                <li><a href="#">careers</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Help and support</h4>
              <ul>
                <li><a href="#">Help center</a></li>
                <li><a href="/contact">Contact us</a></li>
                <li><a href="#">Privacy & Terms</a></li>
                <li><a href="#">Safety information</a></li>
                <li><a href="#">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-apps">
            {/* Using text-based recreation of app store buttons for visual similarity */}
            <a href="#" className="app-btn">
               <svg viewBox="0 0 384 512" width="20" height="20" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <div className="app-btn-text">
                <span className="small">Download on the</span>
                <span className="large">App Store</span>
              </div>
            </a>
            <a href="#" className="app-btn">
               <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                 <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
               </svg>
              <div className="app-btn-text">
                <span className="small">GET IT ON</span>
                <span className="large">Google Play</span>
              </div>
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>@copyright 2022</span>
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          
          <div className="footer-bottom-right">
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
            <div className="language-selector">
              <span>English (united States)</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
