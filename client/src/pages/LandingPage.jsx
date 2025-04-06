import React, { useState } from 'react';
import RegistrationPopup from '../components/landingPopup/RegistrationPopup';
import LoginPopup from '../components/landingPopup/LoginPopup';

const LandingPage = () => {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Attendance Monitoring System</h1>
        <p className="text-gray-600 mb-8">Welcome! Please register or log in to continue.</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowRegistrationPopup(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer"
          >
            Register
          </button>
          <button
            onClick={() => setShowLoginPopup(true)}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>

      {showRegistrationPopup && <RegistrationPopup setShowPopup={setShowRegistrationPopup} />}
      {showLoginPopup && <LoginPopup setShowPopup={setShowLoginPopup} />}
    </div>
  );
};

export default LandingPage;