import React, { useState, useEffect } from 'react';
import "./supplier.css"; // Ensure the CSS file path is correct
import { auth, db } from '../login/firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';

export const Supplier = () => {
    const [items, setItems] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [mustTakeAll, setMustTakeAll] = useState(false);
    const [perishables, setPerishables] = useState(false);
    const [udata, setUdata] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUdata(userDocSnap.data());
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("User not logged in.");
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addItem = () => {
        setItems([...items, { id: uuidv4(), name: '', image: null, isFood: false, price: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
        setItems(updatedItems);
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
            description
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

    return (
        <div className="All">
            <form onSubmit={handleSubmit}>
                {items.map((item, index) => (
                    <div className="item" key={item.id}>
                        <div className="item-header">
                            <div>Item {index + 1}</div>
                            <button type="button" onClick={() => removeItem(item.id)} className="remove-item-btn">Remove</button>
                        </div>
                        <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                        <input type="file" onChange={(e) => handleImageChange(e, item.id)} />
                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />
                        <div className="is-food-label">
                            <input type="checkbox" checked={item.isFood} onChange={(e) => updateItem(item.id, 'isFood', e.target.checked)} />
                            <label>Is Food?</label>
                        </div>
                    </div>
                ))}
                <div className="form-controls">
                    <button type="button" onClick={addItem} className="add-item-btn">Add Item</button>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};
