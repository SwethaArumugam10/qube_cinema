import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AlbumDetails from "./pages/AlbumDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/album/:id" element={<AlbumDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;
