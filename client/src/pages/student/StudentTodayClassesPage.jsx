
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../../components/basic/Loader';
import { format, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useSession } from '../../components/contexts/sessionContext';
import { motion } from 'framer-motion'; 

const StudentClassesPage = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState({}); 
  const { selectedSession } = useSession();

  const fetchTodaysClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/student/classes/${id}/${selectedSession}`);
      if(res.data.data.length === 0) {
        setClasses([]);
      } else {
        setClasses(res.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (index) => {
    try {
      setAttendanceLoading((prev) => ({ ...prev, [index]: true }));
      const cls = classes[index]; 

      const res = await axios.post('http://localhost:8080/api/student/attendance', {
        studentId: id,
        sessionId: cls.sessionId,
        scheduleId: cls.scheduleId,
        subjectId: cls.subjectId
      }); 

      toast.success('Attendance marked successfully!');
      const updatedStatus = res.data.data?.status || 'pending';

      setClasses((prevClasses) =>
        prevClasses.map((item, ind) =>
          ind === index ? { ...item, attendanceStatus: updatedStatus } : item
        )
      );
    } catch (error) {
      toast.error('Failed to mark attendance');
    } finally {
      setAttendanceLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      return format(parseISO(time), 'h:mm a');
    } catch {
      return time;  
    }
  };

  useEffect(() => {
    fetchTodaysClasses();
  }, [id, selectedSession]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Ensuring header is always visible */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        📚 Today's Classes
      </motion.h1>

      {loading ? (
        <div className="p-6 grid gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <motion.div 
          className="space-y-4 grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          {classes.length === 0 ? (
            <div className="text-center text-gray-500">No classes scheduled for today.</div>
          ) : (
            classes.map((cls, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {cls.subjectName} ({cls.subjectCode})
                    </h2>
                    <p className="text-sm text-gray-600">{cls.subjectCategory}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                    </p>
                    <div className="flex justify-center items-center gap-4">
                      {cls.teachers.map((teacher, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {teacher.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  {cls.attendanceStatus ? (
                    <div
                      className={`px-4 py-2 text-white rounded-md capitalize ${getStatusColor(
                        cls.attendanceStatus
                      )}`}
                    >
                      {cls.attendanceStatus}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkAttendance(index)}
                      disabled={attendanceLoading[cls._id]}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      {'Mark Attendance'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StudentClassesPage;
