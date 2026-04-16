import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/wishlist/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const listItems = await res.json();
          // Fetch package details for each wishlist item
          const detailedWishlist = await Promise.all(
            listItems.map(async (item) => {
              const pkgRes = await fetch(`http://localhost:8000/packages/${item.package_id}`);
              if (pkgRes.ok) {
                const pkgData = await pkgRes.json();
                return {
                  id: item.package_id, // Important: Use package_id for links/deletions instead of wishlist id
                  title: pkgData.title,
                  location: pkgData.destination || "Various",
                  price: pkgData.price,
                  stars: 4,
                  img: (pkgData.images && pkgData.images.length > 0) ? pkgData.images[0] : ''
                }
              }
              return null;
            })
          );
          setWishlist(detailedWishlist.filter(Boolean));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]);

  const handleDelete = async (e, packageId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/wishlist/${packageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setWishlist(wishlist.filter(item => item.id !== packageId));
      } else {
        alert("Failed to delete item from wishlist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="wishlist-page">
      <HeroHeader />

      <div className="container wishlist-container">
        <h1 className="wishlist-heading">Wishlist</h1>

        {loading ? (
          <p>Loading your wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="empty-state">
            <p>Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(item => (
              <div 
                className="wishlist-card" 
                key={item.id} 
                onClick={() => navigate(`/package/${item.id}`)}
              >
                <div className="wishlist-img">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="wishlist-info">
                  <div className="wishlist-header">
                    <h3 className="wishlist-title">{item.title}</h3>
                    <p className="wishlist-meta">{item.location} &mdash; ${item.price}</p>
                    <div className="wishlist-stars">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} fill={s <= item.stars ? "#FDE047" : "#E5E7EB"} color={s <= item.stars ? "#FDE047" : "#E5E7EB"} />
                      ))}
                    </div>
                  </div>
                  <div className="wishlist-actions">
                    <button className="btn-delete" onClick={(e) => handleDelete(e, item.id)}>Remove</button>
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

export default Wishlist;
