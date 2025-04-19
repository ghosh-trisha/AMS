import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import Loader from "../../components/basic/Loader";
import axios from "axios";
import ClassroomInfo from "../../components/classroom/ClassroomInfoCard";
import SyllabusesCard from "../../components/classroom/SyllabusesCard";
import SessionCard from "../../components/classroom/SessionCard";

const DetailedDemoClassroom = () => {
  const { semesterId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPapers, setShowPapers] = useState(false);
  const [showRoutine, setshowRoutine] = useState(false);
  const [showCurrSession, setshowCurrSession] = useState(false);
  const [showPrevSession, setshowPrevSession] = useState(false);
  const [papers, setPapers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState(null);

  const [currSessionId, setCurrSessionId] = useState(null);

  const demoPapers = [
    {
      _id: "1",
      subject: { name: "Data Structures", code: "CS201" }
    },
    {
      _id: "2",
      subject: { name: "Algorithms", code: "CS202" }
    },
    {
      _id: "3",
      subject: { name: "Database Systems", code: "CS203" }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPapers(demoPapers);
      setLoading(false);
    }, 500);
  }, [semesterId]);

  const handleDeletePaper = (e) => {
    e.preventDefault();
    setPapers(papers.filter(paper => paper._id !== paperToDelete));
    setShowDeleteModal(false);
  };

  const handlePaperAdded = (newPaper) => {
    setPapers([...papers, newPaper]);
  };

  const handleCreateSchedule = () => {
    // Demo schedule creation logic
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Classroom Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ClassroomInfo semesterId={semesterId} currSessionId={currSessionId} />
      </motion.div>

      {/* Syllabuses Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SyllabusesCard semesterId={semesterId} />
      </motion.div>

      {/* Sessions Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SessionCard semesterId={semesterId} setCurrSessionId={setCurrSessionId} />
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-4">Delete Paper</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this paper? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePaper}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DetailedDemoClassroom;
