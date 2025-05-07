import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const TeacherVerificationPage = () => {
  const [data, setData] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 Global Search
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/teachers/all");
      setTotalTeachers(response.data.totalTeachers || 0);
      setData(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch teachers");
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Filter the data based on the search query
  const filteredTeachers = useMemo(() => {
    return data.filter(teacher => {
      const searchFields = [
        teacher.name, teacher.email, teacher.phone, teacher.departmentName
      ];
      return searchFields.some(field =>
        field && typeof field === 'string' && field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

  const renderTeachers = () => {
    return (
      <div>
        {filteredTeachers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <motion.div
                  key={`${teacher.teacherId}-${index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h2 className="text-xl font-bold text-pink-800 bg-pink-100 p-1 pl-2 rounded-xl mb-1">{teacher.name}</h2>
                    <p className="text-sm text-gray-600">Email: {teacher.email}</p>
                    <p className="text-sm text-gray-600">Phone: {teacher.phone}</p>
                    <p className="text-sm mt-1">
                      Status: <span className="text-green-600 font-semibold">Verified</span>
                    </p>
                  </div>

                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">No teachers found.</div>
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
        🔎 Your Teachers 🔍
      </motion.h1>

      <div className="flex justify-center items-center mb-6">
        <motion.p
          className="text-lg text-gray-600"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Look your organization's teachers
        </motion.p>

        {/* Total Teachers count on the right side */}
        <div className="text-lg text-gray-600 font-medium"><span className="pl-4"> ( {totalTeachers} ) </span></div>
      </div>

      {/* 🌟 Global Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by Name, Email, Phone ..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <div className="p-6 grid gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        renderTeachers()
      )}
    </motion.div>
  );
};

export default TeacherVerificationPage;
