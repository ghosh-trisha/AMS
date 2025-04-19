import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion'; // Import framer-motion

const CreateBuildingModal = ({ isOpen, onClose }) => {
  const [buildingName, setBuildingName] = useState('');
  const baseURL = 'http://localhost:8080/api/admin';

  const handleClose = () => {
    setBuildingName('');
    onClose();
  };

  const handleCreateBuilding = async () => {
    if (!buildingName) {
      toast.error('Please enter a building name.');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/building`, {
        name: buildingName
      });

      toast.success('Building created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating building:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Building</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Building Name
            </label>
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="Enter building name"
              className="w-full p-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBuilding}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
          >
            Create Building
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateBuildingModal;
