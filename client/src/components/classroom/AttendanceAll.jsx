import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/sessionContext";

const AttendanceAll = ({ sessionId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setSelectedSession } = useSession();
  setSelectedSession(sessionId);


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/attendance/all/${sessionId}`);
        setAttendanceData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchAttendance();
  }, [sessionId]);

  if (loading) return <p className="text-gray-600">Loading attendance data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Roll Number</th>
            <th className="border px-4 py-2">Registration Number</th>
            <th className="border px-4 py-2">Total Classes</th>
            <th className="border px-4 py-2">Attended Classes</th>
            <th className="border px-4 py-2">Attendance (%)</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((student) => (
              <tr
                key={student.studentId}
                onClick={() => navigate(`/student/attendance/${student.studentId}`)}
                className="hover:bg-yellow-100 cursor-pointer transition duration-150"
              >
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.rollNumber}</td>
                <td className="border px-4 py-2">{student.registrationNumber}</td>
                <td className="border px-4 py-2 text-center">{student.totalClasses}</td>
                <td className="border px-4 py-2 text-center">{student.attendedClasses}</td>
                <td className="border px-4 py-2 text-center">{student.attendancePercentage}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">
                No attendance data found for this session.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceAll;
