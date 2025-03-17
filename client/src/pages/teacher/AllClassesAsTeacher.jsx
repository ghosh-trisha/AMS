import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TodaysClassesForTeacher = () => {
  const { teacherId } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`/api/v1/teacher/${teacherId}/todays-classes`);
        let classesData = res.data.data || [];
        // Sort by start_time in increasing order
        classesData.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setClasses(classesData);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Today's Classes</h1>
      {classes.length === 0 ? (
        <div>No classes scheduled for today.</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Subject Name</th>
              <th className="px-4 py-2">Subject Code</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Academic Year</th>
              <th className="px-4 py-2">Semester</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Program</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{cls.day}</td>
                <td className="px-4 py-2">
                  {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-2">
                  {new Date(cls.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-2">{cls.subjectName}</td>
                <td className="px-4 py-2">{cls.subjectCode}</td>
                <td className="px-4 py-2">{cls.subjectCategory}</td>
                <td className="px-4 py-2">{cls.academicYear}</td>
                <td className="px-4 py-2">{cls.semesterName}</td>
                <td className="px-4 py-2">{cls.courseName}</td>
                <td className="px-4 py-2">{cls.programName}</td>
                <td className="px-4 py-2">{cls.levelName}</td>
                <td className="px-4 py-2">{cls.departmentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodaysClassesForTeacher;
