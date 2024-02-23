import React, { useState } from 'react';
import { GoogleMap, DirectionsRenderer, DirectionsService, LoadScript } from '@react-google-maps/api';
import { useAuth } from '../login/AuthContext'; // Adjust the import path as necessary

export const Mapper = () => {
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const mapContainerStyle = {
        width: '800px',
        height: '400px',
    };

    const center = {
        lat: 40.712776,
        lng: -74.005974,
    };

    const calculateRoute = () => {
        const directionsService = new window.google.maps.DirectionsService();

        const origin = 'Start Location'; // Replace with your start location
        const destination = 'End Location'; // Replace with your end location

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
            >
                {directionsResponse && (
                    <DirectionsRenderer
                        directions={directionsResponse}
                    />
                )}
            </GoogleMap>
            <button onClick={calculateRoute}>Calculate Route</button>
        </LoadScript>
    );
};

