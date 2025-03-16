// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import Loader from "../basic/Loader";
// import axios from "axios";

// export default function SyllabusesCard({semesterId}) {
//   const [papers, setPapers] = useState([]);
// const [paperToDelete, setPaperToDelete] = useState(null);
//   const [showPapers, setShowPapers] = useState(false);
//    const [loading, setLoading] = useState(false);
//   const demoPapers = [
//       {
//         _id: "1",
//         subject: { name: "Data Structures", code: "CS201" }
//       },
//       {
//         _id: "2",
//         subject: { name: "Algorithms", code: "CS202" }
//       },
//       {
//         _id: "3",
//         subject: { name: "Database Systems", code: "CS203" }
//       }
//     ];
  
//     useEffect(() => {
     
//       setTimeout(() => {
//       //   setClassroom(demoClassroom);
//         setPapers(demoPapers);
//         setLoading(false);
//       }, 500);
//     }, [semesterId]);

//      if (loading) {
//         return <Loader loading={loading} />;
//       }
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <button
//           onClick={() => setShowPapers(!showPapers)}
//           className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
//         >
//           <h2 className="text-xl font-semibold flex items-center justify-between">
//             Syllabuses ({papers.length})
//             <span className={`transform transition-transform ${showPapers ? 'rotate-180' : ''}`}>
//               ▼
//             </span>
//           </h2>
//         </button>


//         {showPapers && (
//           <>
//             <h1 className=" px-6 text-xl font-semibold flex items-center justify-between" > Year 2015</h1>
//             <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {papers.length > 0 ? (
//                 papers.map((paper) => (
//                   <div
//                     key={paper._id}
//                     className="group flex items-center justify-between p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                   >
//                     <div className="flex justify-between items-center min-w-64">
//                       <h3 className="font-medium">{paper.subject.name}</h3>
//                       <p className="text-md text-gray-600 font-bold">{`${paper.subject.code}`.toLocaleUpperCase()}</p>
//                     </div>
//                     {/* <button
//                       onClick={() => {
                        
//                       }}
//                       className="text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity px-[1] py-1.5 hover:bg-red-100 rounded-md"
//                       Delete
//                     </button> */}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-6 text-gray-500">
//                   No papers available for this classroom
//                 </div>
//               )}


//             </div></>
//         )}

//       </div>
//   )
// }





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
        // Assuming each syllabus object has a "year" property
        // console.log(response.data.data);
        setSyllabuses(response.data.data);
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

  // Group syllabuses by year
  const groupedSyllabuses = syllabuses.reduce((groups, syllabus) => {
    const year = syllabus.year || "Unknown Year";
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(syllabus);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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

      {showSyllabuses &&
        Object.keys(groupedSyllabuses).map((year) => (
          <div key={year}>
            <h1 className="px-6 text-xl font-semibold">{`Year ${year}`}</h1>
            <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedSyllabuses[year].length > 0 ? (
                groupedSyllabuses[year].map((syllabus) => (
                  <div
                    key={syllabus._id}
                    className="group flex flex-col items-start p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <h3 className="font-medium">{syllabus.name}</h3>
                    {syllabus.subjects && syllabus.subjects.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {syllabus.subjects.map((subject) => (
                          <div
                            key={subject._id}
                            className="flex items-center justify-between text-sm text-gray-600"
                          >
                            <span>{subject.name}</span>
                            <span className="font-bold">
                              {subject.code.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No syllabuses available for this year
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
