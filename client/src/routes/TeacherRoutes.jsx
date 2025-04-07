import { Routes, Route } from 'react-router-dom';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import TeacherTodaysClasses from '../pages/teacher/TeacherTodaysClassesPage';
import TeacherAttendanceRequest from '../pages/teacher/TeacherAttendanceRequestPage';


const TeacherRoutes = () => (
    <Routes>
       
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/todaysclasses/:teacherId" element={<TeacherTodaysClasses />} />
        <Route path="/teacher/requests/:classId" element={<TeacherAttendanceRequest />} />

    </Routes>
);

export default TeacherRoutes;
