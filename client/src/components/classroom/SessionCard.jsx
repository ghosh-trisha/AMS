import React, { useState, useEffect } from "react";
import axios from "axios";

const SessionCard = ({ semesterId }) => {
  const [showRoutine, setShowRoutine] = useState(false);
  const [showCurrSession, setShowCurrSession] = useState(false);
  const [showPrevSession, setShowPrevSession] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/sessions/${semesterId}`);
        console.log("Fetched sessions:", res.data.data);
        // Assuming the response structure:
        // { status: 'success', data: { currentSession, previousSessions }, results: <number> }
        setSessionData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [semesterId]);

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { currentSession, previousSessions } = sessionData || {};

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
      <button
        onClick={() => setShowRoutine(!showRoutine)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-semibold flex items-center justify-between">
          Sessions
          <button className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
            Create Session
          </button>
          <span className={`transform transition-transform ${showRoutine ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </h2>
      </button>

      {showRoutine && (
        <div className="px-6 pb-4 grid grid-cols-1 gap-6 text-left">
          {/* Current Session */}
          <div
            className="p-4 bg-gray-100 rounded-lg"
            onClick={() => setShowCurrSession(!showCurrSession)}
          >
            <h3 className="text-xl font-semibold flex items-center justify-between">
              Current Session
              <span className={`transform transition-transform ${showCurrSession ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </h3>

            {showCurrSession && currentSession && (
              <div className="mt-4 space-y-6">
                {/* Session Details */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Session Details</h4>
                  <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-800">
                      <strong>Academic Year:</strong> {currentSession.academicYear}
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Syllabus:</strong> {currentSession.syllabusId?.name}
                    </p>
                  </div>
                </div>

                {/* Class Routine Section (static demo data) */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Class Routine</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Time/Day</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Monday</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Tuesday</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Wednesday</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Thursday</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-600">Friday</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 text-sm text-gray-600">9:00 AM - 10:00 AM</td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Data Structures (CS201)</div>
                            <div className="text-xs text-gray-500">Prof. John Doe</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Algorithms (CS202)</div>
                            <div className="text-xs text-gray-500">Prof. Jane Smith</div>
                          </td>
                          <td className="p-3 bg-gray-50"></td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Database Systems (CS203)</div>
                            <div className="text-xs text-gray-500">Prof. Alan Turing</div>
                          </td>
                          <td className="p-3 bg-gray-50"></td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 text-sm text-gray-600">10:00 AM - 11:00 AM</td>
                          <td className="p-3 bg-gray-50"></td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Data Structures (CS201)</div>
                            <div className="text-xs text-gray-500">Prof. John Doe</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Algorithms (CS202)</div>
                            <div className="text-xs text-gray-500">Prof. Jane Smith</div>
                          </td>
                          <td className="p-3 bg-gray-50"></td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Database Systems (CS203)</div>
                            <div className="text-xs text-gray-500">Prof. Alan Turing</div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 text-sm text-gray-600">11:00 AM - 12:00 PM</td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Algorithms (CS202)</div>
                            <div className="text-xs text-gray-500">Prof. Jane Smith</div>
                          </td>
                          <td className="p-3 bg-gray-50"></td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Database Systems (CS203)</div>
                            <div className="text-xs text-gray-500">Prof. Alan Turing</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-800">Data Structures (CS201)</div>
                            <div className="text-xs text-gray-500">Prof. John Doe</div>
                          </td>
                          <td className="p-3 bg-gray-50"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Previous Session */}
          <div
            className="p-4 bg-gray-100 rounded-lg"
            onClick={() => setShowPrevSession(!showPrevSession)}
          >
            <h3 className="mb-4 text-xl font-semibold flex items-center justify-between">
              Previous Session
              <span className={`transform transition-transform ${showPrevSession ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </h3>
            {showPrevSession && previousSessions && (
              <div className="px-6 pb-4 grid grid-cols-5 gap-6 bg-gray-100">
                {previousSessions.map((year, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h5 className="font-medium text-gray-800">{year}</h5>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
