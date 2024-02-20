import React, { useState, useEffect } from 'react';
import { GoogleLog } from './GoogleLog';

export const Login = () => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '40px',
            backgroundColor: '#fff6',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
            margin: 'auto',
            marginTop: '100px',
        },
        title: {
            margin: 0,
            marginBottom: '20px',
            color: '#333',
        },
        loginMethods: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
        },
        footerText: {
            marginTop: '20px',
            color: '#aaa',
            fontSize: '14px',
        },
    };
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login to Your Account</h2>
            <div style={styles.loginMethods}>
                <GoogleLog />
                {/* Placeholder for other login methods if necessary */}
            </div>
            <p style={styles.footerText}>© Your Company</p>
        </div>
    );
};