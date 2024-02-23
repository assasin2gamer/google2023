import React, { useState, useEffect } from 'react';
import { db } from '../login/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export const Request = () => {
  const [ItemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchItemList = async () => {
      const ItemListCollection = collection(db, 'Items');
      const ItemListSnapshot = await getDocs(ItemListCollection);
      const ItemListData = ItemListSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItemList(ItemListData);
    };

    fetchItemList();
  }, []);

  return (
    <div style={{ marginTop: '10vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Request an Item</h1>
      <div>
        {ItemList.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0' }}>{item.name}</h3>
              <p style={{ margin: '0' }}>{item.description}</p>
            </div>
            <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer' }}>
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
