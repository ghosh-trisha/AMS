import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "../components/basic/Loader";
import TopBar from "../components/basic/TopBar";
import Sidebar from "../components/basic/Sidebar";
import AdminRoutes from "../routes/AdminRoutes";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherRoutes from "../routes/TeacherRoutes";
// import StudentRoutes from "../routes/StudentRoutes";

const ProtectedRoutes = () => {
  const [token, setToken] = useState(Cookies.get("authToken") ?? "kj");
  //   const { setUserData } = useUserContext();
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [userType, setUserType] = useState("ADMIN");
  // const [userType, setUserType] = useState("TEACHER");
  const [userType, setUserType] = useState("STUDENT");
  //   const fetchUserDetails = async () => {
  //     // setLoading(true);
  //     const d1 = new Date(Date.now());
  //     try {
  //       const userInfo = await axiosInstance.get(API.GET_USER_DETAILS_OTP);
  //       if (userInfo) {
  //         setUserData({
  //           ...userInfo.data.response,
  //           dob: new Date(userInfo.data.response.dob),
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       seterror(true);
  //     }
  //     const d2 = new Date(Date.now());

  //     setTimeout(() => {
  //       setToken(Cookies.get("accessToken"));
  //       setLoading(false);
  //     }, Math.max(5500 - (d2.getMilliseconds() - d1.getMilliseconds()), 0));
  //   };

  useEffect(() => {
    // fetchUserDetails();
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  } else if (error) {
    // Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");
    // return <Navigate to="/error" replace />;
  } else
    return token ? (
      <>
        <BrowserRouter>
          {userType == "ADMIN" && (
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
            userType == "TEACHER" && (
              <div className="flex flex-col h-screen">
                <TeacherRoutes/>
              </div>
            )
          }
          {
            userType == "STUDENT" && (
              <div className="flex flex-col h-screen">
                <StudentRoutes/>
              </div>
            )
          }
        </BrowserRouter>
      </>
    ) : (
      
      <>
        <div>Landing</div>
      </>
    );
};

export default ProtectedRoutes;
