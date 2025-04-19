import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DropdownComponent from '../utils/Dropdown';
import { motion } from 'framer-motion'; // Import framer-motion

const CreateRoomModal = ({ isOpen, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [buildingEnabled, setBuildingEnabled] = useState(true);

  const baseURL = 'http://localhost:8080/api/admin';

  const handleClose = () => {
    setRoomName('');
    setBuildingId('');
    onClose();
  };

  const handleCreateRoom = async () => {
    if (!roomName || !buildingId) {
      toast.error('Please select a building and enter a room name.');
      return;
    }

    try {
      await axios.post(`${baseURL}/room`, {
        name: roomName,
        buildingId,
      });
      toast.success('Room created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  // Fetch building data on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`${baseURL}/building`);
        setBuildings(response.data.data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    fetchBuildings();
  }, []);

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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Room</h2>

        <div className="space-y-4">
          {/* Building Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Building</label>
            <DropdownComponent
              onOffState={true}
              getOnChangeValue={(val) => {
                setBuildingId(val);
              }}
              apiUrl={`${baseURL}/building`}
              createApiUrl={`${baseURL}/building`}
            />
          </div>

          {/* Room Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full p-2 border border-gray-200 rounded-md"
              disabled={!buildingId}
              style={{ backgroundColor: !buildingId ? '#f1f5f9' : '#ffffff' }}
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
            onClick={handleCreateRoom}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
          >
            Create Room
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateRoomModal;
