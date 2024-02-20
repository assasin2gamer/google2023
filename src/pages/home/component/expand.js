import React, { useState } from 'react';
import './expand.css';
import localight from '../../../photos/localight.png';

import amazon from '../../../photos/amazon-orange.jpg';
import cpp from '../../../photos/cpp.png';
function ExpandableCard({ imageSrc, description }) {
    const [expand, setExpand] = useState(false);
    const [expand2, setExpand2] = useState(false);
    const [expand3, setExpand3] = useState(false);
    const [expand4, setExpand4] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', left: '20px', paddingTop: '', backgroundColor: 'white', height: '100px', width: expand ? '900px' : '500px', borderTopRightRadius: '10px', opacity: expand ? '90%' : '100%', transition: 'width .5s' }}
         onClick={() => setExpand(!expand)}>
        <div style={{ display: 'flex' }}>
          <img style={{ objectFit: 'cover', borderRadius: '20px', left: '40px', position: 'relative', height: '60px', paddingTop: '25px' }} src={localight} alt='beach'></img>
          <div style={{ backgroundColor: '', position: 'relative', left: '60px', width: expand ? '500px' : '10px', height: '90px', opacity: expand ? '100%' : '0%', transition: 'opacity .2s, width .5s', overflow: 'clip' }}>
            Software Engineering intern working on project mockups, website design changes and backend routing in dyjango and reactjs.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', left: '20px', backgroundColor: '#ff9300', height: '100px', width: expand2 ? '900px' : '500px', opacity: expand2 ? '90%' : '100%', transition: 'width .5s' }}
        onClick={() => setExpand2(!expand2)}>

        <img style={{ objectFit: 'cover', borderRadius: '20px', left: '40px', position: 'relative', width: '200px' }} src={amazon} alt='beach'></img>
        <div style={{ backgroundColor: '', position: 'relative', left: '60px', width: expand2 ? '500px' : '10px', height: '90px', opacity: expand2 ? '100%' : '0%', transition: 'opacity .2s, width .8s', overflow: 'clip' }}>
          Software Engineering intern working on the Supply Chain Optimization SIO Team. High load scaling and optimization for the Amazon Supply Chain.
        </div>
      </div>
      <div style={{ display: 'flex', left: '20px', backgroundColor: 'grey', height: '100px', width: expand4 ? '900px' : '500px', opacity: expand4 ? '90%' : '100%', transition: 'width .5s' }}
        onClick={() => setExpand4(!expand4)}>

        <div style={{ objectFit: 'cover', borderRadius: '20px', left: '40px', position: 'relative', width: '200px', fontSize: '30px' }}>Gauge Consulting </div>
        <div style={{ backgroundColor: '', position: 'relative', left: '60px', width: expand4 ? '500px' : '10px', height: '90px', opacity: expand4 ? '100%' : '0%', transition: 'opacity .2s, width .8s', overflow: 'clip' }}>
          Lead software engineer for small team for cashierless store system and inventory optimization.
        </div>
      </div>
      <div style={{ display: 'flex', left: '20px', paddingTop: '', height: '100px', backgroundColor: 'white', width: expand3 ? '900px' : '500px', borderBottomRightRadius: '50px', opacity: expand3 ? '90%' : '100%', transition: 'width .5s, borderBottomRightRadius 10s' }}
        onClick={() => setExpand3(!expand3)}>

        <img style={{ objectFit: 'cover', borderRadius: '20px', left: '40px', position: 'relative', width: '200px', backgroundColor: 'white' }} src={cpp} alt='beach'></img>
        <div style={{ backgroundColor: '', position: 'relative', left: '60px', width: expand3 ? '500px' : '10px', height: '90px', opacity: expand3 ? '100%' : '0%', transition: 'opacity .2s, width .8s', overflow: 'clip' }}>
          Research assistant under Professor Mohammad Husain. Working on brainwave analysis for authentication with machine learning.
        </div>
      </div>
    </div>
  );
}

export default ExpandableCard;