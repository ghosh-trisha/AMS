import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../basic/Loader';
import HashLoader from "react-spinners/HashLoader";


const CreateSyllabusModal = ({ isOpen, onClose, semesterId }) => {
  const [year, setYear] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryLoader, setCategoryLoader] = useState(false);

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', code: '', category: null }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoader(true);
      const res = await axios.get("http://localhost:8080/api/admin/categories");
      setCategories(res.data.data.map(cat => ({
        value: cat._id,
        label: cat.name
      })));
      setCategoryLoader(false);
    } catch (error) {
      toast.error('Failed to load categories');
      setCategoryLoader(false);
    }
  };

  const handleCreateSyllabus = async () => {
    if (!year || subjects.some(subject => !subject.name || !subject.code || !subject.category)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/admin/syllabus', {
        name: year,
        semesterId,
        subjects: subjects.map(subject => ({
          subjectName: subject.name,
          subjectCode: subject.code,
          subjectCategory: subject.category.value
        }))
      }
        , {
          headers: {
            'Content-Type': 'application/json'
          }
        }

      );
      toast.success('Syllabus created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating syllabus:', error);
      toast.error(error?.response?.data?.message || 'Failed to create syllabus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Create New Syllabus</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSubject}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Add Subject
          </button>
          <div className=" grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4 border-gray-200">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Subject Name</label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    placeholder="Enter subject name"
                    className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Subject Code</label>
                  <input
                    type="text"
                    value={subject.code}
                    onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                    placeholder="Enter subject code"
                    className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                  <Select
                    options={categories}
                    value={subject.category}
                    onChange={(selected) => handleSubjectChange(index, 'category', selected)}
                    placeholder="Select category..."
                    isLoading={categoryLoader}
                    loadingMessage="Loading categories..."
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            ))}


          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateSyllabus}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer"
            disabled={loading}
          >
            <div className='flex gap-3'>
              {loading && <HashLoader color={"blue"} loading={loading} size={20} />}
              Create Syllabus
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Reuse the same customSelectStyles from CreateScheduleModal
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

export default CreateSyllabusModal;



