import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "../components/basic/Loader";
import TopBar from "../components/basic/TopBar";
import Sidebar from "../components/basic/Sidebar";
import AdminRoutes from "../routes/AdminRoutes";
import TeacherRoutes from "../routes/TeacherRoutes";
import StudentRoutes from "../routes/StudentRoutes";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./LandingPage";
import { useRole } from "../components/contexts/roleContext";
import { useSession } from "../components/contexts/sessionContext";

const ProtectedRoutes = () => {
  const [token, setToken] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useRole();
  const { selectedSession, setSelectedSession } = useSession();

  useEffect(() => {

    setToken(Cookies.get("accessToken"))

    setRole('admin')
    // setRole(Cookies.get("role"))

    setSelectedSession(Cookies.get("selectedSession"))
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (error) {
    // return <Navigate to="/error" replace />;
  }

  return (
    <BrowserRouter>
      {role ? (
        <>
          {role == "admin" && (
            <div className="flex flex-col h-screen">
              <TopBar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto bg-gray-100">
                  <AdminRoutes />
                </main>
              </div>
            </div>
          )}
          {
            role == "teacher" && (
              <div className="flex flex-col h-screen">
              <TopBar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto bg-gray-100">
                <TeacherRoutes />
                </main>
              </div>
            </div>
            )
          }
          {
            role == "student" && (
              
              <div className="flex flex-col h-screen">
              <TopBar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto bg-gray-100">
                <StudentRoutes />
                </main>
              </div>
              </div>
            )
          }
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default ProtectedRoutes;
