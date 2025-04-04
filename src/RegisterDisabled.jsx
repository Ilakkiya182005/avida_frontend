import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/outfit";

const userId = localStorage.getItem("userId");

const RegisterDisabled = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examName: "",
    examVenue: "",
    examSession: "",
    examDate: "",
    qualification_needed_for_volunteer: "",
    language_should_be_known_for_volunteer: "",
    gender: "Female",
    hallTicket: null,
    applicationProof: null,
  });

  const examSessions = ["Morning", "Afternoon", "Evening"];
  const qualifications = ["10th", "12th", "UG", "PG", "Diploma"];
  const languages = ["Tamil", "English", "Others"];
  const genders = ["Female", "Male"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://avida-backend.onrender.com/register-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formData, userId: userId }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Exam registration is done!", {
            theme: "colored",
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "#862D86", color: "white" },
          });

          setTimeout(() => {
            navigate("/ready-to-match");
          }, 2000);
        } else {
          throw new Error("Failed to register exam.");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("Failed to register exam.");
      });
  };

  return (
    <div
    className="flex justify-center items-center min-h-screen p-6 text-black"
    style={{
      background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
    }}
    role="main"
  >
    <ToastContainer />
    <div
      className="max-w-2xl w-full p-8 rounded-2xl shadow-xl border backdrop-blur-md bg-white/10 text-white"
    >
      <h2
        className="text-3xl font-bold text-center mb-6"
        tabIndex={0}
        aria-label="Register Exam Request"
      >
        Register Exam Request
      </h2>
  
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Left Side */}
        <div>
          <label className="block font-medium mb-2" htmlFor="examName">
            Exam Name
          </label>
          <input
            type="text"
            id="examName"
            name="examName"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black placeholder-white/60 "
            value={formData.examName}
            onChange={handleChange}
            required
          />
  
          <label className="block font-medium mt-4 mb-2" htmlFor="examVenue">
            Exam Venue
          </label>
          <input
            type="text"
            id="examVenue"
            name="examVenue"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black placeholder-white/60"
            value={formData.examVenue}
            onChange={handleChange}
            required
          />
  
          <label className="block font-medium mt-4 mb-2" htmlFor="examDate">
            Exam Date
          </label>
          <input
            type="date"
            id="examDate"
            name="examDate"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black placeholder-white/60"
            value={formData.examDate}
            onChange={handleChange}
            required
          />
  
          <label className="block font-medium mt-4 mb-2" htmlFor="examSession">
            Exam Session
          </label>
          <select
            id="examSession"
            name="examSession"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
            value={formData.examSession}
            onChange={handleChange}
            required
          >
            <option value="">Select Exam Session</option>
            {examSessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
  
        {/* Right Side */}
        <div>
          <label className="block font-medium mb-2" htmlFor="language">
            Languages Required
          </label>
          <select
            id="language"
            name="language_should_be_known_for_volunteer"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
            value={formData.language_should_be_known_for_volunteer}
            onChange={handleChange}
            required
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
  
          <label className="block font-medium mt-4 mb-2" htmlFor="qualification">
            Qualification Needed
          </label>
          <select
            id="qualification"
            name="qualification_needed_for_volunteer"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
            value={formData.qualification_needed_for_volunteer}
            onChange={handleChange}
            required
          >
            <option value="">Select Qualification</option>
            {qualifications.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
  
          <label className="block font-medium mt-4 mb-2" htmlFor="applicationProof">
            Upload Application Proof
          </label>
          <input
            type="file"
            id="applicationProof"
            name="applicationProof"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black file:text-white file:bg-transparent"
            onChange={handleFileChange}
            accept=".pdf, .jpg, .png"
          />
  
          <label className="block font-medium mt-4 mb-2" htmlFor="hallTicket">
            Upload Hall Ticket
          </label>
          <input
            type="file"
            id="hallTicket"
            name="hallTicket"
            className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black file:text-white file:bg-transparent"
            onChange={handleFileChange}
            accept=".pdf, .jpg, .png"
          />
        </div>
  
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="w-1/2 py-2 rounded-full text-black font-semibold transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default RegisterDisabled;
