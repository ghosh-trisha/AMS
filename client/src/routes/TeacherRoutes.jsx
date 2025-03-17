import { Routes, Route } from 'react-router-dom';
import AllClassesAsTeacher from '../pages/teacher/AllClassesAsTeacher';
import AttendanceRequests from '../pages/teacher/AttendanceRequest';

const TeacherRoutes = () => (
    <Routes>
       
        <Route path="/teacher/classes/:teacherId" element={<AllClassesAsTeacher />} />
        <Route path="/teacher/requests" element={<AttendanceRequests />} />


    </Routes>
);

export default TeacherRoutes;
