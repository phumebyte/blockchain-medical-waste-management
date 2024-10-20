"use strict"

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance report
reportWebVitals();

document.addEventListener('DOMContentLoaded', () => {
    const wasteForm = document.getElementById('wasteForm');
    const wasteList = document.getElementById('wasteList');
    const transactionLog = document.getElementById('transactionLog');

    let wasteData = [];

    function updateWasteTable() {
        wasteList.innerHTML = '';
        wasteData.forEach((waste, index) => {
            wasteList.innerHTML += `
                <tr>
                    <td>${waste.wasteType}</td>
                    <td>${waste.quantity}</td>
                    <td>${waste.hazardLevel}</td>
                    <td>${waste.status}</td>
                    <td>
                        <button onclick="removeWaste(${index})">Remove</button>
                        <button onclick="recycleWaste(${index})">Recycle</button>
                    </td>
                </tr>
            `;
        });
    }

    wasteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newWaste = {
            wasteType: document.getElementById('wasteType').value,
            quantity: document.getElementById('quantity').value,
            hazardLevel: document.getElementById('hazardLevel').value,
            certifications: document.getElementById('certifications').files[0].name,
            status: 'Pending'
        };

        wasteData.push(newWaste);
        updateWasteTable();
        wasteForm.reset();
    });

    window.removeWaste = function (index) {
        wasteData.splice(index, 1);
        updateWasteTable();
    };

    window.recycleWaste = function (index) {
        wasteData[index].status = 'Recycled';
        updateWasteTable();
        burnNFT(wasteData[index]);
        sendCertificate(wasteData[index]);
    };

    function mockBlockchainAPI(waste) {
        const transaction = `Transaction for ${waste.wasteType}, ${waste.quantity}kg at ${new Date().toLocaleTimeString()}`;
        transactionLog.innerHTML += `<p>${transaction}</p>`;
    }

    function burnNFT(waste) {
        // Simulated burn NFT process
        const transaction = `NFT for ${waste.wasteType} has been burned on the blockchain.`;
        transactionLog.innerHTML += `<p>${transaction}</p>`;
    }

    function sendCertificate(waste) {
        // Simulated process of sending a certificate
        const certificate = `Recycling certificate issued for ${waste.quantity} kg of ${waste.wasteType}.`;
        transactionLog.innerHTML += `<p>${certificate}</p>`;
    }
});
