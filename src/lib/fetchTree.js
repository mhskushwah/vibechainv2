// src/lib/fetchTree.js
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../blockchain/config";


export const fetchTree = async (userId) => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const treeData = await contract.getTree(userId);  // 👈 ye function aapke contract ka hona chahiye
    return formatTree(treeData);
};

// Limit to max 7 child nodes & format
function formatTree(node) {
    return {
        name: node.id,
        attributes: {
            wallet: node.wallet,
            level: node.level,
            startTime: new Date(node.startTime * 1000).toLocaleString(),
            communitySize: node.communitySize.toString(),
            referrer: node.referrer,
        },
        children: (node.children || []).slice(0, 7).map(formatTree),
    };
}
