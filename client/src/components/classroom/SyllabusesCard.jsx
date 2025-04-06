
import React, { useEffect, useState } from "react";
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

  // Group syllabuses by name instead of year
  const groupedSyllabuses = syllabuses.reduce((groups, syllabus) => {
    // Previously: const year = syllabus.year || "Unknown Year";
    const name = syllabus.name || "Unknown Year";
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(syllabus);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setShowSyllabuses(!showSyllabuses)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-semibold flex items-center justify-between">
          Syllabuses ({syllabuses.length})
          <span
            className={`transform transition-transform ${
              showSyllabuses ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </h2>
      </button>

      {/* Content (only if showSyllabuses is true) */}
      {showSyllabuses &&
        Object.keys(groupedSyllabuses).map((name) => {
          const currentNameSyllabuses = groupedSyllabuses[name];

          return (
            <div key={name}>
              {/* Name Heading (replaces Year Heading) */}
              <h1 className="px-6 text-xl font-semibold mt-2">{`Year ${name}`}</h1>

              {/* Subjects Grid */}
              <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentNameSyllabuses.length > 0 ? (
                  currentNameSyllabuses.map((syllabus) => {
                    // If multiple subjects exist in this syllabus, map them individually
                    if (syllabus.subjects && syllabus.subjects.length > 0) {
                      return syllabus.subjects.map((subject) => (
                        <div
                          key={subject._id}
                          className="group flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                           <div>
                            <h3 className="font-medium">{subject.name}</h3>
                            <p className="text-xs text-gray-500">{subject?.categoryId?.name || "No Category"}</p>
                          </div>
                          <p className="text-md text-gray-600 font-bold">
                            {subject.code.toUpperCase()}
                          </p>
                        </div>
                      ));
                    } else {
                      // If no subjects, display the syllabus name as a single item
                      return (
                        <div
                          key={syllabus._id}
                          className="group flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <h3 className="font-medium">{syllabus.name}</h3>
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500 col-span-full">
                    No syllabuses available for this name
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
