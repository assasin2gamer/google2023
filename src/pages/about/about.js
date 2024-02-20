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

    <div style={{ width: '100%', position: 'absolute', paddingTop: '100px', alignContent: 'center', margin: 'auto', overflowY: 'hidden', height: '100%' }}>

      <div >
        <div style={{ position: 'absolute', backgroundColor: 'white', height: '100%', width: "60vw", top: '0px', left: '20vw', zIndex: '-1', opacity: phone ? 0 : '.4' }} />

        <h2 style={{ color: 'black' }}>
          About Me
        </h2>
        <div style={{ width: '45vw', margin: 'auto', textAlign:'left'}}>
          &emsp;&emsp;Hello! My name is Stephen Chang and I attend Cal Poly Pomona, majoring in Computer Science. My research is primarily on computational neuroscience, finding new ways of
          integrating new technologies and exploring feature/classification models. Through this research I founded a startup
          <a href="https://kerriganml.com/"> KerriganML </a> which focuses on consumer
          and low price EEG intergrations. Over the past few years, I have built up on of the largest highschool hackathon club in the nation and furthermore
          have been able to work at a variety of companies, from startups to fortune 500s. I am currently exploring research opportunities and returning at Amazon as a Software Engineer.
          <br /><br />
          &emsp;&emsp; At my current institution, I have displayed a high level of success. As a freshman, I achieved the distinction of being the first to lead an undergraduate senior design project. 
          Furthermore, as a sophomore, I made history by becoming the first student in a decade to represent our institution at HackMIT, in which I secured first place in our track, 
          Interactive Media—a first-ever in the Cal State system.
          <br/><br />

          &emsp;&emsp;Beyond the academic realm, I have invaluable experience through a highly selective internship at Amazon, 
          in which only 250 students in the United States and Canada were chosen for the Amazon Future Engineer program. 
          There, I worked on database optimizations on the scale of billions of requests per month and was chosen as a brand 
          ambassador for computer science programs provided by Amazon, continuing my work as an advocate for accessibility and 
          early exposure to concepts of programming and cybersecurity.  Futhermore, I previously interned at a startup during my 
          sophomore year of high school, as well as a position as a project manager at a consulting and management firm in my senior 
          year of high school.
          
        </div>


      </div>


    </div>
  );
};