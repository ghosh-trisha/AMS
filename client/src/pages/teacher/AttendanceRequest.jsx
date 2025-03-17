import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AttendanceRequests = () => {
  const { classId } = useParams(); // schedule _id (demo only)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo data for attendance requests with status field
  const demoRequests = [
    { _id: "1", studentName: "Alice Johnson", rollNumber: "101", status: "pending" },
    { _id: "2", studentName: "Bob Smith", rollNumber: "102", status: "pending" },
    { _id: "3", studentName: "Charlie Brown", rollNumber: "103", status: "rejected" },
    { _id: "4", studentName: "David Lee", rollNumber: "104", status: "pending" },
    { _id: "5", studentName: "Eva Adams", rollNumber: "105", status: "accepted" },
    { _id: "6", studentName: "Alice Johnson", rollNumber: "101", status: "pending" },
    { _id: "7", studentName: "Bob Smith", rollNumber: "102", status: "pending" },
    { _id: "8", studentName: "Charlie Brown", rollNumber: "103", status: "rejected" },
    { _id: "9", studentName: "David Lee", rollNumber: "104", status: "pending" },
    { _id: "10", studentName: "Eva Adams", rollNumber: "105", status: "accepted" }
  ];

  // Define the order for statuses
  const statusOrder = { pending: 1, accepted: 2, rejected: 3 };

  useEffect(() => {
    // Simulate fetching data with a delay
    const timer = setTimeout(() => {
      // Sort demo data based on status order: pending, accepted, rejected
      const sortedRequests = demoRequests.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      setRequests(sortedRequests);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [classId]);

  const handleAccept = (requestId) => {
    // Simulate accepting the request by updating its status
    setRequests(requests.map(req => req._id === requestId ? { ...req, status: 'accepted' } : req));
  };

  const handleReject = (requestId) => {
    // Simulate rejecting the request by updating its status
    setRequests(requests.map(req => req._id === requestId ? { ...req, status: 'rejected' } : req));
  };

  if (loading) return <div className="text-center py-6">Loading requests...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Attendance Requests</h1>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
  );
};

export default AttendanceRequests;
