import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion'; // ✅ Add Framer Motion

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      teacherId: payload.id ? payload.id : null,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const AttendanceRequests = () => {
  const { classId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = Cookies.get('accessToken');
  const decodedAccess = decodeToken(accessToken);
  const teacherId = decodedAccess?.teacherId || "teacherId";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teacher/attendance/${classId}`);
        const rawData = res.data.data || [];

        const formattedData = rawData.map((item) => ({
          _id: item._id,
          studentName: item.studentId.name,
          rollNumber: item.studentId.rollNumber,
          status: item.status,
        }));

        setRequests(formattedData);
      } catch (error) {
        console.error('Failed to fetch attendance requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [classId]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.post('http://localhost:8080/api/teacher/attendance/update', {
        attendanceId: requestId,
        status: newStatus,
        teacherId: teacherId,
      });

      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}:`, error);
    }
  };

  const handleAccept = (requestId) => {
    handleStatusChange(requestId, 'accepted');
  };

  const handleReject = (requestId) => {
    handleStatusChange(requestId, 'rejected');
  };

  return (
    <div className="p-6">
      {/* Heading with Framer Motion */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-blue-700"
      >
        📝 Attendance Requests
      </motion.h1>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full mx-auto"></div>
        </div>
      ) : (
        // Requests Table
        <div>
          {requests.length === 0 ? (
            <div className="text-center text-gray-600">No attendance requests for this class.</div>
          ) : (
            <table className="min-w-full bg-white border rounded-lg shadow-lg">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-center">{req.studentName}</td>
                    <td className="px-4 py-2 text-center">{req.rollNumber}</td>
                    <td className="px-4 py-2 text-center capitalize">{req.status}</td>
                    <td className="px-4 py-2 text-center">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(req._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status === 'accepted' && (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceRequests;
