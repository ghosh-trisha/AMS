import React from 'react';
import logo from '../../assets/logo.png';
import { useRole } from '../contexts/roleContext';
import Cookies from "js-cookie";
import {useNavigate} from 'react-router-dom'


const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.name ? payload.name : null,
      email: payload.email ? payload.email : null
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};


const TopBar = () => {
  const { role, setRole } = useRole();
const navigate=useNavigate();
  const accessToken = Cookies.get('accessToken');
  // console.log("Access Token:", accessToken);
  const decodedAccess = decodeToken(accessToken);
  const userName = decodedAccess?.name || "User";
  const userEmail = decodedAccess?.email || "user@gmail.com";

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
        <div className="mr-4 text-right">
          <p className="text-sm capitalize">{userName}</p>
          <p className="text-xs text-gray-400">{userEmail}</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded cursor-pointer" onClick={
          () => {
            Object.keys(Cookies.get()).forEach(function(cookieName) {
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
