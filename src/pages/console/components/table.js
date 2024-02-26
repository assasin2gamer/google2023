import React, { useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../login/firebase-config';

import './table.css'; // Ensure your CSS file is correctly linked

export const SleekTable = ({ stations, items}) => {
    console.log(items);
    const navigate = useNavigate();

    const [expandedRows, setExpandedRows] = useState({});

    const toggleRowExpansion = (stationId) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [stationId]: !prevState[stationId]
        }));
    };

    const tabs = ['Identify', 'Allocate', 'Transport']; // Add or remove tabs as needed

    //find an item in items array
    const findItem = (itemId) => {
        //loop through items array and find the item with the matching id
        for (let i = 0; i < items.length; i++) {
            console.log(items[i].pickupTimeRange, itemId)
            if (items[i].id === itemId) {
                return items[i];
            }
        }
    };
    //check if item is in station array
    const isItemInStation = (itemId) => {
        //loop through stations array and find the station with the matching id
        for (let i = 0; i < stations.length; i++) {
            //loop through the request array of the station and check if the item is in the array
            for (let j = 0; j < stations[i].request.length; j++) {
                console.log(stations[i].request[j], itemId);
                if (stations[i].request[j] === (itemId)) {
                    return true;
                }
            }
            
        }
        return false;
    };
    //update firebase user to add item to request
    const claim = (itemId) => async () => {
//add to request array
        await setDoc(doc(db, "Stations", "test"), {
            request: [...stations[0].request, itemId]
        }, { merge: true });


    };

    const [isclaimed, setIsclaimed] = useState(false);

    return (
        <div className="sleek-table-container">
            <div className="tab-headers" style={{ width: '100%', backgroundColor: 'grey', borderRadius: '5px' }}>

                <button
                    className={`tab-button`}
                    style={{ width: '33.3%', margin: 'auto', borderColor: 'black', borderStyle: 'solid' }}
                    onClick={() => navigate('/supplier')} // Corrected: Use onClick and wrapped navigate in a function
                >
                    Identify
                </button>
                <button
                    className={`tab-button`}
                    style={{ width: '33.3%', margin: 'auto', borderColor: 'black', borderStyle: 'solid' }}
                >
                    Allocate
                </button>
                <button
                    className={`tab-button`}
                    style={{ width: '33.3%', margin: 'auto', borderColor: 'black', borderStyle: 'solid' }}

                >
                    Transport
                </button>

            </div>
            <table className="sleek-table">
                <thead>
                    <tr>
                        <th>Station Location</th>
                        <th>Requested Items</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((station, index) => (
                        <React.Fragment key={index}>
                            <tr >
                                <td>
                                    <div style={{ display: 'flex' }}>
                                        <div onClick={() => toggleRowExpansion(station.id)} className="station-row" />
                                        <div className="station-info">
                                            {station.address}
                                        </div>
                                    </div>
                                </td>
                                <td>{station.request.length} items</td>
                            </tr>
                            {expandedRows[station.id] && (
                                <tr className="request-detail-row">
                                    <td colSpan="3">
                                        <table className="sub-table">
                                            <thead>
                                                <tr>
                                                    <th>Item ID</th>
                                                    <th>Date</th>
                                                    <th>Available Time</th>
                                                    <th>Driver</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <div style={{ fontSize: '20px', borderBottom: 'solid' }}>
                                                    Requested Items
                                                </div>
                                                {station.request.map((item, itemIndex) => (
                                                    <tr key={`${index}_${itemIndex}`}>
                                                        <td>{item}</td>
                                                        
                                                        <td>{}</td>
                                                        <td>{findItem(item).pickupTimeRange}</td>


                                                        <td>{item.driver || 'Not assigned'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            
            <table className="sleek-table">
                <thead>
                    <tr>
                        <th>Items</th>
                        <th>Claim</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((ilabel, index) => (
                        <React.Fragment key={index}>
                            <tr >
                                <td>
                                    <div style={{ display: 'flex' }}>
                                        <div className="station-info">
                                            {ilabel.id}
                                        </div>
                                    </div>
                                </td>
                                <td>{isItemInStation(ilabel.id)? <div>Claimed</div>:<button onClick={claim(ilabel.id)}></button>}</td>
                            </tr>
                            
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
