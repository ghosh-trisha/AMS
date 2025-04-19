import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion'; 

const TodaysClassesForTeacher = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teacher/classes/${teacherId}`);
        let classesData = res.data.data || [];
        classesData.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
        setClasses(classesData);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  const handleCardClick = (cls) => {
    navigate(`/teacher/requests/${cls.classId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center text-blue-700"
        >
          📚 Today's Classes
        </motion.h1>
        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-10 bg-gray-200 rounded w-2/3 mx-auto"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="h-6 bg-gray-200 rounded w-1/2 mx-auto"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="h-32 bg-gray-200 rounded w-full mx-auto"
          />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-blue-700"
      >
        📚 Today's Classes
      </motion.h1>
      {classes.length === 0 ? (
        <div className="text-center text-gray-600">No classes scheduled for today.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.map((cls, index) => (
            <motion.div
              key={index}
              onClick={() => handleCardClick(cls)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg p-5 transition-transform hover:scale-105 border hover:border-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <CalendarDays className="w-5 h-5" />
                  <span>{cls.day}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>{cls.startTime} - {cls.endTime}</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                {cls.subjectName} <span className="text-sm text-gray-400">({cls.subjectCode})</span>
              </h2>
              <p className="text-sm text-gray-600 mb-2 italic">{cls.subjectCategory}</p>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Year:</span> {cls.academicYear}</p>
                <p><span className="font-medium">Semester:</span> {cls.semesterName}</p>
                <p><span className="font-medium">Course:</span> {cls.courseName}</p>
                <p><span className="font-medium">Program:</span> {cls.programName}</p>
                <p><span className="font-medium">Level:</span> {cls.levelName}</p>
                <p><span className="font-medium">Department:</span> {cls.departmentName}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TodaysClassesForTeacher;
