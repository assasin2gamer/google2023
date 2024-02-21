import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { auth, db } from '../login/firebase-config'; // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';

const containerStyle = {
  width: '800px',
  height: '400px',
  borderRadius: '20px',
  overflow: 'hidden',
  margin: 'auto'
};

const libraries = ['places'];
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
};

export const Console = () => {
  const [center, setCenter] = useState({lat: 40.712776, lng: -74.005974});
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ",
    libraries: ["places"],
  });

  useEffect(() => {

    
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (docSnap.data().coordinates =! null) {
            console.log((userData.coordinates['lat']));
            setCenter({ lat: (docSnap.data().coordinates['lat']), lng: (docSnap.data().coordinates['lng']) });
          } else {
            console.log("Latitude or longitude not found in document.");
          }
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User not logged in.");
      }
      setIsLoading(false); // Data fetched, loading complete
    };

    fetchUserData();
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || isLoading) return <div>Loading...</div>; // Check isLoading state

  return (
    <div style={{ marginTop: '10vh', width: '100%' }}>
      {center && ( // Ensure center is not null
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          {/* Markers and InfoWindow here */}
        </GoogleMap>
      )}
    </div>
  );
};
