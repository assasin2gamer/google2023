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
        // Image handling logic remains the same
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form submission logic remains the same
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
