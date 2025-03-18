import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const image = "/homep.jpg";

export default function LandingPage() {
  const [showMainContent, setShowMainContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowMainContent(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center  text-white overflow-hidden relative">
      {!showMainContent ? (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            className="text-6xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: 1.2 }}
            transition={{ delay: 2, duration: 1, ease: "easeOut" }}
          >
             <motion.img
                       src="/avidalogo.png"
                       alt="Logo"
                       className="w-24 md:w-32 h-24 md:h-32 mb-4"
              />
          </motion.h1>
          
        </motion.div>
      ) : (
        <div className="absolute inset-0 overflow-auto">
          <div className="absolute top-10 right-8 flex space-x-24">
          <button 
          onClick={() => navigate("/about")} 
            className="text-white px-3 py-2 rounded-full font-bold hover:bg-[#862D86] inline-block"
             >
            About
          </button>
            <button onClick={() => navigate("/services")} className=" text-white px-3 py-2 rounded-full font-bold hover:bg-[#862D86]">
              Services
            </button>
            <button onClick={() => navigate("/products")} className=" text-white px-3 py-2 rounded-full font-bold hover:bg-[#862D86]">
              Products
            </button>
            <button onClick={() => navigate("/signup-login")} className=" text-white px-3 py-2 rounded-full font-bold hover:bg-[#862D86]">
              Sign Up/Login
            </button>
          </div>
          <img src={image} alt="Home Content" className="w-full" />
        </div>
      )}
    </div>
  );
}
