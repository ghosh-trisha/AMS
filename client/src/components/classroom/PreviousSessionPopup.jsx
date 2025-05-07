import React, { useEffect, useState } from "react";
import axios from "axios";
import RoutineTable from "./RoutineTable";
import Loader from "../basic/Loader";
import { motion, AnimatePresence } from "framer-motion";
import AttendanceAll from "./AttendanceAll";

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
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-50 bg-opacity-50 flex justify-center items-center backdrop-blur-[1px]"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 w-10 h-10 rounded-md bg-red-200 hover:bg-red-500 text-gray-700 hover:text-white flex items-center justify-center text-2xl transition-all duration-300 shadow-md"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    {/* Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 bg-blue-600 rounded-lg p-6 shadow-md"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-white">Classroom Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
                            <div>
                                <h2 className="text-sm font-semibold">Department</h2>
                                <p className="text-base">{classroom.department?.name}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">Level</h2>
                                <p className="text-base">{classroom.level?.name}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">Program</h2>
                                <p className="text-base">{classroom.program?.name}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">Course</h2>
                                <p className="text-base">{classroom.course?.name}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">Semester</h2>
                                <p className="text-base">{classroom.semester?.name}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">Academic Year</h2>
                                <p className="text-base">{session.academicYear}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Subjects Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 bg-gray-100 rounded-lg p-6 shadow-md"
                    >
                        <h3 className="text-xl font-semibold mb-4">Subjects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {session.subjects && session.subjects.length > 0 ? (
                                session.subjects.map((subject) => (
                                    <motion.div
                                        key={subject._id}
                                        whileHover={{ scale: 1.02 }}
                                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        <div>
                                            <h3 className="font-medium">{subject.name}</h3>
                                            <p className="text-xs text-gray-500">{subject?.categoryId?.name || "No Category"}</p>
                                        </div>
                                        <p className="text-md text-gray-600 font-bold">{subject.code.toUpperCase()}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full">No subjects found.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Routine Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-100 rounded-lg p-6 shadow-md"
                    >
                        <h3 className="text-xl font-semibold mb-4">Class Routine</h3>
                        <RoutineTable sessionId={session.id} />
                    </motion.div>

                    {/* Attendance report section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-green-800 bg-green-100 rounded-lg p-2">Attendance Report</h4>
                      <AttendanceAll sessionId={session.id}/>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PreviousSessionPopup;
