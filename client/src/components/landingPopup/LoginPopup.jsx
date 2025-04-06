import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useRole } from '../contexts/roleContext'

const LoginPopup = ({ setShowPopup }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');  
  const [identifier, setIdentifier] = useState(''); // Email, Roll, or Reg Number for students
  const [password, setPassword] = useState('');
  const roleContext=useRole();
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      return {
       exp: payload.exp ? payload.exp * 1000 : null,
       role: payload.role ? payload.role : null
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/auth/${role}/login`, {
        identifier,
        password,
      });

      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;

      // Decode the tokens
      const decodedAccess = decodeToken(accessToken);
      const decodedRefresh = decodeToken(refreshToken);

      if (decodedAccess.exp) {
        Cookies.set("accessToken", accessToken, { expires: new Date(decodedAccess.exp) });
      }
      if (decodedRefresh.exp) {
        Cookies.set("refreshToken", refreshToken, { expires: new Date(decodedRefresh.exp) });
      }
      Cookies.set("role", decodedAccess.role, { expires: new Date(decodedRefresh.exp) });
     
      roleContext.setRole(decodedAccess.role);

      toast.success('Login successful!');
      setShowPopup(false);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      // toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
              className="mr-2"
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              value="teacher"
              checked={role === 'teacher'}
              onChange={() => setRole('teacher')}
              className="mr-2"
            />
            Teacher
          </label>
        </div>

        <input
          type="text"
          placeholder={role === 'student' ? 'Email / Roll / Registration Number' : 'Email'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <div className="flex justify-end gap-4">
          <button onClick={() => setShowPopup(false)} className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer">
            Cancel
          </button>
          <button onClick={handleLogin} className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
