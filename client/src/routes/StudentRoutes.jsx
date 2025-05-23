import { Routes, Route } from 'react-router-dom';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentTodayClassesPage from '../pages/student/StudentTodayClassesPage';
import StudentAttendanceReportPage from '../pages/student/StudentAttendanceReportPage';
import StudentRoutinePage from '../pages/student/StudentRoutinePage';


const StudentRoutes = () => (
    <Routes>
       
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/routine" element={<StudentRoutinePage />} />
        <Route path="/student/todayclasses/:id" element={<StudentTodayClassesPage/>} />
        <Route path="/student/attendance/:studentId" element={<StudentAttendanceReportPage />} />


    </Routes> 
);

export default StudentRoutes;
