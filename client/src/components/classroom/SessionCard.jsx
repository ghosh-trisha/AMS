import React, { useState, useEffect } from "react";
import axios from "axios";
import RoutineTable from "./RoutineTable";
import PreviousSessionPopup from "./PreviousSessionPopup";
import { motion, AnimatePresence } from "framer-motion";
import AttendanceAll from "./AttendanceAll";

const SessionCard = ({ semesterId, setCurrSessionId }) => {
  const [showRoutine, setShowRoutine] = useState(false);
  const [showCurrSession, setShowCurrSession] = useState(false);
  const [showPrevSession, setShowPrevSession] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrevSession, setSelectedPrevSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/sessions/${semesterId}`);
        setSessionData(res.data.data);
        setCurrSessionId(res.data.data.currentSession._id);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [semesterId]);

  if (loading) {
    return (
      <div className="p-6 grid gap-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { currentSession, previousSessions } = sessionData || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden mt-4"
    >
      {/* Toggle Main Routine */}
      <button
        onClick={() => setShowRoutine(!showRoutine)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-semibold flex items-center justify-between cursor-pointer">
          Sessions
          <motion.span
            animate={{ rotate: showRoutine ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </h2>
      </button>

      <AnimatePresence>
        {showRoutine && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 pb-4 grid grid-cols-1 gap-6 text-left overflow-hidden"
          >
            {/* Current Session */}
            <motion.div layout className="p-4 bg-gray-100 rounded-lg">
              <h3
                className={`text-xl font-semibold flex items-center justify-between ${showCurrSession ? 'bg-white p-2 rounded-lg' : ''} cursor-pointer`}
                onClick={() => setShowCurrSession(!showCurrSession)}
              >
                Current Session
                <motion.span
                  animate={{ rotate: showCurrSession ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </h3>

              <AnimatePresence>
                {showCurrSession && currentSession && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 space-y-6 overflow-hidden"
                  >
                    <h4 className="text-lg font-semibold mb-4 text-green-800 bg-green-100 rounded-lg p-2">Academic Year: {currentSession.academicYear}</h4>

                    {/* Subjects Display */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-green-800 bg-green-100 rounded-lg p-2">Subjects</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {currentSession?.subjects?.length > 0 ? (
                            currentSession.subjects.map((subject) => (
                              <motion.div
                                key={subject._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <div>
                                  <h3 className="font-medium">{subject.name}</h3>
                                  <p className="text-xs text-gray-500">{subject?.categoryId?.name || "No Category"}</p>
                                </div>
                                <p className="text-md text-gray-600 font-bold">
                                  {subject.code.toUpperCase()}
                                </p>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500 col-span-full">
                              No subjects available
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Routine section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-green-800 bg-green-100 rounded-lg p-2">Routine</h4>
                      <RoutineTable sessionId={sessionData.currentSession._id} />
                    </div>

                    {/* Attendance report section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-green-800 bg-green-100 rounded-lg p-2">Attendance Report</h4>
                      <AttendanceAll sessionId={currentSession._id}/>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Previous Sessions */}
            <motion.div layout className="p-4 bg-gray-100 rounded-lg">
              <h3
                className={`text-xl font-semibold flex items-center justify-between ${showPrevSession ? 'bg-white p-2 rounded-lg' : ''} cursor-pointer`}
                onClick={() => setShowPrevSession(!showPrevSession)}
              >
                Previous Session
                <motion.span
                  animate={{ rotate: showPrevSession ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </h3>

              <AnimatePresence>
                {showPrevSession && previousSessions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 overflow-hidden"
                  >
                    {previousSessions.map((session, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedPrevSession(session)}
                      >
                        <h5 className="font-medium text-gray-800 text-center">
                          {session.academicYear}
                        </h5>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {selectedPrevSession && (
              <PreviousSessionPopup
                session={selectedPrevSession}
                semesterId={semesterId}
                onClose={() => setSelectedPrevSession(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SessionCard;
