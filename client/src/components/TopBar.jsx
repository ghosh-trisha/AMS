import React from 'react';
import logo from '../assets/logo.png';

const TopBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <img 
          src={logo} 
          alt="Logo" 
          className="h-10 mr-4"
        />

        <h1 className="text-xl font-semibold">Admin Portal</h1>
      </div>
      <div className="flex items-center">
        <div className="mr-4 text-right">
          <p className="text-sm">Admin Name</p>
          <p className="text-xs text-gray-400">admin@example.com</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
