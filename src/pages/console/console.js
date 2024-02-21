import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { auth, db } from '../login/firebase-config';
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
    const [center, setCenter] = useState({ lat: 0, lng: 0 }); // Initial center set to 0,0
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState({});

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ",
        libraries: ["places"],
    });

    // Fetch user data and update center
    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("Document data:", userData);
                    if (userData.lat && userData.lng) {
                        setCenter({ lat: userData.lat, lng: userData.lng });
                    }
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserData();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    const onMapLoad = useCallback((map) => {
        // Map loaded callback
    }, []);

    const onUnmount = useCallback(() => {
        // Map unmounted callback
    }, []);

    const addMarker = (lat, lng, label) => {
        setMarkers(current => [...current, { lat, lng, label }]);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ marginTop: '10vh', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onMapLoad}
                options={mapOptions}
                onUnmount={onUnmount}
            >
                {/* Markers and InfoWindow */}
            </GoogleMap>
        </div>
    );
};
