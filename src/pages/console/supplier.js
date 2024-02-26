import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './supplier.css'; // Ensure the CSS file path is correct
import { auth, db } from '../login/firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';

export const Supplier = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([{ id: uuidv4(), name: '', image: null, isFood: false, price: 0 }]);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTimeRange, setPickupTimeRange] = useState('');
    const [mustTakeAll, setMustTakeAll] = useState(false);
    const [perishables, setPerishables] = useState(false);
    const [udata, setUdata] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [pickupDays, setPickupDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
    });
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
    const toggleDay = day => {
        setPickupDays(prevDays => ({ ...prevDays, [day]: !prevDays[day] }));
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
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        const userAddress = udata.address || 'anonymous';
        const coordinates = udata.coordinates || 'anonymous';
        const org = udata.organizationName || 'anonymous';
        const submissionId = `${new Date().toISOString()}-${userId}`;
        const id = submissionId;
        const formData = {
            id,
            org,
            userId,
            userAddress,
            coordinates,
            items,
            pickupDate,
            pickupDays,
            pickupTimeRange,
            perishables,
            mustTakeAll,
            description,
        };

        try {
            // Assuming you're creating a unique identifier for each submission
            await setDoc(doc(db, "Items", submissionId), formData);
            alert('Form data successfully saved to Firestore!');
        } catch (error) {
            console.error("Error saving document: ", error);
            alert('Failed to save data.');
        }
        //redirect to console
        navigate('/console');
    };

    return (
        <div style={{backgroundColor:'#5c6f24', height:'100vh', top:'0', position:'absolute', width:'100vw'}}>
        <div style={{marginTop:'200px'}}>
            <div style={{backgroundColor:'#ccc', width:'20%', borderRadius:'20px',height:'350px', position:'absolute', right:'25px', top:'600px'}}>
           
            <div style={{width:'50%', margin:'auto'}}>
                <div style={{textAlign:'left'}}>
                    <h2>How to use this form:</h2>
                    Add Items to this form by clicking the "Add Item" button. You can add as many items as you need.
            <br/><br/>For records, you can include price
            <br/><br/>Once the form is submitted, we will communicate with when one of our transporters is available to pick up the items.
                </div>
            
            </div>
        </div>
        <div className="supplier-form-container" style={{marginTop:'50px'}}>

        
        <div className="item-section">
            {items.map((item, index) => (
                 <div className="item" key={item.id}>
                 <div className="item-header">
                     <span>Item {index + 1}</span>
                     <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                 </div>
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
                 <label>
                     <input
                         type="checkbox"
                         checked={item.isFood}
                         onChange={(e) => updateItem(item.id, 'isFood', e.target.checked)}
                     />
                     Is Food?
                 </label>
             </div>
            ))}
            <button type="button" onClick={addItem} className="add-item-btn">Add Item</button>
        </div>
        <div className="summary-section">
                <div className="pickup-days">
                    {Object.keys(pickupDays).map((day) => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                checked={pickupDays[day]}
                                onChange={() => toggleDay(day)}
                            /> {day}
                        </label>
                    ))}
                </div>
                <select value={pickupTimeRange} onChange={(e) => setPickupTimeRange(e.target.value)}>
                    <option value="">Select Pickup Time</option>
                    {/* Example time ranges, adjust as needed */}
                    <option value="9AM-12PM">9AM-12PM</option>
                    <option value="12PM-3PM">12PM-3PM</option>
                    <option value="3PM-6PM">3PM-6PM</option>
                </select>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <button type="submit" onClick={handleSubmit} className="submit-btn">Submit</button>
            </div>
    </div>
    </div>
    </div>
    );
};
