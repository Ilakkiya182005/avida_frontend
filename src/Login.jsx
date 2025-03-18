import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/login", {
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

      // Store JWT token and userType
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.userId);

      // alert("Login successful! Redirecting...");
      toast.success("Login Successfull!", {
        theme: "colored",
         position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "#862D86", color: "white" },
      });


      // Navigate based on userType
      if (data.userType === "Volunteer") {
        setTimeout(() => {
          navigate("/volunteer-dashboard");
        }, 1000); // 1 second delay
      } else if (data.userType === "Disabled") {
        setTimeout(() => {
          navigate("/disabled-dashboard");
        }, 1000); // 1 second delay
      }
      
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <ToastContainer/>
      {/* Left Side with Animated Logo */}
      <div className="hidden md:flex md:w-5/12 bg-gray-800 flex-col items-center justify-center p-8">
        <motion.img
          src="/avidalogo.png"
          alt="Logo"
          className="w-24 md:w-32 h-24 md:h-32 mb-4"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-7/12 flex flex-col items-center justify-center bg-white px-6 py-10 md:p-12 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">LOGIN</h1>
        {error && <p className="text-red-500">{error}</p>}

        <form className="w-full max-w-md flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            name="emailId"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange}
            className="mb-3 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="mb-3 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          />

          <button
            type="submit"
            className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-gray-600 mt-4 text-xs md:text-sm text-center">
            Don't have an account?{" "}
            <a href="/signup-login" className="text-blue-600">
              Register now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
