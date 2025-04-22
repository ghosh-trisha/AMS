import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentVerificationPage = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/students/all/verify/status");
            setData(response.data.data || {});
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

    const renderStudents = (students) => {
        // Separate students into Verified and Not Verified
        const notVerifiedStudents = students.filter(student => !student.isVerified);
        const verifiedStudents = students.filter(student => student.isVerified);
    
        return (
            <div>
                {/* Render Not Verified Students First */}
                {notVerifiedStudents.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-red-600 mb-4 p-2 rounded-2xl bg-red-100">Not Verified Students</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {notVerifiedStudents.map((student, index) => (
                                <div
                                    key={`${student.studentId}-${index}`}
                                    className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h2>
                                        <p className="text-sm text-gray-600">Email: {student.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                                        <p className="text-sm mt-1">
                                            Status: <span className="text-red-600 font-semibold">Not Verified</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, true)}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, false)}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                {/* Render Verified Students */}
                {verifiedStudents.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-green-600 mb-2 mt-2 p-2 rounded-2xl bg-green-100">Verified Students</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {verifiedStudents.map((student, index) => (
                                <div
                                    key={`${student.studentId}-${index}`}
                                    className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                                >
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h2>
                                        <p className="text-sm text-gray-600">Email: {student.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                                        <p className="text-sm mt-1">
                                            Status: <span className="text-green-600 font-semibold">Verified</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, true)}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => updateVerifyStatus(student.studentId, false)}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };
    

    const renderNestedData = () => (
        <div className="space-y-10">
            {Object.entries(data).map(([department, levels]) => (
                <div key={department} className="bg-blue-100 rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Department: {department}</h2>
                    {Object.entries(levels).map(([level, programs]) => (
                        <div key={level} className="bg-purple-100 rounded-xl shadow-inner p-4 mb-4">
                            <h3 className="text-xl font-semibold text-purple-700 mb-2">Level: {level}</h3>
                            {Object.entries(programs).map(([program, courses]) => (
                                <div key={program} className="bg-green-100 rounded-xl shadow-inner p-4 mb-4">
                                    <h4 className="text-lg font-semibold text-green-700 mb-2">Program: {program}</h4>
                                    {Object.entries(courses).map(([course, semesters]) => (
                                        <div key={course} className="bg-orange-100 rounded-xl shadow-inner p-4 mb-4">
                                            <h5 className="font-medium text-orange-700 mb-2">Course: {course}</h5>
                                            {Object.entries(semesters).map(([semester, sessions]) => (
                                                <div key={semester} className="bg-pink-100 rounded-xl shadow-inner p-4 mb-4">
                                                    <p className="text-md font-semibold text-pink-700 mb-2">Semester: {semester}</p>
                                                    {Object.entries(sessions).map(([session, students]) => (
                                                        <div key={session} className="bg-white rounded-xl shadow p-4 mb-4">
                                                            <p className="text-sm text-gray-700 mb-4 font-semibold">📘 Session: {session}</p>
                                                            {renderStudents(students)}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900 text-center">🔎 Verify Your students 🔍</h1>
            <p className="text-center text-lg text-gray-600 mb-10">Review and manage student verification status</p>

            {loading ? (
                <div className="p-6 grid gap-4 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-32 bg-gray-200 rounded w-full"></div>
                </div>
            ) : (
                renderNestedData()
            )}
        </div>
    );
};

export default StudentVerificationPage;
