import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import axios from 'axios';

// MedicalWasteForm Component
const MedicalWasteForm = ({ addWaste }) => {
    const [wasteData, setWasteData] = useState({
        wasteType: '',
        quantity: '',
        hazardLevel: '',
        certifications: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setWasteData({
            ...wasteData,
            [name]: files ? files[0].name : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addWaste(wasteData);
    };

    return (
        <form className="form-module" onSubmit={handleSubmit}>
            <label>waste type:</label>
            <select name="wasteType" onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="sharps">Sharps</option>
                <option value="biohazard">Biohazard</option>
                <option value="pharmaceuticals">Pharmaceuticals</option>
            </select>

            <label>quantity (kg):</label>
            <input type="number" name="quantity" onChange={handleChange} required />

            <label>hazard level:</label>
            <input type="text" name="hazardLevel" onChange={handleChange} required />

            <label>certifications:</label>
            <input type="file" name="certifications" onChange={handleChange} required />

            <button type="submit" className="btn">List Waste</button>
        </form>
    );
};

// NFTMinting Component
const NFTMinting = ({ wasteId }) => {
    const [message, setMessage] = useState('');

    const handleMintNFT = async () => {
        try {
            const response = await axios.post('/mintNFT', { wasteId });
            setMessage(`NFT Minted: Token ID - ${response.data.nftId}`);
        } catch (error) {
            setMessage('Error minting NFT');
        }
    };

    return (
        <div className="nft-module">
            <button onClick={handleMintNFT} className="btn">Mint NFT</button>
            {message && <p>{message}</p>}
        </div>
    );
};

// Main App Component
const App = () => {
    const [wasteData, setWasteData] = useState([]);
    const [wasteId, setWasteId] = useState(null);

    const addWaste = (newWaste) => {
        setWasteData([...wasteData, { ...newWaste, status: 'Pending' }]);
    };

    const recycleWaste = (index) => {
        const updatedWaste = [...wasteData];
        updatedWaste[index].status = 'Recycled';
        setWasteData(updatedWaste);
        burnNFT(updatedWaste[index]);
        sendCertificate(updatedWaste[index]);
    };

    const burnNFT = (waste) => {
        const transaction = `NFT for ${waste.wasteType} has been burned on the blockchain.`;
        document.getElementById('transactionLog').innerHTML += `<p>${transaction}</p>`;
    };

    const sendCertificate = (waste) => {
        const certificate = `Recycling certificate issued for ${waste.quantity} kg of ${waste.wasteType}.`;
        document.getElementById('transactionLog').innerHTML += `<p>${certificate}</p>`;
    };

    return (
        <div className="App">
            <header className="app-header">
                <img src={logo} className="app-logo" alt="logo" />
                <p>Edit <code>src/App.js</code> and save to reload.</p>
                <a className="app-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
            </header>

            <main className="main-content">
                <MedicalWasteForm addWaste={addWaste} />
                <div id="wasteList" className="table-module">
                    <table>
                        <thead>
                            <tr>
                                <th>waste type</th>
                                <th>quantity</th>
                                <th>hazard level</th>
                                <th>status</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wasteData.map((waste, index) => (
                                <tr key={index}>
                                    <td>{waste.wasteType}</td>
                                    <td>{waste.quantity}</td>
                                    <td>{waste.hazardLevel}</td>
                                    <td>{waste.status}</td>
                                    <td>
                                        <button onClick={() => recycleWaste(index)}>Recycle</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div id="transactionLog" className="transaction-log"></div>
            </main>
        </div>
    );
};

export default App;
