import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loginsign } from "./components/Loginsignup/Loginsign";
import { AdminDashboard } from "./components/Dashboard/Admin/AdminDashboard";
import { CitizenDashboard } from "./components/Dashboard/Citizen/CitizenDashboard";
import { StaffDashboard } from "./components/Dashboard/Staff/StaffDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginsign />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;