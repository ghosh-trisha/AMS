import React, { useState } from 'react';
import CreateCourseModal from '../../components/CreateCourseModal';
import ViewClassroomModal from '../../components/ViewClassroomModal';
import CreateBuildingModal from '../../components/CreateBuildingModal';
import CreateRoomModal from '../../components/CreateRoomModal';

const OrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateBuildingOpen, setIsCreateBuildingOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center py-10 px-4">
      {/* Welcome Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800">Hey Admin, Welcome</h1>
        <p className="text-lg text-gray-600 mt-3">Manage and explore your organization with ease. Create new courses or view existing ones effortlessly.</p>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setIsModalOpen(true)} 
          className="w-64 h-40 bg-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-blue-600">
          <span className="text-xl font-semibold"> 📚 Create Course</span>
        </div>

        <div 
          onClick={() => setIsViewModalOpen(true)} 
          className="w-64 h-40 bg-green-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-green-600">
          <span className="text-xl font-semibold"> 👀 View Classes</span>
        </div>

        <div 
          className="w-64 h-40 bg-amber-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-amber-600">
          <span className="text-xl font-semibold"> 📚 Create Syllabus</span>
        </div>

        <div 
          className="w-64 h-40 bg-pink-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-pink-600">
          <span className="text-xl font-semibold"> 📚 Create Session</span>
        </div>

        <div 
          className="w-64 h-40 bg-fuchsia-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-fuchsia-600">
          <span className="text-xl font-semibold"> 📚 Create Schedule</span>
        </div>

        <div 
          onClick={() => setIsCreateBuildingOpen(true)} 
          className="w-64 h-40 bg-emerald-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-emerald-600">
          <span className="text-xl font-semibold"> 📚 Create Building</span>
        </div>

        <div 
          onClick={() => setIsCreateRoomOpen(true)}
          className="w-64 h-40 bg-rose-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-rose-600">
          <span className="text-xl font-semibold"> 📚 Create Room</span>
        </div>

      </div>
      <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ViewClassroomModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <CreateBuildingModal isOpen={isCreateBuildingOpen} onClose={() => setIsCreateBuildingOpen(false)} />
      <CreateRoomModal isOpen={isCreateRoomOpen} onClose={() => setIsCreateRoomOpen(false)} />
    </div>
  );
};

export default OrganizationPage;
