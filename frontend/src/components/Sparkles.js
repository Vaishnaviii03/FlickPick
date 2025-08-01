import React from "react";
import "./Sparkles.css";

const Sparkles = () => {
  return <div className="sparkle-container">
    {[...Array(30)].map((_, i) => (
      <div key={i} className="sparkle"></div>
    ))}
  </div>;
};

export default Sparkles;
