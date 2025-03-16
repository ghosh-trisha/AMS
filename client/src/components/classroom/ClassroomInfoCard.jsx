import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Loader from "../basic/Loader";
import axios from "axios";
import CreateScheduleModal from "./CreateScheduleModal";

const ClassroomInfo = ({semesterId}) => {

    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddPaperModal, setShowAddPaperModal] = useState(false);
    const [showCreateSchedule, setShowCreateSchedule] = useState(false);
    const [classroom, setClassroom] = useState(null);
  
    
    const fetchSemesterdata = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:8080/api/admin/semesters/d/${semesterId}`);
          setClassroom(res.data.data);
        //   console.log(res.data);
        //   setPapers(res.data.papers);
          setLoading(false);
        } catch (error) {
          setError(error?.response?.data?.message);
          setLoading(false);
          console.log(error);
        }
      }
      useEffect(() => {
          // Simulate loading
          fetchSemesterdata();
         
        }, [semesterId]);


        
          if (loading) {
            return <Loader loading={loading} />;
          }
        
          if (!classroom) {
            return <div className="p-6">Classroom not found</div>;
          }
return (

    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{classroom.department?.name}</h1>
            <p className="text-blue-100">Department: {classroom.department?.name}</p>
          </div>
          <div className="space-y-2">
            <p>Program: {classroom.program?.name}</p>
            <p>Level: {classroom.level?.name}</p>
          </div>
          <div className="space-y-2">
            <p>Semester: {classroom.semester?.name}</p>
            <p>Course: {classroom.course?.name}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => setShowAddPaperModal(true)}
            >
              Add Paper
            </button>
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => setShowCreateSchedule(true)}
            >
              Add Schedule
            </button>
          </div>

          {/* Modals */}
          {showAddPaperModal && (
            <AddPaperModal
              classroomId={id}
              onClose={() => setShowAddPaperModal(false)}
              onPaperAdded={handlePaperAdded}
            />
          )}

          {showCreateSchedule && (
            <CreateScheduleModal
              classroomId={semesterId}
              onClose={() => setShowCreateSchedule(false)}
              onScheduleCreated={()=>{
                
              }}
            />
          )}
        </div>
      </div>
);

}


export default ClassroomInfo;