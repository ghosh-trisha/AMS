import { Routes, Route } from 'react-router-dom';
import OrganizationPage from '../pages/OrganizationPage';
import DetailedClassPage from '../pages/DetailedClassPage';

const AdminRoutes = () => (
    <Routes>
       
        <Route path="/admin/organization" element={<OrganizationPage />} />
        <Route path="/admin/class/:semesterId" element={<DetailedClassPage />} />

        <Route path="/admin/student" element={<div className="p-6">student Page</div>} />
        <Route path="/admin/teacher" element={<div className="p-6">teacher page</div>} />


    </Routes>
);

export default AdminRoutes;
