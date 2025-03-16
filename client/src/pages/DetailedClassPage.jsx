import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/basic/Loader";
import axios from "axios";
import ClassroomInfo from "../components/classroom/ClassroomInfoCard";
import SyllabusesCard from "../components/classroom/SyllabusesCard";
import SessionCard from "../components/classroom/SessionCard";

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

//   if (!classroom) {
//     return <div className="p-6">Classroom not found</div>;
//   }

  return (
    <div className="p-6">
      {/* Classroom Header Section */}
      <ClassroomInfo semesterId={semesterId}/>

      {/* Syllabuses Section */}
      <SyllabusesCard semesterId={semesterId}  />

      {/* Sessions Section */}
      <SessionCard semesterId={semesterId} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Delete Paper</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this paper? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePaper}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedDemoClassroom;