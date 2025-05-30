import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GraduationCap, Mail, Phone, User, FileText } from 'lucide-react';
import { AiOutlineIdcard } from 'react-icons/ai';
import { useSession } from '../../components/contexts/sessionContext';
import { motion } from 'framer-motion';

const StudentDashboardPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedSession } = useSession();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`http://localhost:8080/api/auth/student/getInfo/${selectedSession}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentData(response.data.data);
      } catch (error) {
        console.error('Error fetching student info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [selectedSession]);

  return (
    // 🆕 Wrap outer container with motion.div
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">👋 Welcome, Student </h1>
        <p className="text-gray-500">Have a great learning day!</p>
      </motion.div>

      {loading && (
        <div className="p-6 grid gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      )}

      {!loading && !studentData && (
        <div className="p-6 text-center text-red-600 font-semibold">No student data available.</div>
      )}

      {!loading && studentData && (<>
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-xl rounded-2xl border-t-4 border-indigo-400 p-6"
        >
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
            <User className="h-6 w-6" /> Personal Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold"> <Mail className="inline-block mr-2" /> Email:</span> {studentData.email}</p>
            <p><span className="font-semibold"> <Phone className="inline-block mr-2" /> Phone:</span> {studentData.phone}</p>
            <p><span className="font-semibold"> <AiOutlineIdcard className="inline-block mr-2 text-2xl" /> Roll Number:</span> {studentData.rollNumber}</p>
            <p><span className="font-semibold"> <FileText className="inline-block mr-2" /> Registration No:</span> {studentData.registrationNumber}</p>
          </div>
        </motion.div>

        {/* Academic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow-xl rounded-2xl border-t-4 border-green-400 p-6"
        >
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6" /> Academic Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Department:</span> {studentData.departmentName}</p>
            <p><span className="font-semibold">Program:</span> {studentData.programName}</p>
            <p><span className="font-semibold">Course:</span> {studentData.courseName}</p>
            <p><span className="font-semibold">Level:</span> {studentData.levelName}</p>
            <p><span className="font-semibold">Semester:</span> {studentData.semesterName}</p>
            <p><span className="font-semibold">Session:</span> {studentData.sessionName}</p>
            <p><span className="font-semibold">Verified:</span> {studentData.isVerified ? 'Yes' : 'No'}</p>
          </div>
        </motion.div>

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow-xl rounded-2xl border-t-4 border-purple-400 p-6"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-4">📚 Subjects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {studentData.syllabus.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="border border-purple-200 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-r from-white via-purple-50 to-white"
              >
                <p className="text-lg font-semibold text-gray-800">{subject.subjectName}</p>
                <p className="text-sm text-gray-600">Code: {subject.subjectCode}</p>
                <span className="inline-block mt-2 text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  {subject.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>)}
    </motion.div>
  );
};

export default StudentDashboardPage;
