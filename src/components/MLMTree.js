import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BinaryTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Dummy API call simulation
    const fetchTreeData = async () => {
      const response = await fetch("/api/getUserTree?userId=4449227"); // Replace with actual API
      const data = await response.json();
      setTreeData(data);
    };
    fetchTreeData();
  }, []);

  const handleNodeClick = (user) => {
    setSelectedUser(user);
  };

  const renderTree = (user, level = 0) => {
    if (!user) return null;

    return (
      <div className="flex flex-col items-center">
        {/* User Node */}
        <motion.div
          className="relative flex items-center justify-center p-4 rounded-full shadow-lg bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition"
          whileHover={{ scale: 1.1 }}
          onClick={() => handleNodeClick(user)}
        >
          <span>{user.id}</span>
          {selectedUser && selectedUser.id === user.id && (
            <motion.div
              className="absolute top-12 w-56 bg-white shadow-lg p-2 rounded-lg text-black text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Address:</strong> {user.account}</p>
              <p><strong>Referrer:</strong> {user.referrer}</p>
              <p><strong>Activation:</strong> {user.start}</p>
              <p><strong>Direct Team:</strong> {user.directTeam}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Recursive Call for Child Nodes */}
        {user.children && (
          <div className="flex justify-center mt-4 space-x-4">
            {user.children.map((child, index) => (
              <div key={index} className="relative">
                <div className="w-1 h-10 bg-gray-500 mx-auto"></div>
                {renderTree(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-5 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-white text-2xl font-bold mb-6">User Network</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
        {treeData ? renderTree(treeData) : <p className="text-white">Loading...</p>}
      </div>
    </div>
  );
};

export default BinaryTree;
