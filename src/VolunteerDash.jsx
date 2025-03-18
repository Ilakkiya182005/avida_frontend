import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

const VolunteerDash = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login", { replace: true }); // Navigate to login page
        window.location.href = "/login"; // Backup: Force reload to ensure redirection
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen font-sans"  style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 pt-8 text-white">
        <img src="/avidalogo.png" alt="Logo" className="h-15" />
        <div className="flex items-center gap-4">
          {/* Register Volunteer Button */}
          <button
            onClick={() => navigate("/register-volunteer")}
            className="px-4 py-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
          >
            Scribe Enrollment
          </button>


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
          >
            Logout
          </button>
          <UserCircle
            className="w-10 h-10 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/profile")}
          />
        </div>
      </nav>

      {/* Animated Section */}
      <div className="w-full text-white py-16 flex flex-col items-center" >
        <motion.h1
          className="w-3/4 text-6xl font-bold uppercase text-center tracking-wider leading-snug"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          
        >
          Be a Scribe and Help Visually Impaired Students Complete Their Exams.
        </motion.h1>

        <p className="text-2xl mt-6 max-w-3xl text-center tracking-wide leading-relaxed">
          Volunteering as a scribe can change someone's life. Be the helping
          hand that allows a disabled student to achieve their dreams.
        </p>
      </div>

      {/* Image Section */}
      <div className="flex justify-center mt-10 px-6">
        <img
          src="/ScribeImage.png"
          alt="Volunteering"
          className="w-3/4 rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default VolunteerDash;