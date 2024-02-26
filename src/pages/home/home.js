import React, { useState, useEffect, useRef } from 'react';
import './home.css'; // Ensure your CSS file is correctly linked
import gsap from 'gsap';
import logo from '../../photos/logo.png';

export const Home = () => {
  const [isPhone, setIsPhone] = useState(window.innerWidth < 1233);
  const bannerRef = useRef(null);
  const contactBtnRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth < 1233);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Animations with GSAP
    gsap.fromTo('.logo', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
    gsap.fromTo(bannerRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.5 });
    gsap.fromTo(contactBtnRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 1 });
  }, []);

  return (
    <div className="home-wrapper">
      <img src={logo} alt="logo" className="logo" />

      {isPhone && (
        <div >
        </div>
      )}

      <div className="content">
        <div className={`container ${isPhone ? 'phone-container' : ''}`}>
          <div className="line top"></div>
          <div className="text" ref={bannerRef}>
            <section id="banner">
              <div className="inner" style={{marginTop:'200px'}}>
                <h2>Sur Chain</h2>
                <p>Crowd-sourced supply chain for good</p>
              </div>
            </section>
          </div>
          <div className="line bottom"></div>
        </div>
        <div className="contact-button">
          <button ref={contactBtnRef}>Contact Us</button>
        </div>
      </div>
    </div>
  );
};
