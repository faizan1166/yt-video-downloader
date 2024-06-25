import React from "react";
import { Routes, Route } from "react-router-dom";
import YoutubeDownloader from "./Components/Youtube-downloader/YoutubeDownloader";
import './App.css'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<YoutubeDownloader />} />
      <Route path="/images-to-pdf" element={<YoutubeDownloader />} />
    </Routes>
  );
};

export default App;
