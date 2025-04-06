import { Routes, Route } from 'react-router-dom';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentTodayClassesPage from '../pages/student/StudentTodayClassesPage';


const StudentRoutes = () => (
    <Routes>
       
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/todayclasses/:id" element={<StudentTodayClassesPage/>} />
        {/* <Route path="/student/attendance/:id" element={<StudentClassesPage />} /> */}


    </Routes> 
);

export default StudentRoutes;
