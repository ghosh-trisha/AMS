// import React, { useState, useEffect } from 'react';
// import CreateCourseModal from '../../components/CreateCourseModal';
// import ViewClassroomModal from '../../components/ViewClassroomModal';
// import CreateBuildingModal from '../../components/CreateBuildingModal';
// import CreateRoomModal from '../../components/CreateRoomModal';

// const OrganizationPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isCreateBuildingOpen, setIsCreateBuildingOpen] = useState(false);
//   const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleModalOpen = (modal) => {
//     setLoading(true);  
//     setTimeout(() => {  
//       if (modal === 'createCourse') setIsModalOpen(true);
//       if (modal === 'viewClasses') setIsViewModalOpen(true);
//       if (modal === 'createBuilding') setIsCreateBuildingOpen(true);
//       if (modal === 'createRoom') setIsCreateRoomOpen(true);
//       setLoading(false); 
//     }, 100); 
//   };

//   if (loading) {
//     return (
//       <div className="p-6 grid gap-4 animate-pulse">
//         <div className="h-10 bg-gray-200 rounded w-2/3"></div>
//         <div className="h-6 bg-gray-200 rounded w-1/2"></div>
//         <div className="h-32 bg-gray-200 rounded w-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-300 flex flex-col items-center py-10 px-4">
//       {/* Welcome Section */}
//       <div className="text-center max-w-2xl">
//         <h1 className="text-4xl font-bold text-gray-800">Hey Admin, Welcome</h1>
//         <p className="text-lg text-gray-600 mt-3">Manage and explore your organization with ease. Create new courses or view existing ones effortlessly.</p>
//       </div>

//       {/* Action Buttons Section */}
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div 
//           onClick={() => handleModalOpen('createCourse')}
//           className="w-64 h-40 bg-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-blue-600">
//           <span className="text-xl font-semibold"> 🏫 Create Course</span>
//         </div>

//         <div 
//           onClick={() => handleModalOpen('viewClasses')} 
//           className="w-64 h-40 bg-green-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-green-600">
//           <span className="text-xl font-semibold"> 👀 View Classes</span>
//         </div>

//         <div 
//           className="w-64 h-40 bg-amber-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-amber-600">
//           <span className="text-xl font-semibold"> 📖 Create Syllabus</span>
//         </div>

//         <div 
//           className="w-64 h-40 bg-pink-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-pink-600">
//           <span className="text-xl font-semibold"> 📆 Create Session</span>
//         </div>

//         <div 
//           className="w-64 h-40 bg-fuchsia-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-fuchsia-600">
//           <span className="text-xl font-semibold"> 🗓️ Create Schedule</span>
//         </div>

//         <div 
//           onClick={() => handleModalOpen('createBuilding')}
//           className="w-64 h-40 bg-emerald-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-emerald-600">
//           <span className="text-xl font-semibold"> 🏢 Create Building</span>
//         </div>

//         <div 
//           onClick={() => handleModalOpen('createRoom')}
//           className="w-64 h-40 bg-rose-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-rose-600">
//           <span className="text-xl font-semibold"> 🚪 Create Room</span>
//         </div>

//       </div>
//       <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//       <ViewClassroomModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
//       <CreateBuildingModal isOpen={isCreateBuildingOpen} onClose={() => setIsCreateBuildingOpen(false)} />
//       <CreateRoomModal isOpen={isCreateRoomOpen} onClose={() => setIsCreateRoomOpen(false)} />
//     </div>
//   );
// };

// export default OrganizationPage;





import React, { useState, useEffect } from 'react';
import CreateCourseModal from '../../components/CreateCourseModal';
import ViewClassroomModal from '../../components/ViewClassroomModal';
import CreateBuildingModal from '../../components/CreateBuildingModal';
import CreateRoomModal from '../../components/CreateRoomModal';
import { motion } from 'framer-motion';

const OrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateBuildingOpen, setIsCreateBuildingOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  const handleModalOpen = (modal) => {
    setLoading(true);
    setTimeout(() => {
      if (modal === 'createCourse') setIsModalOpen(true);
      if (modal === 'viewClasses') setIsViewModalOpen(true);
      if (modal === 'createBuilding') setIsCreateBuildingOpen(true);
      if (modal === 'createRoom') setIsCreateRoomOpen(true);
      setLoading(false);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-300 flex flex-col items-center py-10 px-4"
    >
      {/* Header (Always visible, even during loading) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl font-bold text-gray-800">Hey Admin, Welcome</h1>
        <p className="text-lg text-gray-600 mt-3">Manage and explore your organization with ease. Create new courses or view existing ones effortlessly.</p>
      </motion.div>

      {/* Loading Spinner (Will show when loading) */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 grid gap-4 animate-pulse"
        >
          <div className="h-10 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </motion.div>
      )}

      {/* Action Buttons Section (Animated) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          onClick={() => handleModalOpen('createCourse')}
          className="w-64 h-40 bg-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-blue-600"
        >
          <span className="text-xl font-semibold"> 🏫 Create Course</span>
        </motion.div>

        <motion.div
          onClick={() => handleModalOpen('viewClasses')}
          className="w-64 h-40 bg-green-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-green-600"
        >
          <span className="text-xl font-semibold"> 👀 View Classes</span>
        </motion.div>

        <motion.div
          className="w-64 h-40 bg-amber-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-amber-600"
        >
          <span className="text-xl font-semibold"> 📖 Create Syllabus</span>
        </motion.div>

        <motion.div
          className="w-64 h-40 bg-pink-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-pink-600"
        >
          <span className="text-xl font-semibold"> 📆 Create Session</span>
        </motion.div>

        <motion.div
          className="w-64 h-40 bg-fuchsia-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-fuchsia-600"
        >
          <span className="text-xl font-semibold"> 🗓️ Create Schedule</span>
        </motion.div>

        <motion.div
          onClick={() => handleModalOpen('createBuilding')}
          className="w-64 h-40 bg-emerald-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-emerald-600"
        >
          <span className="text-xl font-semibold"> 🏢 Create Building</span>
        </motion.div>

        <motion.div
          onClick={() => handleModalOpen('createRoom')}
          className="w-64 h-40 bg-rose-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-rose-600"
        >
          <span className="text-xl font-semibold"> 🚪 Create Room</span>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ViewClassroomModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <CreateBuildingModal isOpen={isCreateBuildingOpen} onClose={() => setIsCreateBuildingOpen(false)} />
      <CreateRoomModal isOpen={isCreateRoomOpen} onClose={() => setIsCreateRoomOpen(false)} />
    </motion.div>
  );
};

export default OrganizationPage;
