import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CityDetail from "./pages/CityDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/city/:id" element={<CityDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}