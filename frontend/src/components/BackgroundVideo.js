// src/components/BackgroundVideo.jsx
import React from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted playsInline className="video">
        {/* Replace the URL below with your own cinematic background video URL */}
        <source src="https://cdn.pixabay.com/vimeo/323902160/Space%20-%2034066.mp4?width=1280&hash=ec722345973cbbbf3a1c0d87a85087412ed3eaf4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};

export default BackgroundVideo;
