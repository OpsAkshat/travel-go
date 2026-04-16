import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Packages.css';

const HoverImageComponent = ({ images, title }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const safeImages = images || [];
    if (isHovered && safeImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIdx(prev => (prev + 1) % safeImages.length);
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentIdx(0); // Optional: reset on mouse leave
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, images.length]);

  return (
    <div 
      className="package-img" 
      style={{ overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={(images || [])[currentIdx] || ''} alt={title} style={{ transition: 'all 0.5s ease-in-out' }} />
    </div>
  );
};

const Packages = () => {
  const [filter, setFilter] = useState('International');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:8000/packages/');
        if (!response.ok) throw new Error('Failed to load packages');
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const filtered = packages.filter(p => p.category === filter);

  return (
    <div className="packages-page">
      <HeroHeader />

      <div className="container packages-container">
        <div className="packages-top-bar">
          <h2 className="packages-main-title">Packages</h2>
          <div className="packages-filter">
            <button 
              className={`filter-btn ${filter === 'International' ? 'active' : ''}`}
              onClick={() => setFilter('International')}
            >
              International
            </button>
            <button 
              className={`filter-btn ${filter === 'Domestic' ? 'active' : ''}`}
              onClick={() => setFilter('Domestic')}
            >
              Domestic
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading packages...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="packages-grid">
            {filtered.map(pkg => (
              <Link to={`/package/${pkg.id}`} className="package-card" key={pkg.id}>
                <HoverImageComponent images={pkg.images} title={pkg.title} />
                <div className="package-info">
                  <div className="package-price-tag">Starting at ${pkg.price} per person</div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-desc">{pkg.description || pkg.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Packages;
