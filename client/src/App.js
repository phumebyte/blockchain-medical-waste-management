import React, { useState } from 'react';
import logo from './logo.svg';  // Importing logo
import './App.css';  // Importing styles
import axios from 'axios';

// MedicalWasteForm Component
const MedicalWasteForm = () => {
  const [wasteData, setWasteData] = useState({
    wasteType: '',
    quantity: '',
    hazardLevel: '',
  });

  const handleChange = (e) => {
    setWasteData({ ...wasteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/addWaste', wasteData);
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
    <div>
      <button onClick={handleMintNFT}>Mint NFT</button>
      {message && <p>{message}</p>}
    </div>
  );
};

// Main App Component
const App = () => {
  const [wasteId, setWasteId] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <main>
        <h1>Medical Waste Management</h1>
        <MedicalWasteForm />
        {wasteId && <NFTMinting wasteId={wasteId} />}
      </main>
    </div>
  );
};

export default App;
