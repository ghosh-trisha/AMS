import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import axios from 'axios';

const CreateSyllabusModal = ({ isOpen, onClose }) => {
  const [year, setYear] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories]=useState([]);
   const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', code: '', category: null }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const fetchCategories=async()=>{
    const res=await axios.get("http://localhost:8080/api/admin/categories");
    setCategories(res.data.data);
  }
  const handleCreateSyllabus = async () => {
    if (!year || subjects.some(subject => !subject.name || !subject.code || !subject.category)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/admin/syllabus', {
        year,
        subjects
      });
      toast.success('Syllabus created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating syllabus:', error);
      toast.error(error?.response?.data?.message || 'Failed to create syllabus.');
    }
  };

//   if (!isOpen) return null;
useEffect(()=>{
    fetchCategories();
},[])
  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Syllabus</h2>

        <div className="flex-1 overflow-y-auto min-h-72 pr-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year"
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>

            {subjects.map((subject, index) => (
              <div key={index} className="border border-gray-300 rounded-md p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Subject Name</label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    placeholder="Enter subject name"
                    className="w-full p-2 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Subject Code</label>
                  <input
                    type="text"
                    value={subject.code}
                    onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                    placeholder="Enter subject code"
                    className="w-full p-2 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Category
              </label>
              <Select
                options={categories}
                value={selectedCategory}
                // loading={subjectLoader}
                // loadingMessage={"loading subjects"}
                onChange={setSelectedCategory}
                placeholder="Search categories..."
                isSearchable
                isDisabled={!!selectedCategory}
                styles={customSelectStyles}
              />
            </div>
              </div>
            ))}

            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
            >
              Add Subject
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSyllabus}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Create Syllabus
          </button>
        </div>
      </div>
    </div>
  );
};

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
