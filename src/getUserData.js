import { ethers } from 'ethers';
import contractABI from './contractABI.json'; // Replace with your contract's ABI

const getUserData = async (account) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const userData = await contract.users(account);
    return userData;
};

export default getUserData;