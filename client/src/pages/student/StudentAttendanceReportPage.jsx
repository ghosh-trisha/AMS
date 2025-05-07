import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from '../../components/contexts/sessionContext';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Loader from "../../components/basic/Loader"; 



const StudentAttendancePage = () => {
  const { studentId } = useParams();
  const { selectedSession } = useSession();
  const [totalAttendance, setTotalAttendance] = useState(null);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedAttendance, setDetailedAttendance] = useState([]);
  const [studentData, setStudentData] = useState(null);
  

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        // Fetch total attendance
        const totalRes = await axios.get(
          `http://localhost:8080/api/student/attendance/total/${studentId}/${selectedSession}`,
        );
        setTotalAttendance(totalRes.data.data);
        setStudentData(totalRes.data.studentData); 

        // Fetch subject-wise attendance
        const subjectRes = await axios.get(
          `http://localhost:8080/api/student/attendance/subject/${studentId}/${selectedSession}`,
        );
        setSubjectAttendance(subjectRes.data.data);

        // Fetch detailed attendance
        const detailedRes = await axios.get(
          `http://localhost:8080/api/student/attendance/details/${studentId}/${selectedSession}`
        );
        setDetailedAttendance(detailedRes.data.data);

      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedSession, studentId]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={20} fontWeight="semi-bold" >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatStatus = (status) => {
    if (status === 'accepted') return 'Present';
    if (status === 'rejected') return 'Absent';
    if (status === 'pending') return 'Pending';
    return 'Absent';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-5xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold text-center text-indigo-700">📝 Detailed Attendance Report</h1>

      {loading && <Loader />}

      {/* 📌 Overall Attendance Section */}
      {!loading && totalAttendance && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-md border-l-4 border-fuchsia-500"
        >
          <h2 className="text-xl font-semibold text-fuchsia-600 ">📊 Overall Attendance</h2>
          
          {/* 📌 Flex layout for text and chart */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="">
              <p><strong>Name:</strong> {studentData.name}</p>
              <p><strong>Roll No:</strong> {studentData.rollNumber}</p>
              <p><strong>Registration No:</strong> {studentData.registrationNumber}</p>
              <p><strong>Total Classes:</strong> {totalAttendance.totalClasses}</p>
              <p><strong>Attended Classes:</strong> {totalAttendance.attendedClasses}</p>
              <p><strong>Attendance Percentage:</strong> {totalAttendance.attendancePercentage}%</p>
            </div>

            {/* 📌 Pie Chart Section */}
            <ResponsiveContainer width={170} height={170} >
              <PieChart width={200} height={200}>
                <Pie
                  data={[
                    { name: 'Attended', value: totalAttendance.attendedClasses },
                    { name: 'Missed', value: totalAttendance.totalClasses - totalAttendance.attendedClasses },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  dataKey="value"
                >
                  <Cell fill="#16a34a" /> {/* green for attended */}
                  <Cell fill="#dc2626" /> {/* red for missed */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* 📌 Subject-wise Attendance Section */}
      {!loading && subjectAttendance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"
        >
          <h2 className="text-xl font-semibold text-green-600 mb-4">📚 Subject-wise Attendance</h2>
          <div className="flex flex-col gap-4">
            {subjectAttendance.map((subject, index) => (
              <motion.div
                key={subject.subjectId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between gap-6">
                  <span className="font-bold text-gray-800">{subject.subjectName}</span>
                  <span><strong>Total:</strong> {subject.totalClasses}</span>
                  <span><strong>Attended:</strong> {subject.attendedClasses}</span>
                  <span><strong>Percentage:</strong> {subject.attendancePercentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ✅Detailed Attendance Table */}
      {!loading && detailedAttendance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 overflow-x-auto"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-4">📅 Detailed Attendance Log</h2>
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Subject (Code)</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {detailedAttendance.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{entry.subjectName} ({entry.subjectCode})</td>
                  <td className="px-4 py-2 border">{entry.category}</td>
                  <td className="px-4 py-2 border">{entry.date}</td>
                  <td className="px-4 py-2 border">{entry.startTime} - {entry.endTime}</td>
                  <td className="px-4 py-2 border">
                    <span className={
                      entry.status === 'accepted' ? 'text-green-600 font-medium' :
                      entry.status === 'rejected' ? 'text-red-600 font-medium' :
                      'text-yellow-600 font-medium'
                    }>
                      {formatStatus(entry.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}


    </motion.div>
  );
};

export default StudentAttendancePage;
