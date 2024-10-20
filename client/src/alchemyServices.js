// alchemyServices.js
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: "TqWYI7II2taa2f9z13Slvmt4rj3dKxrE",  // Your Alchemy API Key
  network: Network.MATIC_MAINNET,  // Choose network (e.g., ETH_MAINNET, MATIC_MAINNET)
};

const alchemy = new Alchemy(settings);

// Fetch logs from Alchemy
const fetchLogs = async () => {
  try {
    const logs = await alchemy.core.getLogs({
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // Contract address
      fromBlock: "0x1",
      toBlock: "0x5dfbb5",
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"  // Example topic
      ]
    });
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

// Additional functions for interacting with Alchemy API
const getTransactionDetails = async (txHash) => {
  try {
    const transaction = await alchemy.core.getTransaction(txHash);
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

// Example: Fetch metadata of an NFT
const getNFTMetadata = async (contractAddress, tokenId) => {
  try {
    const metadata = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    return metadata;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    throw error;
  }
};

export { fetchLogs, getTransactionDetails, getNFTMetadata };
