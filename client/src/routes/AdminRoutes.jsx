import { Routes, Route } from 'react-router-dom';
import OrganizationPage from '../pages/admin/OrganizationPage';
import DetailedClassPage from '../pages/admin/DetailedClassPage';
import StudentVerificationPage from '../pages/admin/StudentVerificationPage';
import TeacherVerificationPage from '../pages/admin/TeacherVerificationPage';
import StudentAll from '../pages/admin/StudentAll';
import TeacherAll from '../pages/admin/TeacherAll';
import StudentAttendanceReportPage from '../pages/student/StudentAttendanceReportPage';

const AdminRoutes = () => (
    <Routes>
       
        <Route path="/admin/organization" element={<OrganizationPage />} />
        <Route path="/admin/class/:semesterId" element={<DetailedClassPage />} />
        <Route path="/student/attendance/:studentId" element={<StudentAttendanceReportPage />} />

        <Route path="/admin/student/verification" element={<StudentVerificationPage />} />
        <Route path="/admin/teacher/verification" element={<TeacherVerificationPage />} />

        <Route path="/admin/student" element={<StudentAll/>} />
        <Route path="/admin/teacher" element={<TeacherAll/>} />


    </Routes>
);

export default AdminRoutes;
