import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TodaysClassesForTeacher = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert "HH:mm" to minutes since midnight
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teacher/classes/${teacherId}`);
        let classesData = res.data.data || [];
        // Sort by start_time in increasing order
        classesData.sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time));
        setClasses(classesData);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  // When a row is clicked, navigate to the attendance request page
  const handleRowClick = (cls) => {
    // We assume each schedule/class document includes an `_id`
    navigate(`/teacher/requests`);
  };

  if (loading) return <div className="text-center py-6">Loading classes...</div>;
  if (error) return <div className="text-center py-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Today's Classes</h1>
      {classes.length === 0 ? (
        <div className="text-center text-gray-600">No classes scheduled for today.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">End Time</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-4 py-3">Subject Code</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Academic Year</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Department</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr
                  key={index}
                  className="border-t cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleRowClick(cls)}
                >
                  <td className="px-4 py-2 text-center">{cls.day}</td>
                  <td className="px-4 py-2 text-center">{cls.start_time}</td>
                  <td className="px-4 py-2 text-center">{cls.end_time}</td>
                  <td className="px-4 py-2 text-center">{cls.subjectName}</td>
                  <td className="px-4 py-2 text-center">{cls.subjectCode}</td>
                  <td className="px-4 py-2 text-center">{cls.subjectCategory}</td>
                  <td className="px-4 py-2 text-center">{cls.academicYear}</td>
                  <td className="px-4 py-2 text-center">{cls.semesterName}</td>
                  <td className="px-4 py-2 text-center">{cls.courseName}</td>
                  <td className="px-4 py-2 text-center">{cls.programName}</td>
                  <td className="px-4 py-2 text-center">{cls.levelName}</td>
                  <td className="px-4 py-2 text-center">{cls.departmentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TodaysClassesForTeacher;
