import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../contexts/roleContext';
import Cookies from "js-cookie";


const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id ? payload.id : null
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};


const Sidebar = () => {
  const { role } = useRole();

  const accessToken = Cookies.get('accessToken');
  const decodedAccess = decodeToken(accessToken);
  const userId = decodedAccess?.id;

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {role === 'admin' && (
            <>
              <li>
                <Link to="/admin/organization" className="block p-2 hover:bg-gray-700 rounded">
                  Organization
                </Link>
              </li>
              <li>
                <Link to="/admin/student" className="block p-2 hover:bg-gray-700 rounded">
                  Student
                </Link>
              </li>
              <li>
                <Link to="/admin/teacher" className="block p-2 hover:bg-gray-700 rounded">
                  Teacher
                </Link>
              </li>
            </>
          )}

          {role === 'student' && (
            <>
              <li>
                <Link to="/student/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to={`/student/todayclasses/${userId}`} className="block p-2 hover:bg-gray-700 rounded">
                  Today's Classes
                </Link>
              </li>
              <li>
                <Link to="/student/attendance" className="block p-2 hover:bg-gray-700 rounded">
                  Attendance Report
                </Link>
              </li>
            </>
          )}

          {role === 'teacher' && (
            <>
              <li>
                <Link to="/teacher/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to={`/teacher/todaysclasses/${userId}`} className="block p-2 hover:bg-gray-700 rounded">
                  Today's Classes
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
