import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth'; // Import signOut
import { auth, googleAuthProvider } from '../login/firebase-config.js';


export const Account = () => {
    const logout = async () => {
        try {
            await signOut(auth); // Sign out the current user
            console.log('User signed out successfully');
            // Update UI or redirect to login page here
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    

  return (
    <div style={{ width: '100%', marginTop:'10vh'}}>
    <button onClick={logout} style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginLeft: '10px', // To space it out from the sign-in button
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
                Logout
            </button>
    </div>
  );
};