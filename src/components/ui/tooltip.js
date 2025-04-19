import React from 'react';

const Tooltip = ({ text, children }) => {
    return (
        <div className="relative group">
            {children}
            <span className="absolute left-0 top-full mt-2 w-auto p-2 text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {text}
            </span>
        </div>
    );
};

export default Tooltip;  // ✅ Default export
