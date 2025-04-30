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
        subjectId: cls.subjectId,
        classAttendanceId: cls.classAttendanceId,
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
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {/* Animated Page Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-4xl font-extrabold text-blue-800 mb-8 text-center drop-shadow-lg"
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
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          {classes.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full">No classes scheduled for today.</div>
          ) : (
            classes.map((cls, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 relative overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full"></div>
                
                <div className="relative z-10">
                  <h2 className="text-xl text-gray-800 mb-1">
                    <span className="font-bold">{cls.subjectName}</span> ({cls.subjectCode})
                  </h2>
                  <p className="text-sm text-blue-700 mb-1">{cls.subjectCategory}</p>
                  <p className="text-sm text-gray-600 mb-2">Building: {cls.buildingName}</p>
                  <p className="text-sm text-gray-600 mb-2">Room: {cls.roomName}</p>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cls.teachers.map((teacher, idx) => (
                      <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                        {teacher.name}
                      </span>
                    ))}
                  </div>

                  {cls.attendanceStatus ? (
                    <div
                      className={`px-4 py-2 text-white rounded-lg text-center capitalize ${getStatusColor(
                        cls.attendanceStatus
                      )}`}
                    >
                      {cls.attendanceStatus}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkAttendance(index)}
                      disabled={attendanceLoading[cls._id] || !cls.classAttendanceId}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors 
                        ${(!cls.classAttendanceId || attendanceLoading[cls._id]) 
                          ? 'bg-gray-400 cursor-not-allowed text-white' 
                          : 'cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'}
                      `}
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
