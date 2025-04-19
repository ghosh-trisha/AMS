import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Loader from "../basic/Loader";
import axios from "axios";
import CreateScheduleModal from "./CreateScheduleModal";
import CreateSyllabusModal from "./CreateSllyabusModal";
import CreateSessionModal from "./CreateSessionModal";

const ClassroomInfo = ({ semesterId, currSessionId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSllaybusCreateModal, setSllabusCreateModal] = useState(false);
  const [showSessionCreateModal, setSessionCreateModal] = useState(false);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [classroom, setClassroom] = useState(null);

  const fetchSemesterdata = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/semesters/d/${semesterId}`);
      setClassroom(res.data.data);
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSemesterdata();
  }, [semesterId]);

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (!classroom) {
    return <div className="p-6">Classroom not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-6"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* Section 1 */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold">{classroom.department?.name}</h1>
          <p className="text-blue-100">Department: {classroom.department?.name}</p>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-2"
        >
          <p>Program: {classroom.program?.name}</p>
          <p>Level: {classroom.level?.name}</p>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-2"
        >
          <p>Semester: {classroom.semester?.name}</p>
          <p>Course: {classroom.course?.name}</p>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-col gap-3"
        >
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => setSllabusCreateModal(true)}
          >
            Create new Syllabus
          </button>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => setShowCreateSchedule(true)}
          >
            Add Schedule
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => setSessionCreateModal(true)}
          >
            Create new Session
          </button>
        </motion.div>
      </motion.div>

      {/* Modals */}
      {showSessionCreateModal && (
        <CreateSessionModal onClose={() => setSessionCreateModal(false)} semesterId={semesterId} />
      )}
      {showSllaybusCreateModal && (
        <CreateSyllabusModal onClose={() => setSllabusCreateModal(false)} semesterId={semesterId} />
      )}
      {showCreateSchedule && (
        <CreateScheduleModal
          currSessionId={currSessionId}
          onClose={() => setShowCreateSchedule(false)}
          onScheduleCreated={() => {}}
        />
      )}
    </motion.div>
  );
};

export default ClassroomInfo;
