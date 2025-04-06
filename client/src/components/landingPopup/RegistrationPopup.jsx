import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownComponent from '../../utils/Dropdown';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentPopup = ({ setShowPopup }) => {
  const navigate = useNavigate();
  const [role, setrole] = useState('student');
  const [departmentEnabled, setDepartmentEnabled] = useState(true);
  const [levelEnabled, setLevelEnabled] = useState(false);
  const [programEnabled, setProgramEnabled] = useState(false);
  const [courseEnabled, setCourseEnabled] = useState(false);
  const [semesterEnabled, setSemesterEnabled] = useState(false);

  const [departmentId, setDepartmentId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [semesterId, setSemesterId] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const handleRegister = async () => {
    try {
      const requestData = role === 'student'
        ? { name, phone, email, password, rollNumber, registrationNumber, departmentId, levelId, programId, courseId, semesterId }
        : { name, phone, email, password };

      const response = await axios.post(`http://localhost:8080/api/auth/${role}/register`, requestData);
      toast.success('Registration successful!');
      setShowPopup(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">User Registration</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">User Type</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="student" checked={role === 'student'} onChange={() => setrole('student')} />
              Student
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="teacher" checked={role === 'teacher'} onChange={() => setrole('teacher')} />
              Teacher
            </label>
          </div>
        </div>

        {role === 'student' && (
          <>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <DropdownComponent onOffState={departmentEnabled} setOn={setLevelEnabled} getOnChangeValue={setDepartmentId} apiUrl={`http://localhost:8080/api/admin/departments`} isAddOther={false} />

            <label className="block text-sm font-medium text-gray-700">Level</label>
            <DropdownComponent onOffState={levelEnabled} setOn={setProgramEnabled} getOnChangeValue={setLevelId} apiUrl={departmentId ? `http://localhost:8080/api/admin/levels/${departmentId}` : null} isAddOther={false} />

            <label className="block text-sm font-medium text-gray-700">Program</label>
            <DropdownComponent onOffState={programEnabled} setOn={setCourseEnabled} getOnChangeValue={setProgramId} apiUrl={levelId ? `http://localhost:8080/api/admin/programs/${levelId}` : null} isAddOther={false} />

            <label className="block text-sm font-medium text-gray-700">Course</label>
            <DropdownComponent onOffState={courseEnabled} setOn={setSemesterEnabled} getOnChangeValue={setCourseId} apiUrl={programId ? `http://localhost:8080/api/admin/courses/${programId}` : null} isAddOther={false} />

            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <DropdownComponent onOffState={semesterEnabled} getOnChangeValue={setSemesterId} apiUrl={courseId ? `http://localhost:8080/api/admin/semesters/${courseId}` : null} isAddOther={false} />

            <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4 mt-4" />
            <input type="text" placeholder="Registration Number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
          </>
        )}

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mb-4" />

        <div className="flex justify-end gap-4">
          <button onClick={() => setShowPopup(false)} className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer">Cancel</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer">Register</button>
        </div>
      </div>
    </div>
  );
};

export default StudentPopup;
