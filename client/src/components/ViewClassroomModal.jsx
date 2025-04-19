
import React, { useState } from 'react';
import DropdownComponent from '../utils/Dropdown'; // <-- Import the child component
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import framer-motion

const CreateCourseModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [departmentEnabled, setDepartmentEnabled] = useState(true);  // 1st dropdown enabled by default
  const [levelEnabled, setLevelEnabled] = useState(false);        // 2nd dropdown initially disabled
  const [programEnabled, setProgramEnabled] = useState(false);    // 3rd dropdown initially disabled
  const [courseEnabled, setCourseEnabled] = useState(false);      // 4th dropdown initially disabled
  const [semesterEnabled, setSemesterEnabled] = useState(false);  // 5th dropdown initially disabled

  const [departmentId, setDepartmentId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [semesterId, setSemesterId] = useState(null);

  // base url for API calls
  const baseURL = 'http://localhost:8080/api/admin';

  // Handler for closing the modal
  const handleClose = () => {
    setDepartmentId(null);
    setLevelId(null);
    setProgramId(null);
    setCourseId(null);
    setSemesterId(null);

    setDepartmentEnabled(true);
    setLevelEnabled(false);
    setProgramEnabled(false);
    setCourseEnabled(false);
    setSemesterEnabled(false);

    onClose();
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
        className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">View Course</h2>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto min-h-72 pr-2">
          <div className="space-y-4">
            {/* DEPARTMENT DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Department
              </label>
              <DropdownComponent
                onOffState={departmentEnabled}
                setOn={setLevelEnabled}
                getOnChangeValue={(val) => {
                  setDepartmentId(val);
                  // Reset subsequent IDs
                  setLevelId(null);
                  setProgramId(null);
                }}
                apiUrl={`${baseURL}/departments`} 
                isAddOther={false}
              />
            </div>

            {/* LEVEL DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Level
              </label>
              <DropdownComponent
                onOffState={levelEnabled}
                setOn={setProgramEnabled}
                getOnChangeValue={(val) => {
                  setLevelId(val);
                  // Reset subsequent IDs
                  setProgramId(null);
                }}
                apiUrl={departmentId ? `${baseURL}/levels/${departmentId}` : null}
                isAddOther={false}
              />
            </div>

            {/* PROGRAM DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Program
              </label>
              <DropdownComponent
                onOffState={programEnabled}
                setOn={setCourseEnabled}
                getOnChangeValue={(val) => {
                  setProgramId(val);
                }}
                apiUrl={levelId ? `${baseURL}/programs/${levelId}` : null}
                isAddOther={false}
              />
            </div>

            {/* COURSE DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Course</label>
              <DropdownComponent
                onOffState={courseEnabled}
                setOn={setSemesterEnabled}
                getOnChangeValue={(val) => {
                  setCourseId(val);
                  setSemesterId(null);
                }}
                apiUrl={programId ? `${baseURL}/courses/${programId}` : null}
                isAddOther={false}
              />
            </div>

            {/* SEMESTER DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Semester</label>
              <DropdownComponent
                onOffState={semesterEnabled}
                getOnChangeValue={(val) => {
                  setSemesterId(val);
                }}
                apiUrl={courseId ? `${baseURL}/semesters/${courseId}` : null}
                isAddOther={false}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              navigate(`/admin/class/${semesterId}`);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
          >
            View Class
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateCourseModal;
