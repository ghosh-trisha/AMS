import { Routes, Route } from 'react-router-dom';
import StudentClassesPage from '../pages/StudentClassesPage';

const StudentRoutes = () => (
    <Routes>
       
        {/* <Route path="/admin/organization" element={<OrganizationPage />} /> */}
        <Route path="/student/classes/:id" element={<StudentClassesPage/>} />


    </Routes>
);

export default StudentRoutes;
