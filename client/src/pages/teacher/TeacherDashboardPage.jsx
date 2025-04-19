import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Mail, Phone, User } from 'lucide-react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';  

const TeacherDashboardPage = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get("http://localhost:8080/api/auth/teacher/getInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeacherData(response.data.data);
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherInfo();
  }, []);

  return (
    <div className="p-6 bg-gray-50 flex flex-col items-center"> {/* Removed min-h-screen */}
      {/* Header - Always visible even during loading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
          👨‍🏫 Welcome{teacherData ? `, ${teacherData.name}` : ''}
        </h1>
        <p className="text-gray-500">Have a great teaching day!</p>
      </motion.div>

      {loading ? (
        <div className="p-6 grid gap-4 animate-pulse w-full max-w-4xl">
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl space-y-8"
        >
          {teacherData ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-xl rounded-2xl border-t-4 border-indigo-400 p-6"
              >
                <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
                  <User className="h-6 w-6" /> Personal Info
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                  <p><span className="font-semibold"><Mail className="inline-block mr-2" />Email:</span> {teacherData.email}</p>
                  <p><span className="font-semibold"><Phone className="inline-block mr-2" />Phone:</span> {teacherData.phone}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white shadow-xl rounded-2xl border-t-4 border-amber-400 p-6"
              >
                <h2 className="text-2xl font-bold text-amber-700 flex items-center gap-2 mb-4">
                  <FaChalkboardTeacher className="h-6 w-6" /> Teaching Info
                </h2>
                <p className="text-gray-500">Teaching details will appear here in future updates like the classes which are taught by him.</p>
              </motion.div>
            </>
          ) : (
            <div className="p-6 text-center text-red-600 font-semibold">No teacher data available.</div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
