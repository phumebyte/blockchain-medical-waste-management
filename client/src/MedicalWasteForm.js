import React, { useState } from 'react';
import axios from 'axios';

const MedicalWasteForm = () => {
    const [wasteData, setWasteData] = useState({
        wasteType: '',
        quantity: '',
        hazardLevel: ''
    });

    const handleChange = (e) => {
        setWasteData({ ...wasteData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/addWaste', wasteData);
            alert('Medical Waste Listed!');
        } catch (error) {
            console.error('Error submitting waste:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Waste Type:</label>
            <select name="wasteType" onChange={handleChange}>
                <option value="sharps">Sharps</option>
                <option value="biohazard">Biohazard</option>
                <option value="pharmaceuticals">Pharmaceuticals</option>
            </select>

            <label>Quantity (kg):</label>
            <input type="number" name="quantity" onChange={handleChange} />

            <label>Hazard Level:</label>
            <input type="text" name="hazardLevel" onChange={handleChange} />

            <button type="submit">List Waste</button>
        </form>
    );
};

export default MedicalWasteForm;
