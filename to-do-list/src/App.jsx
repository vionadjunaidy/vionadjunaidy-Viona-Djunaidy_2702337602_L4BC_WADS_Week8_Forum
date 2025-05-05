import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TodoWrapper from "./components/TodoWrapper";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileDetails from "./components/ProfileDetails";
import { getAuthToken } from "./utils/auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = localStorage.getItem("user");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && storedUser && tokenExpiration) {
      const currentTime = Date.now();

      if (currentTime >= tokenExpiration) {
        // Token expired, log the user out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiration");
        setUser(null);
      } else {
        setUser(JSON.parse(storedUser));

        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("tokenExpiration");
          setUser(null);
        }, tokenExpiration - currentTime);

        return () => clearTimeout(timeout);
      }
    } else {
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/todo" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/todo" /> : <Signup />} />

        <Route path="/todo" element={user ? <TodoWrapper /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/profile" element={user ? <ProfileDetails /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
