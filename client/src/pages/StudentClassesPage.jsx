import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../components/basic/Loader';
import { format, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';

const StudentClassesPage = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState({}); // Track loading state per class

  // Fetch today's classes for the student
  const fetchTodaysClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/student/classes/${id}`);
      setClasses(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance for a specific class
  const handleMarkAttendance = async (index) => {
    try {
      // Set loading state for this specific class
      // setAttendanceLoading((prev) => ({ ...prev, [classId]: true }));

      // Simulate API call to mark attendance
      // await axios.post(`http://localhost:8080/api/student/attendance`, {
      //   classId,
      //   studentId: id,
      // });

      // Simulate a delay for demonstration
      setTimeout(() => {
        toast.success('Attendance marked successfully!');
        // Update the class to show "Pending" state


        setClasses((prevClasses) =>
          prevClasses.map((cls,ind) =>
            ind === index ? { ...cls, attendanceStatus: 'pending' } : cls
          )
        );
      }, 200); // 2-second delay
    } catch (error) {
      toast.error('Failed to mark attendance');
    } finally {
      // Reset loading state for this specific class
      // setAttendanceLoading((prev) => ({ ...prev, [classId]: false }));
    }
  };

  // Format time to a readable format
  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      return format(parseISO(time), 'h:mm a');
    } catch {
      return time; // Fallback for non-ISO formats
    }
  };

  useEffect(() => {
    fetchTodaysClasses();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading={true} size={20} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Today's Classes</h1>

      <div className="space-y-4 grid grid-cols-2 gap-4">
        {classes.length === 0 ? (
          <div className="text-center text-gray-500">No classes scheduled for today.</div>
        ) : (
          classes.map((cls, index) => (
            <div
              key={index}
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
                        {teacher}
                      </p>
                    ))}
                  </div>
                </div>

                {cls.attendanceStatus === 'pending' ? (
                  <div className="px-4 py-2 bg-yellow-500 text-white rounded-md">
                    Pending
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkAttendance(index)}
                    disabled={attendanceLoading[cls._id]}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {(
                      'Mark Attendance'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentClassesPage;