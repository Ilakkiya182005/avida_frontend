import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

import "@fontsource/outfit";
const DisabledDash = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch("https://avida-backend.onrender.com/logout", {
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
    <div
      className="min-h-screen font-sans text-white"
      style={{
        background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
      }}
      role="main"
    >
      {/* Navbar */}
      <header>
        <nav
          className="flex justify-between items-center p-4 pt-10"
         
          role="navigation"
          aria-label="Main Navigation"
        >
          <img
            src="/avidalogo.png"
            alt="Avida Logo"
            className="h-15"
            aria-hidden="true"
          />
          <div className="flex items-center gap-4">
            {/* Register Exam Button */}
            <button
              onClick={() => navigate("/register-exam")}
              className="px-4 py-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
              aria-label="Register for Exam"
            >
              Exam Registration
            </button>
          
            <button
             onClick={() => navigate('/test-reader')}
             className="px-4 py-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
             >
  Reading
</button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
              aria-label="Logout"
            >
              Logout</button>
          

            {/* Profile Icon */}
            <UserCircle
              className="w-10 h-10 cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/profile-view")}
              role="button"
              tabIndex={0}
              aria-label="View Profile"
            />
          </div>
        </nav>
      </header>

      {/* Animated Section */}
      <main className="w-full text-white py-16 flex flex-col items-center">
        <motion.h1
          className="w-3/4 text-5xl md:text-6xl font-bold uppercase text-center tracking-wider leading-snug"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          tabIndex={0} // Enables keyboard focus for screen readers
          
        >
          Be a Scribe and Help Visually Impaired Students Complete Their Exams.
        </motion.h1>

        <p
          className="text-xl md:text-2xl mt-6 max-w-3xl text-center tracking-wide leading-relaxed"
          tabIndex={0}
        >
          Volunteering as a scribe can change someone's life. Be the helping
          hand that allows a disabled student to achieve their dreams.
        </p>
      </main>

      {/* Image Section */}
      {/* <section className="flex justify-center mt-10 px-6">
        <img
          src="/ScribeImage.png"
          alt="A volunteer helping a visually impaired student with an exam"
          className="w-3/4 rounded-lg shadow-2xl"
          role="img"
        />
      </section> */}
    </div>
  );
};

export default DisabledDash;
