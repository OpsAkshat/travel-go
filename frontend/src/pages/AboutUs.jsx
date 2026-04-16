import React from 'react';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="page-container">
      <HeroHeader />
      
      <main className="about-content">
        <div className="about-left">
          <h1 className="about-title">Numbers That Define<br />Our Journey</h1>
          <p className="about-description">
            From dream vacations to real adventures,
            here's how we've helped travelers explore the
            world—one trip at a time.
          </p>
        </div>
        
        <div className="about-right">
          <div className="stats-grid">
            <div className="stat-item border-right border-bottom">
              <h3>300+</h3>
              <p>Trips Successfully Delivered</p>
            </div>
            <div className="stat-item border-bottom">
              <h3>97%</h3>
              <p>Happy Travelers</p>
            </div>
            <div className="stat-item border-right">
              <h3>40+</h3>
              <p>Expert Travel Planners</p>
            </div>
            <div className="stat-item">
              <h3>150+</h3>
              <p>Destinations Covered</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
