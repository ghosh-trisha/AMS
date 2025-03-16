import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../basic/Loader';
import toast from 'react-hot-toast';
import axios from 'axios';
const CreateScheduleModal = ({ currSessionId, onClose, onScheduleCreated }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const  [subjectLoader, setSubjectLoader]=useState(false)
  const [error, setError] = useState(null);
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [subjects , setSubjects]=useState([]);

  // Demo data
  const demoSubjects = [
    { _id: '1', name: 'Mathematics', code: 'MATH101' },
    { _id: '2', name: 'Physics', code: 'PHY102' },
    { _id: '3', name: 'Chemistry', code: 'CHEM103' }
  ];

  const demoTeachers = [
    { _id: '1', first_name: 'John', last_name: 'Doe' },
    { _id: '2', first_name: 'Jane', last_name: 'Smith' },
    { _id: '3', first_name: 'Bob', last_name: 'Johnson' }
  ];

  // const subjects = demoSubjects.map(subject => ({
  //   value: subject._id,
  //   label: `${subject.name} (${subject.code})`
  // }));

  const teachers = demoTeachers.map(teacher => ({
    value: teacher._id,
    label: `${teacher.first_name} ${teacher.last_name}`
  }));

  const weekdays = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, {
      weekday: null,
      startTime: null,
      endTime: null,
      selectedTeachers: []
    }]);
  };

  const updateScheduleEntry = (index, field, value) => {
    const newEntries = [...scheduleEntries];
    newEntries[index][field] = value;
    setScheduleEntries(newEntries);
  };
  const fetchSubjects=async()=>{
    setSubjectLoader(true)
    
   const res = await axios.get(`http://localhost:8080/api/admin/syllabus/subjects/${currSessionId}`);
   console.log(res)
   const data=res.data.data.map((subject)=>{
    return{
         value: subject._id,
    label: `${subject.name} (${subject.code}) [${subject.category}]`
    }
   });
   console.log(data)
   setSubjects(data);

   setSubjectLoader(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || scheduleEntries.length === 0) return;

    const isValid = scheduleEntries.every(entry => 
      entry.weekday && entry.startTime && entry.endTime && entry.selectedTeachers.length > 0
    );

    if (!isValid) {
      toast.error('Please fill all fields in each schedule entry');
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const demoResponse = scheduleEntries.map((entry, index) => ({
        _id: `demo-${index}-${Date.now()}`,
        classroom_id: classroomId,
        subject_id: selectedSubject.value,
        teachers: entry.selectedTeachers.map(t => t.value),
        start_time: entry.startTime.toISOString(),
        end_time: entry.endTime.toISOString(),
        weekday: entry.weekday.value
      }));

      onScheduleCreated(demoResponse);
      onClose();
      toast.success('Demo schedules created successfully');
      setLoading(false);
    }, 1000);
  };
useEffect(()=>{
fetchSubjects();
},[currSessionId])
  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-4xl shadow-lg  max-h-[80vh] overflow-y-scroll overflow-x-auto">
        <h2 className="text-xl text-black font-bold mb-4">Create New Schedule</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Subject
              </label>
              <Select
                options={subjects}
                value={selectedSubject}
                loading={subjectLoader}
                loadingMessage={"loading subjects"}
                onChange={setSelectedSubject}
                placeholder="Search subjects..."
                isSearchable
                isDisabled={!!selectedSubject}
                styles={customSelectStyles}
              />
            </div>

            {selectedSubject && (
              <button
                type="button"
                onClick={addScheduleEntry}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Schedule
              </button>
            )}
            <div className='grid grid-cols-2 gap-4'>
            {scheduleEntries.map((entry, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4 border-gray-200 min-w-[25rem]">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Weekday
                  </label>
                  <Select
                    options={weekdays}
                    value={entry.weekday}
                    onChange={(selected) => updateScheduleEntry(index, 'weekday', selected)}
                    placeholder="Select weekday..."
                    styles={customSelectStyles}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Start Time
                    </label>
                    <DatePicker
                      selected={entry.startTime}
                      onChange={(date) => updateScheduleEntry(index, 'startTime', date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      dateFormat="h:mm aa"
                      className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
                      placeholderText="Select start time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      End Time
                    </label>
                    <DatePicker
                      selected={entry.endTime}
                      onChange={(date) => updateScheduleEntry(index, 'endTime', date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      dateFormat="h:mm aa"
                      className="w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none"
                      placeholderText="Select end time"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Teachers
                  </label>
                  <Select
                    isMulti
                    options={teachers}
                    value={entry.selectedTeachers}
                    onChange={(selected) => updateScheduleEntry(index, 'selectedTeachers', selected)}
                    placeholder="Select teachers..."
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            ))}
            </div>
          </div>

          {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 mt-6">
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
              disabled={loading || scheduleEntries.length === 0}
            >
              {loading && <Loader loading={true} size={10} />}
              Create Schedules
            </button>
          </div>
        </form>
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

export default CreateScheduleModal;