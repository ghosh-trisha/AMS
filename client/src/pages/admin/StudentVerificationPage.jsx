import React, { useEffect, useState } from "react";
import Select from "react-select"; // <-- Import Select
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const StudentVerificationPage = () => {
    const [data, setData] = useState([]);
    const [totalStudents, setTotalStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🌟 Add filter states
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);

    // 🌟 Global Search
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/students/all/verify/status");
            setTotalStudents(response.data.totalStudents || 0);
            setData(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateVerifyStatus = async (studentId, isVerified) => {
        try {
            await axios.post("http://localhost:8080/api/admin/students/all/verify/status", {
                studentId, isVerified
            });
            await fetchStudents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update verification status");
            console.error("Failed to update verification status:", error);
        }
    };

    // 🌟 Prepare Options for Dropdowns
    const getUniqueOptions = (field) => {
        const uniqueValues = [...new Set(data.map(student => student[field]).filter(Boolean))];
        return uniqueValues.map(value => ({ value, label: value }));
    };

    // 🌟 Filter the data based on selected dropdowns and search query
    const filteredStudents = data.filter(student => {
        const searchFields = [
            student.name, student.email, student.phone,
            student.departmentName, student.levelName,
            student.programName, student.courseName,
            student.semesterName
        ];
        const isMatch = searchFields.some(field =>
            field && typeof field === 'string' && field.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            (!selectedDepartment || student.departmentName === selectedDepartment.value) &&
            (!selectedLevel || student.levelName === selectedLevel.value) &&
            (!selectedProgram || student.programName === selectedProgram.value) &&
            (!selectedCourse || student.courseName === selectedCourse.value) &&
            (!selectedSemester || student.semesterName === selectedSemester.value) &&
            isMatch // Apply the global search filter
        );
    });

    const renderStudents = () => {
        return (
            <div>
                {filteredStudents.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student, index) => (
                                <motion.div
                                    key={`${student.studentId}-${index}`}
                                    className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-pink-800 bg-pink-100 p-1 pl-2 rounded-xl mb-1">{student.name}</h2>
                                        <p className="text-sm text-gray-600">Email: {student.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                                        <p className="text-sm mt-1">
                                            Status: <span className="text-red-600 font-semibold">Not Verified</span>
                                        </p>
                                        <p className="text-sm mt-1">Department: <span className="font-semibold">{student.departmentName}</span></p>
                                        <p className="text-sm">Level: <span className="font-semibold">{student.levelName}</span></p>
                                        <p className="text-sm">Program: <span className="font-semibold">{student.programName}</span></p>
                                        <p className="text-sm">Course: <span className="font-semibold">{student.courseName}</span></p>
                                        <p className="text-sm">Semester: <span className="font-semibold">{student.semesterName}</span></p>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, 1)}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, 2)}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center text-gray-500">No students found.</div>
                )}
            </div>
        );
    };

    return (
        <motion.div className="p-6 max-w-7xl mx-auto">
            <motion.h1
                className="text-4xl font-extrabold mb-2 text-gray-900 text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                🔎 Verify Your Students 🔍
            </motion.h1>
            {/* <motion.p className="text-center text-lg text-gray-600 mb-6"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Review and verify your below students
            </motion.p> */}
            <div className="flex justify-center items-center mb-6">
                <motion.p
                    className="text-lg text-gray-600"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Review and verify your below students
                </motion.p>

                {/* Total Students count on the right side */}
                <div className="text-lg text-gray-600 font-medium"><span className="pl-4"> ( {totalStudents} ) </span>
                </div>
            </div>

            {/* 🌟 Dropdown Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <Select
                    options={getUniqueOptions('departmentName')}
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    placeholder="Select Department"
                    isClearable
                />
                <Select
                    options={getUniqueOptions('levelName')}
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                    placeholder="Select Level"
                    isClearable
                />
                <Select
                    options={getUniqueOptions('programName')}
                    value={selectedProgram}
                    onChange={setSelectedProgram}
                    placeholder="Select Program"
                    isClearable
                />
                <Select
                    options={getUniqueOptions('courseName')}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    placeholder="Select Course"
                    isClearable
                />
                <Select
                    options={getUniqueOptions('semesterName')}
                    value={selectedSemester}
                    onChange={setSelectedSemester}
                    placeholder="Select Semester"
                    isClearable
                />
                {/* 🌟 Global Search Bar */}
                <input
                    type="text"
                    placeholder="📱Search by any field (Name, Email, Phone, etc.)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>


            {loading ? (
                <div className="p-6 grid gap-4 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-32 bg-gray-200 rounded w-full"></div>
                </div>
            ) : (
                renderStudents()
            )}
        </motion.div>
    );
};

export default StudentVerificationPage;

