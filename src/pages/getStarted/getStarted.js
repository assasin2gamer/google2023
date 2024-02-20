import React, { useState, useEffect } from 'react';
import { auth, db } from '../login/firebase-config'; // Make sure this path is correct
import { doc, setDoc } from 'firebase/firestore';
import "./getStarted.css";
const organizationTypes = ["Non-profit", "For-profit", "Educational", "Other"];
const hearAboutUsOptions = ["Internet", "Friend", "Advertisement", "Other"];
const activitiesOptions = ["Supply", "Transport", "Request", "More than the above"];

export const GetStarted = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: [],
        location: '',
        hearAboutUs: [],
        activities: [] // Add this line
    });
    const handleFormUpdate = (key, value, isValueArray) => {
        const updatedValue = isValueArray ? value.split(",").map((item) => item.trim()) : value;
        setFormData({
            ...formData,
            [key]: updatedValue,
        });
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
        // Assuming the user is already logged in and we can use their UID
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
            await setDoc(userDocRef, { ...formData }, { merge: true });
            console.log("Form data successfully saved to Firestore!");
        } catch (error) {
            console.error("Error saving form data: ", error);
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
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
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
                              <label style={{position:'absolute', left:'20px'}}>{addSpaceBeforeCapitalLetters(key.charAt(0).toUpperCase() + key.slice(1))}:</label>
                              <div style={{paddingTop:'40px'}}>
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
                        } else {
                          // For fields that are not arrays, generate text inputs
                          return (
                            <div key={key} style={{ margin: "10px 0" }}>
                              <label style={{ display: "block", marginBottom: "5px", position:'absolute', left:'20px'}}>{addSpaceBeforeCapitalLetters(key.charAt(0).toUpperCase() + key.slice(1))}:</label>
                              <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={(e) => handleInputChange(e)}
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop:'40px'}}
                              />
                            </div>
                          );
                        }
                      })}
                      <button type="button" onClick={submitForm} style={{ marginTop: "20px" }}>
                        Submit
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
                <div style={{position:'absolute', top:'0', right:'5px'}}> Step {step}</div>
            </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="step-content">
                        {renderStepContent(step)}
                    </div>
                    {step === 6 ?(
                    <div></div>):(<button type="button" onClick={handleNextStep}>
              {step === 6 ? '' : 'Next'}
            </button>)
}
                </form>
            </div>
        </div>

    );
};