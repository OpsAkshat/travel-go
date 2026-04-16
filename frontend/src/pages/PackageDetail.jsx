import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Tag, ChevronLeft, ChevronRight, Plus, Minus, CheckCircle2, XCircle } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './PackageDetail.css';



const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pkg, setPkg] = useState(null);
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const res = await fetch(`http://localhost:8000/packages/${id}`);
        if(res.ok) {
          const data = await res.json();
          setPkg(data);
        }
        const reviewRes = await fetch(`http://localhost:8000/reviews/${id}/`);
        if(reviewRes.ok) {
          const rData = await reviewRes.json();
          setReviews(rData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPkg(false);
      }
    };
    fetchPkg();
  }, [id]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [travellers, setTravellers] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calendar State
  const [calDate, setCalDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDateObj, setSelectedDateObj] = useState(new Date(2026, 10, 17));
  const [selectedDateStr, setSelectedDateStr] = useState('17 Nov 2026');

  // Review states
  const [reviewIdx, setReviewIdx] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');

  // Reset states if id changes (just in case)
  useEffect(() => {
    setActiveImgIndex(0);
    setIsModalOpen(false);
  }, [id]);

  if (loadingPkg) {
    return (
      <div className="package-detail-page">
        <HeroHeader />
        <div className="container" style={{ padding: '100px 24px', textAlign: 'center', minHeight: '50vh' }}>
          <h2>Loading Package...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="package-detail-page">
        <HeroHeader />
        <div className="container" style={{ padding: '100px 24px', textAlign: 'center', minHeight: '50vh' }}>
          <h2>Package not available</h2>
          <p style={{ marginTop: '16px', color: '#666' }}>We are currently adding more packages. Please check back later.</p>
          <Link to="/packages" className="book-btn" style={{ display: 'inline-block', marginTop: '24px', width: 'auto' }}>Go back to Packages</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const openModal = () => {
    // Check if user is authenticated via dummy token or real token
    const token = localStorage.getItem('token');
    
    // For testing purposes during deployment, if token is not found, redirect to login page.
    if (!token) {
      alert("Please Log In to book a package.");
      navigate('/login');
      return;
    }

    setIsModalOpen(true);
    setModalStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goStep2 = () => {
    setModalStep(2);
  };

  // Calendar Helpers
  const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
  const emptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Make Monday first

  const handlePrevMonth = () => {
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(calDate.getFullYear(), calDate.getMonth(), day);
    setSelectedDateObj(newDate);
    
    // Format to Display String
    const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setSelectedDateStr(formatter.format(newDate));
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calDate);

  const taxes = 200;
  const subtotal = pkg.price * travellers;
  const totalAmount = subtotal + taxes;

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setIsProcessing(true);

    try {
      // 0. Create Booking first
      const bookingResponse = await fetch('http://localhost:8000/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          package_id: parseInt(id),
          travel_date: selectedDateObj.toISOString().split('T')[0],
          num_adults: travellers
        })
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking.");
      }
      const bookingData = await bookingResponse.json();
      const newBookingId = bookingData.id;

      // 1. Create order on the backend
      const orderResponse = await fetch('http://localhost:8000/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ booking_id: newBookingId })
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order. Backend might be down.");
      }

      const orderData = await orderResponse.json();

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount_in_paise,
        currency: orderData.currency,
        name: "TRAVEL GO",
        description: `Booking: ${pkg.title}`,
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyResponse = await fetch('http://localhost:8000/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert('Payment Successful!');
            closeModal();
            navigate('/bookings'); // Redirect to bookings
          } else {
            alert('Payment Failed Verification!');
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#FDE047"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert('An error occurred during payment initiation. ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextReview = () => {
    if (reviews.length > 0) {
      setReviewIdx((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (reviews.length > 0) {
      setReviewIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    }
  };

  const handleReviewSubmit = async () => {
    if(!reviewText.trim()) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please Log In to write a review.");
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          package_id: parseInt(id),
          rating: 5,
          review_text: reviewText
        })
      });

      if (res.ok) {
        const newRev = await res.json();
        setReviews([...reviews, newRev]);
        alert("Review submitted successfully!");
        setIsReviewModalOpen(false);
        setReviewText('');
        setReviewIdx(reviews.length); 
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="package-detail-page">
      <HeroHeader />

      <div className="container detail-content">
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-left">
            <div className="image-slider">
              <img src={pkg.images?.[activeImgIndex] || pkg.images?.[0]} alt={pkg.title} className="main-image" />
              <div className="slider-dots">
                {(pkg.images || []).map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`dot ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="package-info-block">
              <div className="info-row">
                <span className="price-bold">${pkg.price} per person</span>
                <span className="divider-line"></span>
                <span className="tag-info"><Tag size={14} /> {pkg.category}</span>
                <span className="duration-info">{pkg.duration} Days / {pkg.duration - 1} Nights</span>
              </div>
              
              <h2 className="detail-title">{pkg.title}</h2>
              
              <div className="stars-row">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FDE047" color="#FDE047" />)}
              </div>
              
              <p className="detail-desc">{pkg.description || pkg.desc}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="detail-right">
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="section-block">
                <h3>Itinerary</h3>
                <div className="itinerary-list">
                  {pkg.itinerary.map((it, i) => (
                    <div key={i} className="itinerary-item">
                      <div className="itinerary-day">{it.day || `Day ${i + 1}`}</div>
                      <div className="itinerary-desc">{it.desc || it}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section-block">
              <h3>Inclusions</h3>
              <ul className="list-items list-with-icons">
                {(pkg.inclusions || []).map((inc, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} color="#10B981" /> {inc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="section-block">
              <h3>Exclusions</h3>
              <ul className="list-items list-with-icons">
                {(pkg.exclusions || []).map((exc, i) => (
                  <li key={i}>
                    <XCircle size={18} color="#EF4444" /> {exc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="action-buttons">
              <div className="main-actions">
                <button className="book-btn" onClick={openModal}>Book Now &rarr;</button>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', flex: 1 }}>
                  <button className="wishlist-btn" style={{ width: '100%' }} onClick={async () => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      alert("Please login to add to wishlist");
                      navigate('/login');
                      return;
                    }
                    try {
                      const res = await fetch(`http://localhost:8000/wishlist/${id}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      if (res.ok) {
                        const popup = document.createElement('div');
                        popup.innerHTML = "Added to wishlist!";
                        popup.style.position = 'absolute';
                        popup.style.bottom = '110%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translateX(-50%)';
                        popup.style.background = '#10B981';
                        popup.style.color = '#fff';
                        popup.style.padding = '8px 16px';
                        popup.style.borderRadius = '4px';
                        popup.style.fontSize = '14px';
                        popup.style.fontWeight = '500';
                        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                        popup.style.whiteSpace = 'nowrap';
                        popup.style.animation = 'fadeInOut 2s ease forwards';
                        popup.style.zIndex = '100';
                        
                        const btn = document.getElementById('wishlist-btn-target');
                        if(btn) {
                          btn.appendChild(popup);
                          setTimeout(() => {
                            if (popup.parentElement) popup.parentElement.removeChild(popup);
                          }, 2000);
                        }
                      } else {
                        const errData = await res.json();
                        alert(errData.detail || "Failed to add to wishlist");
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }} id="wishlist-btn-target">
                    Add To Wishlist
                  </button>
                  <style>{`
                    @keyframes fadeInOut {
                      0% { opacity: 0; transform: translate(-50%, 10px); }
                      15% { opacity: 1; transform: translate(-50%, 0); }
                      85% { opacity: 1; transform: translate(-50%, 0); }
                      100% { opacity: 0; transform: translate(-50%, -10px); }
                    }
                  `}</style>
                </div>
              </div>
              <Link to="/contact" style={{ display: 'block', textDecoration: 'none' }}>
                <button className="enquire-btn" style={{ width: '100%' }}>Enquire &rarr;</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="container">
          <div className="reviews-header">
            <h2>What Our Travelers Say</h2>
            <p>Hear from our travelers about their unforgettable journeys and experiences.</p>
          </div>
          
          <div className="reviews-carousel" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {reviews.length > 0 ? (
              <>
                <button 
                  onClick={prevReview} 
                  style={{
                    position: 'absolute', left: 0, zIndex: 2, background: '#fff', border: '1px solid #eee', 
                    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                  <ChevronLeft size={20} />
                </button>

                <div className="review-card" style={{ maxWidth: '600px', width: '100%', margin: '0 50px' }}>
                  <div className="avatar-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <h4 className="review-title">Review</h4>
                  <p className="review-text">{reviews[reviewIdx]?.comment || "No comment"}</p>
                  <div className="review-footer">
                    <span className="reviewer-name">{reviews[reviewIdx]?.user?.username || reviews[reviewIdx]?.user?.name || "Anonymous User"}</span>
                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < (reviews[reviewIdx]?.rating || 5) ? "#FDE047" : "transparent"} color="#FDE047" />
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={nextReview} 
                  style={{
                    position: 'absolute', right: 0, zIndex: 2, background: '#fff', border: '1px solid #eee', 
                    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                  <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <p>No reviews yet. Be the first to leave a review!</p>
            )}
          </div>

          <div className="add-review" style={{ marginTop: '30px' }}>
            <button className="add-review-btn" onClick={() => setIsReviewModalOpen(true)}>Add a review &rarr;</button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalStep === 1 ? (
              <div className="step1-content">
                <p className="step-label">STEP 1 OF 2</p>
                
                <div className="step1-grid">
                  <div className="left-step1">
                    <div className="selector-group">
                      <h2>Select Travellers</h2>
                      <p>Select the number of people joining this trip</p>
                    </div>

                    <div className="selector-group date-group">
                      <h2>Select Date</h2>
                      <p>Pick your preferred travel date</p>
                    </div>
                  </div>
                  
                  <div className="right-step1">
                    <div className="counter-box">
                      <button onClick={() => setTravellers(Math.max(1, travellers - 1))}><Minus size={18} /></button>
                      <span>{travellers}</span>
                      <button onClick={() => setTravellers(travellers + 1)}><Plus size={18} /></button>
                    </div>

                    {/* Interactive Calendar */}
                    <div className="mock-calendar">
                      <div className="calendar-header">
                        <span>{monthName}</span>
                        <div className="cal-nav">
                          <ChevronLeft size={16} style={{cursor: 'pointer'}} onClick={handlePrevMonth} /> 
                          <ChevronRight size={16} style={{cursor: 'pointer'}} onClick={handleNextMonth} />
                        </div>
                      </div>
                      <div className="calendar-grid">
                        <div className="day-name">M</div><div className="day-name">T</div><div className="day-name">W</div><div className="day-name">T</div><div className="day-name">F</div><div className="day-name">S</div><div className="day-name">S</div>
                        
                        {Array.from({ length: emptyDays }).map((_, i) => (
                          <div key={`empty-${i}`} className="day empty"></div>
                        ))}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const currentDay = i + 1;
                          const isSelected = selectedDateObj.getDate() === currentDay && 
                                             selectedDateObj.getMonth() === calDate.getMonth() && 
                                             selectedDateObj.getFullYear() === calDate.getFullYear();
                          
                          return (
                            <div 
                              key={currentDay} 
                              className={`day ${isSelected ? 'highlighted' : 'selectable'}`}
                              onClick={() => handleDateSelect(currentDay)}
                            >
                              {currentDay}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions-bottom">
                   <button className="book-btn step-btn" onClick={goStep2}>Next</button>
                   <button className="cancel-btn step-btn" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="step2-content">
                <p className="step-label">STEP 2 OF 2</p>
                <h2 className="summary-title">Travellers Summary</h2>
                
                <div className="summary-details">
                  <div className="summary-row"><span className="sum-label">Travellers:</span> <span className="sum-val">{travellers} Adults</span></div>
                  <div className="summary-row"><span className="sum-label">Travel Date:</span> <span className="sum-val">{selectedDateStr}</span></div>
                  <div className="summary-row"><span className="sum-label">Package:</span> <span className="sum-val">{pkg.title}</span></div>
                  <div className="summary-row"><span className="sum-label">Duration:</span> <span className="sum-val">{pkg.duration}</span></div>
                </div>

                <h2 className="summary-title">Price Breakdown</h2>
                
                <div className="price-details">
                  <div className="summary-row"><span className="sum-label">Price per person:</span> <span className="sum-val">${pkg.price}</span></div>
                  <div className="summary-row"><span className="sum-label">Travellers:</span> <span className="sum-val">{travellers}</span></div>
                  <div className="space-y"></div>
                  <div className="summary-row"><span className="sum-label">Subtotal:</span> <span className="sum-val">${subtotal}</span></div>
                  <div className="summary-row"><span className="sum-label">Taxes & Fees:</span> <span className="sum-val">${taxes}</span></div>
                  <div className="divider-hr"></div>
                  <div className="summary-row total-row"><span className="sum-label">Total Amount:</span> <span className="sum-val">${totalAmount}</span></div>
                </div>

                <div className="modal-actions-right">
                  <button className="book-btn" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now \u2192'}
                  </button>
                  <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isReviewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Write a Review</h2>
              <XCircle size={24} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsReviewModalOpen(false)} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Your Review</label>
              <textarea 
                rows="5"
                placeholder="Share your experience spanning the trip..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', 
                  fontSize: '14px', fontFamily: 'inherit', resize: 'none'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                style={{ padding: '10px 20px', border: '1px solid #ccc', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleReviewSubmit}
                style={{ padding: '10px 20px', border: 'none', background: '#FDE047', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetail;
