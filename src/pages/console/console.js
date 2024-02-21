import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { NavLink } from 'react-router-dom';


export const Console = () => {


  return (
   <div style={{marginTop:'10vh'}}>
        <h1>Console</h1>

        <NavLink to='/supplier' style={{textDecoration:'none', color:'black'}}>
            <div style={{padding:'20px', border:'1px solid black', borderRadius:'5px', margin:'10px', width:'20%'}}>
                <div>Supplier</div>
            </div>
        </NavLink>
        <NavLink to='/request' style={{textDecoration:'none', color:'black'}}>
            <div style={{padding:'20px', border:'1px solid black', borderRadius:'5px', margin:'10px', width:'20%'}}>
                <div>Request</div>
            </div>
        </NavLink>
   </div>
  );
};