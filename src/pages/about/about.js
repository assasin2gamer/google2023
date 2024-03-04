import React, { useState, useEffect } from 'react';
import './about.css'

export const About = () => {
  const [phone, setPhone] = useState(false);

  const changeScreen = () => {
    if (window.innerWidth < 1233) {
      setPhone(true);
    }
    else {
      setPhone(false);
    }
  }


  useEffect(() => {
    window.addEventListener('resize', changeScreen);
    changeScreen();
    return () => {
      window.removeEventListener('resize', changeScreen);
    };
  }, []);
  return (

    <div style={{ width: '100%', position: 'absolute', paddingTop: '100px', alignContent: 'center', margin: 'auto', overflowY: 'hidden', height: '100%', backgroundColor:'#5c6f24'}}>

    

    </div>
  );
};