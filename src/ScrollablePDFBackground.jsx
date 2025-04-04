import React, { useEffect, useRef } from "react";
import "@fontsource/outfit";
const ScrollablePDFBackground = () => {
 
    const image = "/home.jpg"; // Path to your single image in the `public` folder

  return (
    <div className="relative w-full h-screen overflow-y-scroll">
      {/* Background image */}
      <div className="w-full h-screen">
        <img
          src={image}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Overlay Content */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 p-5 rounded-lg text-center text-lg font-bold">
        Scrollable Single Image Background with React + TailwindCSS
      </div>
    </div>
  );
};

export default ScrollablePDFBackground;
