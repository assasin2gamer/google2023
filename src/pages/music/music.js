import React from 'react';
import './music.css';
import ReactPlayer from 'react-player';

export const Music = () => {
  return (
    <div className="music-container">
      <BackgroundImage />
      <Content />
    </div>
  );
};

const BackgroundImage = () => (
  <div className="background-image-container">
  </div>
);

const Content = () => (
  <div className="content">
    <LiveShows />
  </div>
);



const LiveShows = () => (
  <div>
    
  </div>
);



