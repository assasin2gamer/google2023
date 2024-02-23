import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { auth, db } from '../login/firebase-config'; // Adjust the path as needed
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink } from 'react-router-dom';

// Styles for the map container
const containerStyle = {
  width: '800px',
  height: '400px',
  borderRadius: '20px',
  overflow: 'hidden',
  margin: 'auto',
};

// Google Maps API options
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
};

export const Console = () => {
  const [center, setCenter] = useState({ lat: 40.712776, lng: -74.005974 });
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [stationMarker, setStation] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ",
    libraries: ['places'],
  });

  // Fetch user data and update center
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.coordinates) {
            setCenter(userData.coordinates);
          } else {
            console.log("Latitude or longitude not found in document.");
          }
        } else {
          console.log("No such document!");
        }
      } else {
        // User is signed out
        console.log("User not logged in.");
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        console.log("User not logged in.");
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.log("No such document!");
        setIsLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      if (userData.coordinates) {
        setCenter(userData.coordinates);
      } else {
        console.log("Latitude or longitude not found in document.");
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  // Fetch items to display as markers
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'Items'));
      
      const markersArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        position: doc.data().coordinates,
        label: doc.data().userAddress, // Adjust as needed
        icon: { // Assuming you have an iconUrl field
          url: doc.data().iconUrl,
          scaledSize: new window.google.maps.Size(50, 50)
        },
      }));
      console.log(markersArray);

      setMarkers(markersArray);
    };

    fetchItems();
  }, []);
  useEffect(() => {
    const fetchStations = async () => {
      const querySnapshot = await getDocs(collection(db, 'Stations'));

      const markersArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        position: doc.data().coordinates,
        label: doc.data().userAddress, // Adjust as needed
        icon: { // Assuming you have an iconUrl field
          url: doc.data().iconUrl,
          scaledSize: new window.google.maps.Size(50, 50)
        },
        
      }
      
      ));
      console.log(markersArray);
      setStation(markersArray);
    };

    fetchStations();
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || isLoading) return <div>Loading...</div>;

  return (
    <div style={{backgroundColor:'#5c6f24', height:'100vh', position:'absolute', width:'100%'}}>

    
    <div style={{ marginTop: '10vh', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={mapOptions}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
            label={""}
            icon={{url:"https://firebasestorage.googleapis.com/v0/b/surc-26fb4.appspot.com/o/box.png?alt=media&token=6e11177a-0f85-49e6-b78b-21e23e3b5ae6"}}
          />
        ))}

    {stationMarker.map(station => (
          <Marker
            key={station.id}
            position={station.position}
            onClick={() => setSelectedMarker(station)}
            label={""}
            icon={{url:"https://firebasestorage.googleapis.com/v0/b/surc-26fb4.appspot.com/o/house.png?alt=media&token=4fa451c1-281d-4798-a542-823d2641691b", scaledSize: new window.google.maps.Size(50, 50)}}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h2>{selectedMarker.label}</h2>
              {/* Additional content for the InfoWindow */}
              Hello
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
            <div>
                <NavLink to="/supplier" activeClassName="active-link" className="nav-link">
                 <div>Add Items</div>
                </NavLink>
            </div>
            <div>
                <NavLink to="/supplier" activeClassName="active-link" className="nav-link">
                 <div>Volunteer</div>
                </NavLink>
            </div>
    </div>
    </div>
  );
};
