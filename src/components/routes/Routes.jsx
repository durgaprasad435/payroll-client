import React, { useState, useEffect, createContext } from "react";
import { Box } from "@chakra-ui/react";
import {
  Routes,
  Route,
  useLocation, // Added to check the current route
} from "react-router-dom";
import Employee from "../Pages/Employee";
import Addresses from "../Pages/Addresses";
import Leaves from "../Pages/Leaves";
import Salary from "../Pages/Salary";
import Sidebar from "../sidebar/Sidebar";
import Dashboard from "../Pages/Dashboard";
import AddEmployee from "../Pages/AddEmployee";
import Register from "../authentication/Register";
import Login from "../authentication/Login";
import Contact from "../Pages/Contact";
import About from "../Pages/About";
import PrivateRoutes from "./PrivateRoutes";
import Header from "../header/Header";
import Profile from "../Pages/Profile";
import utils from "../../services/utils";
import Payroll from "../Pages/Payroll";
import EmployerDetails from "../Pages/Employer";

export const AuthContext = createContext(null);

export const RoutesContainer = () => {
  const [userName, setUserName] = useState("");
  const [empDetails, setEmpDetails] = useState({});
  const [role, setRole] = useState(""); // Add role state
  const location = useLocation(); // Added to get the current route path

  const GetUsername = (name, role) => {
    setUserName(name);
    setRole(role); // Set role from login
  };
  const EmployeeDetails = (details) => {
    setEmpDetails(details);
  };
  function checkUser() {
    let { userName, role } = utils.getUserName();
    if (userName !== "") {
      setUserName(userName);
      setRole(role);
    } else {
      setUserName("");
      setRole("");
    }
  }
  useEffect(() => {
    checkUser();
  }, []);
  const isAuthenticated = userName !== ""; // Define authentication status

  // Define routes where you DON'T want the sidebar to show (e.g., public routes)
  const publicRoutes = ["/login", "/register", "/addemployer"];
  const isAdmin = role === "admin";
  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div>
      <AuthContext.Provider value={{ userName, role }}>
        <Box>
          {!isPublicRoute &&
            isAuthenticated && ( // Render Sidebar only if it's NOT a public route and user is authenticated
              <Box className="mt-[80px]">
                <Header UName={userName} />
                <Box className="w-[15%] float-left bg-gray-100">
                  <Sidebar />
                </Box>
              </Box>
            )}
          <Box
            className={
              !isPublicRoute && isAuthenticated
                ? "float-right w-[85%]"
                : "w-full"
            }
          >
            <Routes>
              <Route element={<PrivateRoutes />}>
                {/* Admin Routes */}
                {isAdmin && (
                  <>
                    <Route path="/salaries" element={<Salary />}></Route>
                    <Route
                      path={"/addemployee"}
                      element={<AddEmployee />}
                    ></Route>
                    <Route
                      path={"/edit/:id"}
                      element={<AddEmployee Details={empDetails} />}
                    ></Route>
                    <Route path="/payroll" element={<Payroll />}></Route>
                  </>
                )}
                {/* Employee Routes */}
                {isAdmin === "admin" ||
                  ("employee" && (
                    <>
                      <Route
                        path="/employees"
                        element={<Employee EmployeeDetails={EmployeeDetails} />}
                      ></Route>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/leaves" element={<Leaves />} />
                      <Route path="/contact" element={<Contact />}></Route>
                      <Route path="/about" element={<About />}></Route>
                      <Route path="/addresses" element={<Addresses />}></Route>
                    </>
                  ))}
              </Route>
            </Routes>
          </Box>
        </Box>
        <Box className="auth-cont">
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route
              path="/login"
              element={<Login getUsername={GetUsername} />}
            ></Route>
            <Route path="/addemployer" element={<EmployerDetails />}></Route>
          </Routes>
        </Box>
      </AuthContext.Provider>
    </div>
  );
};
