import React from 'react';
import { auth, googleAuthProvider } from './firebase-config.js';
import { signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore

export const GoogleLog = () => {
    const db = getFirestore(); // Initialize Firestore

    const signInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;
  
        // Create or update the user record in Firestore
        const userRef = doc(db, 'users', user.uid); // Reference to the user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        }, { merge: true }); // Use merge to update or create without overwriting existing fields

        if (user.additionalUserInfo.isNewUser) {
          console.log('New user signed in');
        } else {
          console.log('Existing user signed in');
        }
  
        console.log('User document written with ID: ', user.uid);

        //

      } catch (error) {
        console.error('Error signing in with Google: ', error);
      }
    };
  
    return (
      <button onClick={signInWithGoogle} style={{
        backgroundColor: '#4285F4',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}>
        Sign in with Google
      </button>
    );
};
