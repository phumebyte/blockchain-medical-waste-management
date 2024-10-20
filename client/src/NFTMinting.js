import React, { useState } from 'react';
import axios from 'axios';

const NFTMinting = ({ wasteId }) => {
    const [message, setMessage] = useState('');

    const handleMintNFT = async () => {
        try {
            const response = await axios.post('http://localhost:5000/mintNFT', { wasteId });
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

export default NFTMinting;
