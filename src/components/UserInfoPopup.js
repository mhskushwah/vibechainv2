// src/components/UserInfoPopup.js
import React from 'react';

const UserInfoPopup = ({ info, position }) => {
    if (!info) return null;

    return (
        <div style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 10,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 10,
            pointerEvents: 'none',
            width: 200
        }}>
            <strong>User ID:</strong> {info.name} <br/>
            <strong>Wallet:</strong> {info.attributes.wallet} <br/>
            <strong>Level:</strong> {info.attributes.level} <br/>
            <strong>Start Time:</strong> {info.attributes.startTime} <br/>
            <strong>Community Size:</strong> {info.attributes.communitySize} <br/>
            <strong>Referrer ID:</strong> {info.attributes.referrer}
        </div>
    );
};

export default UserInfoPopup;
