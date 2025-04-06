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

const ProtectedRoutes = () => {
  const [token, setToken] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useRole();

  useEffect(() => {

    setToken(Cookies.get("accessToken"))

    setRole("admin");
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
                <TeacherRoutes />
                </main>
              </div>
                <StudentRoutes />
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
