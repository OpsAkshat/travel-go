import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, MapPin, Heart, Star, MessageSquare } from 'lucide-react';
import './HeroHeader.css';

const searchData = [
  { term: 'Singapore', type: 'Country', link: '/package/singapore' },
  { term: 'Thailand', type: 'Country', link: '/package/thailand' },
  { term: 'Vietnam', type: 'Country', link: '/package/vietnam' },
  { term: 'Kerala', type: 'Place', link: '/package/kerala' },
  { term: 'Kashmir', type: 'Place', link: '/package/kashmir' },
  { term: 'Rajasthan', type: 'Place', link: '/package/rajasthan' },
  { term: '4 Nights 5 Days', type: 'Duration', link: '/package/singapore' },
  { term: 'Beach Packages', type: 'Category', link: '/packages' },
];

const HeroHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const filteredSearch = searchData.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (link) => {
    navigate(link);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <div className="hero-section">
      <nav className="navbar">
        <div className="nav-left">
          <div className="menu-container" ref={menuRef}>
            <Menu className="menu-icon" size={24} onClick={toggleMenu} style={{cursor: 'pointer'}} />
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="menu-dropdown">
                <div className="menu-section">
                  <h4>Account</h4>
                  <Link to="/profile" className="menu-item"><User size={16} /> Profile</Link>
                  <Link to="/bookings" className="menu-item"><MapPin size={16} /> Bookings</Link>
                  <Link to="/wishlist" className="menu-item"><Heart size={16} /> Wishlist</Link>
                  <Link to="/reviews" className="menu-item"><Star size={16} /> My Reviews</Link>
                </div>
                <div className="menu-section">
                  <h4>Support</h4>
                  <Link to="/contact" className="menu-item"><MessageSquare size={16} /> Help and Support</Link>
                </div>
              </div>
            )}
          </div>
          
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/packages" className="nav-link">Packages</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/wishlist" className="nav-link">Wishlist</Link>
          {!isAuthenticated ? (
            <Link to="/signup" className="nav-link">Login/Sign up</Link>
          ) : (
            <span className="nav-link" onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</span>
          )}
        </div>
        
        <div className="nav-center">
          <Link to="/" className="logo">TRAVEL GO</Link>
        </div>
        
        <div className="nav-right" ref={searchRef}>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search places or duration..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
            <Search className="search-icon" size={18} />
            
            {showSearchDropdown && searchQuery && (
              <div className="search-dropdown">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="search-result-item" 
                      onClick={() => handleSearchSelect(item.link)}
                    >
                      <span className="search-term">{item.term}</span>
                      <span className="search-type">{item.type}</span>
                    </div>
                  ))
                ) : (
                  <div className="search-no-result">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeroHeader;
