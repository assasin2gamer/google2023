import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, db } from '../login/firebase-config'; // Make sure this path is correct
import { doc, setDoc } from 'firebase/firestore';
import { GoogleMap, DirectionsRenderer, DirectionsService, useLoadScript } from '@react-google-maps/api';

import "./getStarted.css";
import { NavLink } from 'react-router-dom';
const organizationTypes = ["Non-profit", "For-profit", "Educational", "Other"];
const hearAboutUsOptions = ["Internet", "Friend", "Advertisement", "Other"];
const activitiesOptions = ["Supply", "Transport", "Request", "More than the above"];

export const GetStarted = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [coord, setCoord] = useState(null);
    const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const autocompleteRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDuSLtaIOp1WGUrzVMJ4WHY14riF_oCaPQ",
        libraries: ["places"],
    });

    const autocompleteInputRef = useRef(null);


    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: [],
        address: address,
        coordinates: coord,
        hearAboutUs: [],
        activities: [] // Add this line
    });
    const handleFormUpdate = (key, value, isValueArray) => {
        const updatedValue = isValueArray ? value.split(",").map((item) => item.trim()) : value;
        setFormData({
            ...formData,
            [key]: updatedValue,
        });
        console.log(formData);
    };

    const handleCoords = (address) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                setFormData({
                    ...formData,
                    coordinates: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                    }
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
        formData.coordinates = coord;
        console.log("hanndle");
    };

    useEffect(() => {
        if (!isLoaded) return;

        autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    }, [isLoaded]);

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);

        if (value.length > 3 && autocompleteRef.current) {
            autocompleteRef.current.getPlacePredictions({ input: value }, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);

                } else {
                    setSuggestions([]);

                }
            });
        } else {
            setSuggestions([]);

        }

    };

    const handleSelectSuggestion = (suggestion) => {
        setAddress(suggestion.description);
        formData.address = suggestion.description;
        handleCoords(suggestion.description);
        setSuggestions([]);
        // You can also geocode the suggestion here if needed
    };


    const handleNextStep = () => {
        if (step < 6) setStep(step + 1); // Adjust this line to reflect the new total steps
        else submitForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        let newArray = [...formData[name], value];
        if (formData[name].includes(value)) {
            newArray = newArray.filter((item) => item !== value);
        }
        setFormData({
            ...formData,
            [name]: newArray,
        });
    };

    const submitForm = async () => {
        setIsSubmitting(true); // Indicate start of submission
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
            await setDoc(userDocRef, { ...formData }, { merge: true });
            console.log("Form data successfully saved to Firestore!");
        } catch (error) {
            console.error("Error saving form data: ", error);
            // Optionally, handle/display the error to the user here
        } finally {
            setIsSubmitting(false); // Reset submission state
            navigate('/console'); // Navigate after attempting submission
        }
    };
    
    function addSpaceBeforeCapitalLetters(inputString) {
        // Replace every capital letter with a space + the capital letter,
        // except if it's at the start of the string
        return inputString.replace(/(?<!^)([A-Z])/g, ' $1');
    }
    const renderStepContent = (step) => {

        switch (step) {
            case 1:
                return (
                    <input
                        type="text"
                        name="organizationName"
                        placeholder="Organization Name"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <div>
                        {organizationTypes.map((type, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    name="organizationType"
                                    value={type}
                                    checked={formData.organizationType.includes(type)}
                                    onChange={handleCheckboxChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                );
            case 3:
                return (
                    <div style={{}}>
                        <input
                            type="text"
                            value={address}
                            onChange={handleAddressChange}
                            placeholder="Start typing an address..."
                        />
                        {suggestions.length > 0 && (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.place_id}
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {suggestion.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            case 4: // Assuming this is now the step for the new question
                return (
                    <div>
                        {activitiesOptions.map((option, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    name="activities"
                                    value={option}
                                    checked={formData.activities.includes(option)}
                                    onChange={handleCheckboxChange}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );
            case 5:
                return (
                    <div>
                        {hearAboutUsOptions.map((option, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    name="hearAboutUs"
                                    value={option}
                                    checked={formData.hearAboutUs.includes(option)}
                                    onChange={handleCheckboxChange}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );

            default:
                return (
                    <div>
                        <div>Review and edit your information:</div>
                        {Object.keys(formData).map((key) => {
                            if (key === "editable") return null; // Skip the editable flag

                            const isValueArray = Array.isArray(formData[key]);
                            if (isValueArray) {
                                // For fields that are arrays, generate checkboxes
                                const options = key === "organizationType" ? organizationTypes :
                                    key === "hearAboutUs" ? hearAboutUsOptions :
                                        key === "activities" ? activitiesOptions : [];


                                return (
                                    <div key={key}>
                                        <label style={{ position: 'absolute', left: '20px' }}>{addSpaceBeforeCapitalLetters(key.charAt(0).toUpperCase() + key.slice(1))}:</label>
                                        <div style={{ paddingTop: '40px' }}>
                                            {options.map((option, index) => (
                                                <label key={index} style={{ display: "inline", marginBottom: "5px" }}>
                                                    <input
                                                        type="checkbox"
                                                        name={key}
                                                        value={option}
                                                        checked={formData[key].includes(option)}
                                                        onChange={(e) => handleCheckboxChange(e)}
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            if (key === "coordinates") {
                                // For the coordinates, display the lat and lng
                                if (formData[key] === null || formData[key] === undefined) {
                                    return (
                                        <div>Unusual Address detected</div>
                                    )
                                }
                                return (
                                    <div></div>
                                );
                            }
                            if (key === "address") {
                                return (

                                    <div style={{}}>
                                        <label style={{ display: "block", marginBottom: "5px", position: 'absolute', left: '20px' }}>{addSpaceBeforeCapitalLetters(key.charAt(0).toUpperCase() + key.slice(1))}:</label>

                                        <input
                                            type="text"
                                            value={address}
                                            onChange={handleAddressChange}
                                            placeholder="Start typing an address..."
                                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: '40px' }}

                                        />
                                        {suggestions.length > 0 && (
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {suggestions.map((suggestion) => (
                                                    <li
                                                        key={suggestion.place_id}
                                                        onClick={() => handleSelectSuggestion(suggestion)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {suggestion.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            }
                            else {
                                // For fields that are not arrays, generate text inputs
                                return (
                                    <div key={key} style={{ margin: "10px 0" }}>
                                        <label style={{ display: "block", marginBottom: "5px", position: 'absolute', left: '20px' }}>{addSpaceBeforeCapitalLetters(key.charAt(0).toUpperCase() + key.slice(1))}:</label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key]}
                                            onChange={(e) => handleInputChange(e)}
                                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: '40px' }}
                                        />
                                    </div>
                                );
                            }
                        })}
                        <button type="button" onClick={submitForm} disabled={isSubmitting} style={{ marginTop: "20px" }}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>

                    </div>
                );
        }
    };

    return (
        <div style={{ width: '100vw' }}>
            <div className="get-started-form" style={{ position: 'relative', top: '20vh', width: '50%', margin: 'auto' }}>
                <div>
                    <h1>Get Started</h1>
                    <div style={{ position: 'absolute', top: '0', right: '5px' }}> Step {step}</div>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="step-content">
                        {renderStepContent(step)}
                    </div>
                    {step === 6 ? (
                        <div></div>) : (<button type="button" onClick={handleNextStep}>
                            {step === 6 ? '' : 'Next'}
                        </button>)
                    }
                    
                </form>
            </div>
        </div>

    );
};