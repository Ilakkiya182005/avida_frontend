import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
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
    gender: "",
  });

  const examSessions = ["Morning", "Afternoon", "Evening"];
  const qualifications = ["10th", "12th", "UG", "PG", "Diploma"];
  const languages = ["Tamil", "English", "Others"];
  const genders = ["Female", "Male"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/register-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formData, userId: userId }),
    })
      .then((response) => {
        if (response.ok) {
            toast.success("Exam registration is done.!", {
                theme: "colored",
                 position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                style: { backgroundColor: "#862D86", color: "white" },
              });
             
                setTimeout(() => {
                  navigate("/ready-to-match");
                }, 2000); // 1 second delay
            
              
         
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
      className="flex justify-center items-center min-h-screen p-6 text-white"
      style={{
        background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
      }}
      role="main"
    >
        <ToastContainer/>
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md text-black">
        <h2
          className="text-2xl font-bold text-center mb-6"
          tabIndex={0}
          aria-label="Register Exam Request"
        >
          Register Exam Request
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Exam Name */}
          <div>
            <label className="block font-medium" htmlFor="examName">
              Exam Name
            </label>
            <input
              type="text"
              id="examName"
              name="examName"
              className="w-full p-2 border rounded"
              value={formData.examName}
              onChange={handleChange}
              required
              aria-required="true"
            />

            {/* Exam Venue */}
            <label className="block font-medium mt-4" htmlFor="examVenue">
              Exam Venue
            </label>
            <input
              type="text"
              id="examVenue"
              name="examVenue"
              className="w-full p-2 border rounded"
              value={formData.examVenue}
              onChange={handleChange}
              required
              aria-required="true"
            />

            {/* Exam Date */}
            <label className="block font-medium mt-4" htmlFor="examDate">
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              className="w-full p-2 border rounded"
              value={formData.examDate}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Exam Session, Qualification, Language */}
          <div>
            {/* Exam Session */}
            <label className="block font-medium" htmlFor="examSession">
              Exam Session
            </label>
            <select
              id="examSession"
              name="examSession"
              className="w-full p-2 border rounded"
              value={formData.examSession}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="">Select Exam Session</option>
              {examSessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>

            {/* Qualification Needed */}
            <label className="block font-medium mt-4" htmlFor="qualification">
              Qualification Needed
            </label>
            <select
              id="qualification"
              name="qualification_needed_for_volunteer"
              className="w-full p-2 border rounded"
              value={formData.qualification_needed_for_volunteer}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="">Select Qualification</option>
              {qualifications.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            {/* Languages Required */}
            <label className="block font-medium mt-4" htmlFor="language">
              Languages Required
            </label>
            <select
              id="language"
              name="language_should_be_known_for_volunteer"
              className="w-full p-2 border rounded"
              value={formData.language_should_be_known_for_volunteer}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Selection */}
          <div className="col-span-2">
            <label className="block font-medium" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full p-2 border rounded"
              value={formData.gender}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="">Select Gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-1/2 text-white p-2 rounded"
              
              aria-label="Submit Exam Registration Form"
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
