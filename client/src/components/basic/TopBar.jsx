import React from 'react';
import logo from '../../assets/logo.png';
import { useRole } from '../contexts/roleContext';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';  
import { useSession } from '../contexts/sessionContext'; 
import axios from 'axios'; 


const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.name ? payload.name : null,
      email: payload.email ? payload.email : null,
      id: payload.id ? payload.id : null  
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};


const TopBar = () => {
  const { role, setRole } = useRole();
  const { selectedSession, setSelectedSession } = useSession(); 
  const [sessions, setSessions] = useState([]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  

  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
  const decodedAccess = decodeToken(accessToken);
  const userName = decodedAccess?.name || "User";
  const userEmail = decodedAccess?.email || "user@gmail.com";
  const userId = decodedAccess?.id;  


  // ✅ Fetch student sessions if role is student
  useEffect(() => {
    const fetchSessions = async () => {
      if (role === 'student' && userId) {
        try {
          const res = await axios.get(`http://localhost:8080/api/student/sessions/${userId}`);
          const currentSessions = res.data?.data?.currentSessions || [];
          setSessions(currentSessions);
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        }
      }
    };

    fetchSessions();
  }, [role, userId]);
  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
  };


  const getPortalName = () => {
    switch (role) {
      case 'admin':
        return 'Admin Portal';
      case 'teacher':
        return 'Teacher Portal';
      case 'student':
        return 'Student Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-10 mr-4"
        />

        <h1 className="text-xl font-semibold">{getPortalName()}</h1>
      </div>
      <div className="flex items-center">

        {/* ✅ Student session dropdown */}
        {role === 'student' && sessions.length > 0 && (
          <div className="relative flex items-center mr-4">
            <div className="relative">
              <select
                className="appearance-none bg-gray-700 text-white px-3 py-1 pr-8 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedSession}
                onChange={(e) => {
                  handleSessionChange(e);
                  setTimeout(() => setIsDropdownOpen(false), 100);   
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                onBlur={() => setIsDropdownOpen(false)}    
              >
                {sessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.academicYear}
                  </option>
                ))}
              </select>

              {/* Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}


        <div className="mr-4 text-right">
          <p className="text-sm capitalize">{userName}</p>
          <p className="text-xs text-gray-400">{userEmail}</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded cursor-pointer" onClick={
          () => {
            Object.keys(Cookies.get()).forEach(function (cookieName) {
              Cookies.remove(cookieName);
            });
            setRole(null);
            navigate("/");
          }
        }>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
