import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/outfit";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    emailId: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://avida-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.userId);

      toast.success("Login Successful!", {
        theme: "colored",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "#862D86", color: "white" },
      });

      if (data.userType === "Volunteer") {
        setTimeout(() => navigate("/volunteer-dashboard"), 1000);
      } else if (data.userType === "Disabled") {
        setTimeout(() => navigate("/disabled-dashboard"), 1000);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setLoadintoastg(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side with Animated Background */}
      <motion.div 
        className="hidden md:flex md:w-1/2  flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="z-10 text-center"
        >
          <motion.img
            src="/avidalogo.png"
            alt="Logo"
            className="w-32 h-32 mb-6 mx-auto drop-shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-0 right-0 text-center text-white text-opacity-70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          New to Avida?{' '}
          <a 
            href="/signup-login" 
            className="text-white font-semibold hover:underline cursor-pointer"
          >
            Create Account
          </a>
        </motion.div>
      </motion.div>

      {/* Login Form Section */}
      <motion.div 
        className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 md:p-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-2">
            <div className="w-16 h-1  rounded-full"
            style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}></div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">Login</h1>
          
          
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label 
                 style={{
                  background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                htmlFor="emailId" 
                className={`absolute left-4 transition-all duration-200 ${
                  isFocused.emailId || formData.emailId 
                    ? "top-1 text-xs " 
                    : "top-3.5 text-sm"
                }`}
              >
                Email Address
              </label>
              
              <input
                id="emailId"
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                onFocus={() => handleFocus("emailId")}
                onBlur={() => handleBlur("emailId")}
                className="w-full pt-5 pb-2 px-4 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <label 
               style={{
                background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
                htmlFor="password" 
                className={`absolute left-4 transition-all duration-200 ${
                  isFocused.password || formData.password 
                    ? "top-1 text-xs" 
                    : "top-3.5 text-sm"
                }`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                className="w-full pt-5 pb-2 px-4 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4  focus:ring-indigo-500 border-gray-300 rounded"
                  style={{
                    background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm " style={{
                background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                  Remember me
                </label>
              </div>

              <div className="text-sm" style={{
                background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                <a href="#" className="font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 px-4  text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
              style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 md:hidden">
            Don't have an account?{' '}
            <a href="/signup-login" className="text-indigo-600 font-medium hover:underline">Sign up</a>
          </div>
        </motion.div>
      </motion.div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;