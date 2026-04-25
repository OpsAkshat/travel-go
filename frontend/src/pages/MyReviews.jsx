import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './MyReviews.css';

const MyReviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${API_URL}/reviews/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Since the backend might not return package titles, map standard properties
          setReviews(data.map(r => ({
            id: r.id,
            packageId: r.package_id,
            rating: r.rating,
            text: r.review_text,
            title: `Review for Package #${r.package_id}`,
            name: 'Me' 
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [navigate]);

  return (
    <div className="my-reviews-page">
      <HeroHeader />

      <div className="container my-reviews-container">
        <h1 className="page-title">My Reviews</h1>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>You haven't written any reviews yet.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(rev => (
              <div 
                className="review-card" 
                key={rev.id} 
                onClick={() => navigate(`/package/${rev.packageId}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h4 className="review-title">{rev.title}</h4>
                <p className="review-text">{rev.text}</p>
                <div className="review-footer">
                  <span className="reviewer-name">{rev.name}</span>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill={s <= rev.rating ? "#FDE047" : "#E5E7EB"} color={s <= rev.rating ? "#FDE047" : "#E5E7EB"} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyReviews;
