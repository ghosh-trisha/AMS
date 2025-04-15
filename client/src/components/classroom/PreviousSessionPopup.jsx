// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import RoutineTable from "./RoutineTable";
// import Loader from "../basic/Loader";

// const PreviousSessionPopup = ({ session, onClose, semesterId }) => {
//     const [classroom, setClassroom] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchClassroom = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:8080/api/admin/semesters/d/${semesterId}`);
//                 setClassroom(res.data.data);
//             } catch (error) {
//                 console.error("Failed to fetch classroom data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (semesterId) {
//             fetchClassroom();
//         }
//     }, [semesterId]);

//     if (loading) return <Loader loading={loading} />;
//     if (!classroom) return null;

//     return (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-[1px]">
//             <div className="bg-gray-100 w-full max-w-5xl p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
//                 {/* Close Button */}
//                 <button
//                     className="absolute top-4 right-4 w-10 h-10 rounded-md bg-red-200 hover:bg-red-500 text-gray-700 hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-md"
//                     onClick={onClose}
//                     aria-label="Close"
//                 >
//                     &times;
//                 </button>



//                 {/* Header Info */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                     <div>
//                         <h2 className="text-lg font-semibold">Department</h2>
//                         <p>{classroom.department?.name}</p>
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold">Level</h2>
//                         <p>{classroom.level?.name}</p>
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold">Program</h2>
//                         <p>{classroom.program?.name}</p>
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold">Course</h2>
//                         <p>{classroom.course?.name}</p>
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold">Semester</h2>
//                         <p>{classroom.semester?.name}</p>
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold">Academic Year</h2>
//                         <p>{session.academicYear}</p>
//                     </div>
//                 </div>

//                 {/* Subjects */}
//                 <div className="mb-6">
//                     <h3 className="text-xl font-semibold mb-4">Subjects</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {session.subjects && session.subjects.length > 0 ? (
//                             session.subjects.map((subject) => (
//                                 <div
//                                     key={subject._id}
//                                     className="group flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-200 transition-colors"
//                                 >
//                                     <div>
//                                         <h3 className="font-medium">{subject.name}</h3>
//                                         <p className="text-xs text-gray-500">{subject?.categoryId?.name || "No Category"}</p>
//                                     </div>
//                                     <p className="text-md text-gray-600 font-bold">{subject.code.toUpperCase()}</p>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-500 col-span-full">No subjects found.</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Routine */}
//                 <div>
//                     <h3 className="text-xl font-semibold mb-4">Class Routine</h3>
//                     <RoutineTable sessionId={session.id} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PreviousSessionPopup;


import React, { useEffect, useState } from "react";
import axios from "axios";
import RoutineTable from "./RoutineTable";
import Loader from "../basic/Loader";

const PreviousSessionPopup = ({ session, onClose, semesterId }) => {
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/admin/semesters/d/${semesterId}`);
                setClassroom(res.data.data);
            } catch (error) {
                console.error("Failed to fetch classroom data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (semesterId) {
            fetchClassroom();
        }
    }, [semesterId]);

    if (loading) return <Loader loading={loading} />;
    if (!classroom) return null;

    return (
        <div className="fixed inset-0 z-50 bg-opacity-50 flex justify-center items-center backdrop-blur-[1px]">
            <div className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-md bg-red-200 hover:bg-red-500 text-gray-700 hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-md"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Details Card */}
                <div className="mb-6 bg-blue-600 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-white">Classroom Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
                        <div>
                            <h2 className="text-sm font-semibold ">Department</h2>
                            <p className="text-base">{classroom.department?.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold ">Level</h2>
                            <p className="text-base">{classroom.level?.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold ">Program</h2>
                            <p className="text-base">{classroom.program?.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold ">Course</h2>
                            <p className="text-base">{classroom.course?.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold ">Semester</h2>
                            <p className="text-base">{classroom.semester?.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold ">Academic Year</h2>
                            <p className="text-base">{session.academicYear}</p>
                        </div>
                    </div>
                </div>

                {/* Subjects Card */}
                <div className="mb-6 bg-gray-100 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Subjects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {session.subjects && session.subjects.length > 0 ? (
                            session.subjects.map((subject) => (
                                <div
                                    key={subject._id}
                                    className="group flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    <div>
                                        <h3 className="font-medium">{subject.name}</h3>
                                        <p className="text-xs text-gray-500">{subject?.categoryId?.name || "No Category"}</p>
                                    </div>
                                    <p className="text-md text-gray-600 font-bold">{subject.code.toUpperCase()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No subjects found.</p>
                        )}
                    </div>
                </div>

                {/* Routine Card */}
                <div className="bg-gray-100 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Class Routine</h3>
                    <RoutineTable sessionId={session.id} />
                </div>
            </div>
        </div>
    );
};

export default PreviousSessionPopup;
