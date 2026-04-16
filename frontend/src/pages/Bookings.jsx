import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Bookings.css';

const Bookings = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to see bookings");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/bookings/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  return (
    <div className="bookings-page">
      <HeroHeader />

      <div className="container bookings-container">
        <h1 className="page-title">My Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>You have no bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const isExpanded = expandedId === booking.id;
              
              return (
                <div className={`booking-wrapper ${isExpanded ? 'expanded' : ''}`} key={booking.id}>
                  <div className="booking-card" onClick={() => toggleExpand(booking.id)}>
                    <div className="booking-content" style={{marginLeft: '20px'}}>
                      <div className="booking-header">
                        <span className="booking-id">Booking ID: BK-{booking.id}</span>
                        <span className={`booking-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                      </div>
                      
                      <h3 className="booking-title">Package ID: {booking.package_id}</h3>
                      
                      <div className="booking-meta">
                         <div className="meta-item">
                           <span className="meta-label">Travel Date:</span>
                           <span className="meta-value">{new Date(booking.travel_date).toLocaleDateString()}</span>
                         </div>
                         <div className="meta-item">
                           <span className="meta-label">Adults:</span>
                           <span className="meta-value">{booking.num_adults}</span>
                         </div>
                      </div>
                    </div>

                    <div className="booking-right">
                      <div className="booking-price">${booking.total_price}</div>
                      <button className="btn-view-details">
                        {isExpanded ? 'Close Summary' : 'View Summary'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="booking-summary-expanded">
                       <p>Total Paid: ${booking.total_price}</p>
                       <p>Status: {booking.status}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Bookings;
