import React, { useEffect, useState } from 'react';
import './nav.css';

import { useAuth } from '../login/AuthContext'; // Adjust the import path as necessary

import { NavLink } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';

export const Nav = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const [isPhone, setPhone] = useState(false);

  const changeScreen = () => {
    if (window.innerWidth < 1233) {
      setPhone(true);
    }
    else {
      setPhone(false);
    }
  }

  window.addEventListener('resize', changeScreen);
  useEffect(() => {
    changeScreen();
    return () => {
      window.removeEventListener('resize', changeScreen);
    };
  });

  return (
    <div style={{ position: 'absolute', width: '100%', zIndex: '20', top: '40px'}}>
      <div style={{ width: '40vw', borderRadius: '20px', backgroundColor: isPhone ? ("transparent"):("rgba(255, 255, 255, 0.34)"), margin: 'auto', height: '40px' }}>
        <div className="menu-icon" onClick={() => setMenuOpen(!isMenuOpen)}>
          <AiOutlineMenu />
        </div>
        <nav className={`navbar ${isMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink exact to="/" activeClassName="active-link" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" activeClassName="active-link" className="nav-link">
            About
          </NavLink>
          <NavLink to="/console" activeClassName="active-link" className="nav-link">
            Console
          </NavLink>
          

        </nav>
      </div>
      {!currentUser ? (
        <NavLink style={{ position: 'fixed', right: '20px', top: '40px' }} to="/login" activeClassName="active-link" className="nav-link">
          Login
        </NavLink>) : (
        <div className="profile" style={{ position: 'fixed', right: '10px', top: '40px', display:'flex'}}>
          <img src={currentUser.photoURL} alt="User profile"  style={{borderRadius:'100%', borderColor:'black', borderStyle:'solid', height:'5vh', borderWidth:'1px', backgroundColor:'white'}}/>
          <NavLink to="/account" activeClassName="active-link" className="nav-link">

          <p style={{fontSize:'10px', paddingLeft:'10px'}}>{currentUser.displayName}</p>
          </NavLink>
        </div>
      )
      }

    </div>
  );
};
