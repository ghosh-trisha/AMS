import React, { useState } from 'react';
import DropdownComponent from '../utils/Dropdown'; // <-- Import the child component
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CreateCourseModal = ({ isOpen, onClose }) => {
  const [departmentEnabled, setDepartmentEnabled] = useState(true);  // 1st dropdown enabled by default
  const [levelEnabled, setLevelEnabled] = useState(false);          // 2nd dropdown initially disabled
  const [programEnabled, setProgramEnabled] = useState(false);      // 3rd dropdown initially disabled

  const [departmentId, setDepartmentId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [courseName, setCourseName] = useState(''); // Course name input
  const [numSemesters, setNumSemesters] = useState(''); // Number of semesters input

  // Example base URL (replace with your actual endpoints)
  const baseURL = 'http://localhost:8080/api/admin';

  // Handler for closing the modal
  const handleClose = () => {
    onClose();
  };

  // Handler for final creation
  const handleCreateCourse = async () => {
    if (!courseName || !numSemesters || !programId || !levelId || !departmentId) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      // First, create the course
      const courseRes = await axios.post(`${baseURL}/courses`, {
        name: courseName,
        programId: programId
      });
      const courseId = courseRes.data.data._id;
      
      console.log("courseId", courseId);
      console.log("numSemesters", numSemesters);
      // Then, create the semester entry with total number of semesters and the course id
      await axios.post(`${baseURL}/semesters`, {
        totalSemesters: numSemesters,
        courseId: courseId
      });
      
      toast.success('Course created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error?.response?.data?.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Course</h2>

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
                createApiUrl={`${baseURL}/departments`}
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
                createApiUrl={`${baseURL}/levels`}
                parentId={departmentId}
                parentField="departmentId"
              />
            </div>

            {/* PROGRAM DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Program
              </label>
              <DropdownComponent
                onOffState={programEnabled}
                getOnChangeValue={(val) => {
                  setProgramId(val);
                }}
                apiUrl={levelId ? `${baseURL}/programs/${levelId}` : null}
                createApiUrl={`${baseURL}/programs`}
                parentId={levelId}
                parentField="levelId"
              />
            </div>

            {/* Course Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter course name"
                className="w-full p-2 border border-gray-200 rounded-md"
                disabled={!programId}
                style={{ backgroundColor: !programId ? '#f1f5f9' : '#ffffff' }}
              />
            </div>

            {/* Number of Semesters Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Number of Semesters
              </label>
              <input
                type="number"
                value={numSemesters}
                onChange={(e) => setNumSemesters(e.target.value)}
                placeholder="Enter number of semesters"
                className="w-full p-2 border border-gray-200 rounded-md"
                min="1"
                disabled={!courseName}
                style={{ backgroundColor: !courseName ? '#f1f5f9' : '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateCourse}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
