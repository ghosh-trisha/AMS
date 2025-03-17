import { Routes, Route } from 'react-router-dom';
import AllClassesAsTeacher from '../pages/teacher/AllClassesAsTeacher';

const TeacherRoutes = () => (
    <Routes>
       
        {/* <Route path="/admin/organization" element={<OrganizationPage />} /> */}
        <Route path="/teacher/classes" element={<div className="p-6">class</div>} />


    </Routes>
);

export default TeacherRoutes;
