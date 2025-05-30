import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../basic/Loader";
import axios from "axios";

export default function SyllabusesCard({ semesterId }) {
  const [syllabuses, setSyllabuses] = useState([]);
  const [showSyllabuses, setShowSyllabuses] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!semesterId) return;

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/admin/syllabus/${semesterId}`)
      .then((response) => {
        setSyllabuses(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching syllabus:", error);
        setLoading(false);
      });
  }, [semesterId]);

  if (loading) {
    return <Loader loading={loading} />;
  }

  // Group syllabuses by name
  const groupedSyllabuses = syllabuses.reduce((groups, syllabus) => {
    const name = syllabus.name || "Unknown Year";
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(syllabus);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      {/* Toggle Header */}
      <button
        onClick={() => setShowSyllabuses(!showSyllabuses)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-semibold flex items-center justify-between cursor-pointer">
          Syllabuses ({syllabuses.length})
          <motion.span
            animate={{ rotate: showSyllabuses ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </h2>
      </button>

      {/* Content (animated expand/collapse) */}
      <AnimatePresence>
        {showSyllabuses && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {Object.keys(groupedSyllabuses).map((name) => {
              const currentNameSyllabuses = groupedSyllabuses[name];

              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="px-6 text-xl font-semibold mt-4">{`Year ${name}`}</h1>

                  <motion.div
                    layout
                    className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {currentNameSyllabuses.length > 0 ? (
                        currentNameSyllabuses.flatMap((syllabus) => {
                          if (syllabus.subjects && syllabus.subjects.length > 0) {
                            return syllabus.subjects.map((subject) => (
                              <motion.div
                                key={subject._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <div>
                                  <h3 className="font-medium">{subject.name}</h3>
                                  <p className="text-xs text-gray-500">
                                    {subject?.categoryId?.name || "No Category"}
                                  </p>
                                </div>
                                <p className="text-md text-gray-600 font-bold">
                                  {subject.code.toUpperCase()}
                                </p>
                              </motion.div>
                            ));
                          } else {
                            return (
                              <motion.div
                                key={syllabus._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <h3 className="font-medium">{syllabus.name}</h3>
                              </motion.div>
                            );
                          }
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500 col-span-full">
                          No syllabuses available for this name
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
