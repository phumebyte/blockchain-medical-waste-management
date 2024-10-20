"use strict"

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals.js';
import waste from './mongooseSchema.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wasteForm = document.getElementById('wasteForm');
    const wasteList = document.getElementById('waste-list');
    const transactionLog = document.getElementById('transactionLog');

    // Array to hold waste listings
    let wasteData = [];

    // Function to dynamically update waste table
    function updateWasteTable() {
        wasteList.innerHTML = '';
        wasteData.forEach((waste, index) => {
            wasteList.innerHTML += `
                <tr>
                    <td>${waste.wasteType}</td>
                    <td>${waste.quantity}</td>
                    <td>${waste.hazardLevel}</td>
                    <td>${waste.status}</td>
                    <td><button onclick="removeWaste(${index})">Remove</button></td>
                </tr>
            `;
        });
    }

    // Function to add a new waste listing
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

    // Function to remove waste
    window.removeWaste = function (index) {
        wasteData.splice(index, 1);
        updateWasteTable();
    };

    // Function to interact with blockchain API (Mock Example)
    function mockBlockchainAPI(waste) {
        // Simulate blockchain transaction and log
        const transaction = `Transaction for ${waste.wasteType}, ${waste.quantity}kg at ${new Date().toLocaleTimeString()}`;
        transactionLog.innerHTML += `<p>${transaction}</p>`;
    }

    // Trigger blockchain transaction for each waste listing
    wasteData.forEach((waste) => {
        mockBlockchainAPI(waste);
    });
});

//Waste Listing API
app.post('/addWaste', async (req, res) => {
    const { wasteType, quantity, hazardLevel } = req.body;

    try {
        const newWaste = new Waste({
            wasteType,
            quantity,
            hazardLevel
        });
        await newWaste.save();
        res.status(201).json({ message: 'Waste listed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error listing waste', error });
    }
});
