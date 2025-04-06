import { Routes, Route } from 'react-router-dom';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';

const TeacherRoutes = () => (
    <Routes>
       
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        {/* <Route path="/teacher/classes/:teacherId" element={<TeacherTodaysClasses />} /> */}
        {/* <Route path="/teacher/requests" element={<TeacherAttendanceRequest />} /> */}


    </Routes>
);

export default TeacherRoutes;
