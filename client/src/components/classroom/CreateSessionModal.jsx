import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../basic/Loader';

const CreateSessionModal = ({ onClose, semesterId }) => {
  const [academicYear, setAcademicYear] = useState('');
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syllabusOptions, setSyllabusOptions] = useState([]);
  const [syllabusLoading, setSyllabusLoading] = useState(false);

  // Fetch syllabus options from the API
  const fetchSyllabusOptions = async () => {
    try {
      setSyllabusLoading(true);
      const res = await axios.get(`http://localhost:8080/api/admin/syllabus/${semesterId}`);
      const options = res.data.data.map(syllabus => ({
        value: syllabus._id,
        label: syllabus.name
      }));
      setSyllabusOptions(options);
    } catch (error) {
      toast.error('Failed to load syllabus options');
    } finally {
      setSyllabusLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!academicYear || !selectedSyllabus) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
     
      await axios.post('http://localhost:8080/api/admin/sessions', { academicYear, syllabusId: selectedSyllabus.value , semesterId});
      toast.success('Academic session created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-black">Create New Academic Session</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2023-2024"
                className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Select Syllabus
              </label>
              <Select
                options={syllabusOptions}
                value={selectedSyllabus}
                onChange={setSelectedSyllabus}
                placeholder="Choose syllabus..."
                isLoading={syllabusLoading}
                loadingMessage="Loading syllabus..."
                styles={customSelectStyles}
                isSearchable
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              disabled={loading || syllabusLoading}
            >
              {loading && <Loader loading={true} size={10} />}
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reuse the same customSelectStyles from previous components
const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderColor: '#e2e8f0',
    borderRadius: '0.375rem',
    minHeight: '40px',
    '&:hover': {
      borderColor: '#cbd5e1'
    }
  }),
  input: (base) => ({
    ...base,
    color: '#1e293b'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#94a3b8'
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  }),
  option: (base, { isFocused }) => ({
    ...base,
    backgroundColor: isFocused ? '#f8fafc' : '#ffffff',
    color: '#1e293b',
    '&:active': {
      backgroundColor: '#f1f5f9'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#f1f5f9',
    borderRadius: '0.25rem'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e293b'
  })
};

export default CreateSessionModal;