import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Home.css';

import gallery1 from '../assets/gallery1.png';
import gallery2 from '../assets/gallery2.webp';
import gallery3 from '../assets/gallery3.jpg';
import gallery4 from '../assets/gallery4.webp';
import gallery5 from '../assets/gallery5.jpg';

const initialImages = [
  { id: 1, src: gallery1, alt: 'Golden Gate' },
  { id: 2, src: gallery2, alt: 'Venice' },
  { id: 3, src: gallery3, alt: 'Twelve Apostles' },
  { id: 4, src: gallery4, alt: 'Mountains' },
  { id: 5, src: gallery5, alt: 'Cinque Terre View' },
];

const Home = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState(initialImages);

  const nextSlide = () => {
    setImages(prev => {
      const newArr = [...prev];
      const first = newArr.shift();
      newArr.push(first);
      return newArr;
    });
  };

  const prevSlide = () => {
    setImages(prev => {
      const newArr = [...prev];
      const last = newArr.pop();
      newArr.unshift(last);
      return newArr;
    });
  };

  return (
    <div className="home-container">
      <HeroHeader />

      {/* Content Section below Hero */}
      <main className="content-section">
        <h1 className="main-heading">
          Your Ultimate Travel<br />Partner Awaits!
        </h1>
        <p className="sub-heading">
          We offer unforgettable journeys, unbeatable prices, expert<br />
          guides, and 24/7 support-making your travel dreams easy,<br />
          safe, and seamless.
        </p>

        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/packages')}>
            Your Trip <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/packages')}>
            Explore
          </button>
        </div>

        {/* Gallery Section */}
        <div className="gallery-wrapper">
          <button className="slider-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="gallery-section">
            {images.map((img, index) => (
              <div key={img.id} className={`gallery-item item-${index + 1}`}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>

          <button className="slider-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
