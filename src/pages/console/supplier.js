import React, { useState, useEffect, createRef } from 'react';

import { v4 as uuidv4 } from 'uuid';
import "./supplier.css"
import { auth, db } from '../login/firebase-config'; // Adjust path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { create } from '@mui/material/styles/createTransitions';
import { json } from 'react-router-dom';


export const Supplier = () => {
    const [items, setItems] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [mustTakeAll, setMustTakeAll] = useState(false);
    const [perishables, setPerishables] = useState(false);
    const [udata, setUdata] = useState({});
    

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid); // Replace 'user_id' with the actual user ID
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
        setUdata(docSnap.data());
        console.log("Document data:", JSON.stringify(docSnap.data()));
        } else {
        console.log("No such document!");
        }
        return docSnap.data();
    };
    
        

    const addItem = () => {
        const newItem = { id: uuidv4(), name: '', image: null, isFood: false, price: 0 };
        setItems([...items, newItem]);
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setItems(updatedItems);
        setPerishables(!hasPerishables());
    };

    const hasPerishables = () => {
        return items.some((item) => item.isFood);
    };

    const handleImageChange = (e, id) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            updateItem(id, 'image', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(auth.currentUser);
        console.log(udata.address + " " + udata.coordinates)
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous'; // Fallback if not logged in
        const userAddress = auth.currentUser ? udata.address: 'anonymous'; // Fallback if not logged in
        const coordinates = auth.currentUser ? udata.coordinates: 'anonymous'; // Fallback if not logged in
        const org = auth.currentUser ? udata.organizationName: 'anonymous'; // Fallback if not logged in

        const formData = {
            org,
            userId, // Include the user's ID
            userAddress,
            coordinates,
            items,
            pickupDate,
            perishables,
            mustTakeAll,
        };

        function filterNumbersAndStrings(input) {
            const regex = /^[0-9a-zA-Z]+$/;
            return input.replace(/[^0-9a-zA-Z]/g, '');
        }
       
        let currentDateTime =  new Date().toLocaleString()
        let itemID = currentDateTime + "-" + userId

    
        // Log data for debugging purposes
        console.log(JSON.stringify(formData, null, 2));
        const itemRef = doc(db,"Items", filterNumbersAndStrings(itemID));
        const userItemRef = doc(db, "users", userId, "Items", filterNumbersAndStrings(itemID));


        try {
            // Create a new document in Firestore in a 'submissions' collection with a unique ID
            await setDoc(itemRef, formData);
            await setDoc(userItemRef, formData);
            alert('Form data successfully saved to Firestore!');
        } catch (error) {
            console.error("Error saving document: ", error);
            alert('Failed to save data.');
        }
    };


    const getTotalPrice = () => {
        return items.reduce((total, item) => total + Number(item.price), 0);
    };



    return (
        <div >
            
            <div className="All" style={{ marginTop: '100px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{}}>
                        {items.map((item) => (
                            <div className="item" key={item.id}>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleImageChange(e, item.id)}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                />
                                <div className="is-food-label">
                                    <input
                                        type="checkbox"
                                        checked={item.isFood}
                                        onChange={(e) => updateItem(item.id, 'isFood', e.target.checked)}
                                    />
                                    <label>Is Food?</label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addItem}>Add Item</button>
                    <label>Pickup by Date</label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                    />
                    <div className="is-food-label">
                        <input
                            type="checkbox"
                            checked={mustTakeAll}
                            onChange={(e) => setMustTakeAll(e.target.checked)}
                        />
                        <label>Must Take All</label>
                    </div>
                    <div style={{ position: 'fixed', top: '10vh', right: '100px', backgroundColor: '#ccc', borderRadius: '10px', width: '20%' }}>
                <div style={{textAlign:'left', justifyContent:'left', margin:'none', paddingLeft:'20px'}}>Total Price Estimate: ${getTotalPrice()}</div>
                <div style={{textAlign:'left', justifyContent:'left', margin:'none', paddingLeft:'20px'}}>{mustTakeAll? <div>Must take all</div>: <div></div> }</div>
                <div style={{textAlign:'left', justifyContent:'left', margin:'none', paddingLeft:'20px'}}>{perishables? <div>Perishables</div>: <div></div> }</div>
                <button type="submit" >Submit</button>



            </div>
                </form>

            </div>
        </div>

    );
};