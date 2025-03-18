import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify"; // Import toastify and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify

const SignUpLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    userType: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Show success toast with customized message and position

      // Delay the navigation to give the toast time to appear
      setTimeout(() => {
        navigate("/login");
      }, 1000); // 2 seconds delay before navigation

    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        position: "top-center", // Center the error toast
        autoClose: 500, // Close after 2 seconds
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
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

      {/* Signup Form Section */}
      <div className="w-full md:w-7/12 flex flex-col items-center justify-center bg-white px-6 py-10 md:p-12 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">REGISTER</h1>
        {error && <p className="text-red-500">{error}</p>}

        <form className="w-full max-w-md flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="mb-3 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="mb-3 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mb-3 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="mb-4 p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700"
            required
          >
            <option value="" disabled hidden>
              Account type
            </option>
            <option value="Volunteer">Volunteer</option>
            <option value="Disabled">Disabled</option>
          </select>

          <button
            type="submit"
            className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-gray-600 mt-4 text-xs md:text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login now
            </a>
          </p>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default SignUpLogin;
