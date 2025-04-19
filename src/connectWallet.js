import { ethers } from 'ethers';

const connectWallet = async () => {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            return account;
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('Please install MetaMask!');
    }
};

export default connectWallet;