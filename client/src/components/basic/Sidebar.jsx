import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/admin/organization" 
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Organization
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/student" 
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Student
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/teacher" 
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Teacher
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
