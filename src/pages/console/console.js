import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { auth, db } from '../login/firebase-config';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink, json } from 'react-router-dom';
import { SleekTable } from './components/table';

export const Console = () => {
  const containerStyle = {
    width: '50vw',
    height: '60vh',
    marginLeft: '5vw',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    overflow: 'hidden',
    margin: 'auto',
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [
      {
        featureType: 'poi',   // Disable points of interest labels
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'transit',  // Disable transit labels
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'road',   // Simplify road labels
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        featureType: 'road',   // Simplify road geometry
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { lightness: 100 }
        ]
      },
      // Add more styles as needed to further customize the map appearance
    ]
  };


  const [center, setCenter] = useState({ lat: 40.712776, lng: -74.005974 });
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [polylines, setPolylines] = useState([]); // This will store google.maps.Polyline objects
  const [openInfoWindow, setOpenInfoWindow] = useState({ id: null, type: null });
  const [routes, setRoutes] = useState([]); // This will store google.maps.DirectionsResult objects
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [stationMarkers, setStationMarkers] = useState([]);
  const [polylinePath, setPolylinePath] = useState([]);
  const [activeTab, setActiveTab] = useState('Tab1');
  const [transport, setTransport] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ",
    libraries: ['places'],
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCenter(userDocSnap.data().coordinates || center);
        }
      }
      setIsLoading(false);
    });
  }, []);



  useEffect(() => {
    const fetchMarkers = async () => {
      const itemsSnapshot = await getDocs(collection(db, 'Items'));
      const itemsMarkers = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        position: doc.data().coordinates,
        pickupTimeRange: doc.data().pickupTimeRange,
        icon: { url: "https://firebasestorage.googleapis.com/v0/b/surc-26fb4.appspot.com/o/box.png?alt=media&token=6e11177a-0f85-49e6-b78b-21e23e3b5ae6", scaledSize: new window.google.maps.Size(50, 50) },
      }));

      const stationsSnapshot = await getDocs(collection(db, 'Stations'));
      const stationsMarkers = stationsSnapshot.docs.map(doc => ({
        id: doc.id,
        position: doc.data().coordinates,
        address: doc.data().address,
        icon: { url: "https://firebasestorage.googleapis.com/v0/b/surc-26fb4.appspot.com/o/house.png?alt=media&token=4fa451c1-281d-4798-a542-823d2641691b", scaledSize: new window.google.maps.Size(50, 50) },
        request: doc.data().request,
      }));

      const routeReq = await getDocs(collection(db, 'Routes'));
      const routesList = routeReq.docs.map(doc => ({
        start_position: doc.data().start,
        end_position: doc.data().end,
      }));
      console.log(routesList);
      setRoutes(routesList);
      setMarkers(itemsMarkers);
      setStationMarkers(stationsMarkers);
    };



    if (isLoaded) {
      fetchMarkers();
    }
  }, [isLoaded]);


  const showRoutes = async () => {
    if (!isLoaded || !mapRef.current) return;
  
    const directionsService = new window.google.maps.DirectionsService();
    let newPolylines = [];
  
    for (let i = 0; i < routes.length; i++) {
      const routelist = routes[i];
      console.log(routelist);
      try {
        const result = await new Promise((resolve, reject) => {
          const start_position = JSON.parse(JSON.stringify(routelist.start_position));
          const end_position = JSON.parse(JSON.stringify(routelist.end_position));
          
          directionsService.route({
            origin: start_position,
            destination: end_position,
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === "OK") {
              resolve(result);
            } else {
              reject(`Failed to fetch directions: ${status}`);
            }
          });
        });
        let gradientcolorsnoblacks = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE'];
        // Create and add the polyline for the current route
        //make color random
        const polyline = new window.google.maps.Polyline({
          path: result.routes[0].overview_path,
          strokeColor: gradientcolorsnoblacks[i % gradientcolorsnoblacks.length],
          strokeOpacity: 1,
          strokeWeight: 4,
        });
        polyline.setMap(mapRef.current); // Set the polyline on the map
        newPolylines.push(polyline);
      } catch (error) {
        console.error(error);
      }
    }
  
    // Set the new polylines to state
    setTransport(newPolylines);
  };


  const clearPolylines = () => {
    polylines.forEach(polyline => polyline.setMap(null)); // Remove each polyline from the map
    setPolylines([]); // Reset the polyline state
  };

  const handleStationClick = async (stationId) => {
    if (!isLoaded || !mapRef.current) return;

    clearPolylines(); // Clear existing polylines

    const station = stationMarkers.find(station => station.id === stationId);
    if (!station || !station.request || station.request.length === 0) return;

    const directionsService = new window.google.maps.DirectionsService();
    let newPolylines = [];

    for (let itemId of station.request) {
      const item = markers.find(marker => marker.id === itemId);
      if (item) {
        try {
          const result = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: station.position,
              destination: item.position,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
              if (status === "OK") {
                resolve(result);
              } else {
                reject(`Failed to fetch directions: ${status}`);
              }
            });
          });

          // Create and add the polyline for the current route
          const polyline = new window.google.maps.Polyline({
            path: result.routes[0].overview_path,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 5,
          });
          polyline.setMap(mapRef.current); // Set the polyline on the map
          newPolylines.push(polyline);
        } catch (error) {
          console.error(error);
        }
      }
    }

    setPolylines(newPolylines);
  };

  // onLoad callback for GoogleMap to capture the map instance
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (isLoading || !isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#5c6f24', height: '100vh', width: '100%', position: 'absolute', top: '0' }}>
      <div>


        <div style={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginLeft: '16%' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              options={mapOptions}
              onLoad={onLoad}
            >{markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={marker.icon}
              >
                {openInfoWindow.id === marker.id && openInfoWindow.type === 'item' && (
                  <InfoWindow onCloseClick={() => setOpenInfoWindow({ id: null, type: null })}>
                    <div>
                      <h2>Item Description</h2>
                      <p>{/* Item's description here */}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
              {stationMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={marker.icon}
                  onClick={() => handleStationClick(marker.id)}
                >
                  {openInfoWindow.id === marker.id && openInfoWindow.type === 'station' && (
                    <InfoWindow onCloseClick={() => setOpenInfoWindow({ id: null, type: null })}>
                      <div>
                        <h2>Station Location</h2>
                        <p>{marker.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}

              {transport.map((route, index) => (
                <Polyline
                  key={index}
                  path={[route.start_position, route.end_position]} // Assuming start and end position is an array of latLng objects
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                  }}
                />
              ))}
            </GoogleMap>

          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'left' }}> {/* This div centers the SleekTable */}
            <SleekTable stations={stationMarkers} items={markers} style={{ width: '100%' }} />
          </div>
          <div>
            <button
              onClick={() => showRoutes()}>

            </button>
          </div>

          {/* NavLink components */}
        </div>
      </div>
    </div>
  );
};