import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/outfit";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const storedUserId = localStorage.getItem("userId");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://avida-backend.onrender.com/register-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formData, userId: storedUserId }),
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
    <main
      className="flex justify-center items-center min-h-screen p-6 text-black"
      style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
      role="main"
      aria-label="Exam Registration Section"
    >
      <ToastContainer />
      <div
        className="max-w-2xl w-full p-8 rounded-2xl shadow-xl border backdrop-blur-md bg-white/10 text-white"
        role="form"
        aria-labelledby="register-exam-heading"
      >
        <h2
          id="register-exam-heading"
          className="text-3xl font-bold text-center mb-6"
          tabIndex={0}
        >
          Register Exam Request
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Side */}
          <div>
            <label htmlFor="examName" className="block font-medium mb-2">
              Exam Name
            </label>
            <input
              type="text"
              id="examName"
              name="examName"
              aria-label="Exam Name"
              aria-required="true"
              className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
              value={formData.examName}
              onChange={handleChange}
              required
            />

            <label htmlFor="examVenue" className="block font-medium mt-4 mb-2">
              Exam Venue
            </label>
            <input
              type="text"
              id="examVenue"
              name="examVenue"
              aria-label="Exam Venue"
              aria-required="true"
              className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
              value={formData.examVenue}
              onChange={handleChange}
              required
            />

            <label htmlFor="examDate" className="block font-medium mt-4 mb-2">
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              aria-label="Exam Date"
              aria-required="true"
              className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black"
              value={formData.examDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="examSession" className="block font-medium mt-4 mb-2">
              Exam Session
            </label>
            <select
              id="examSession"
              name="examSession"
              aria-label="Exam Session"
              aria-required="true"
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
            <label htmlFor="language" className="block font-medium mb-2">
              Languages Required
            </label>
            <select
              id="language"
              name="language_should_be_known_for_volunteer"
              aria-label="Languages Volunteer Should Know"
              aria-required="true"
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

            <label htmlFor="qualification" className="block font-medium mt-4 mb-2">
              Qualification Needed
            </label>
            <select
              id="qualification"
              name="qualification_needed_for_volunteer"
              aria-label="Qualification Needed for Volunteer"
              aria-required="true"
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

            <label htmlFor="applicationProof" className="block font-medium mt-4 mb-2">
              Upload Application Proof
            </label>
            <input
              type="file"
              id="applicationProof"
              name="applicationProof"
              aria-label="Upload Application Proof"
              aria-describedby="applicationProofDesc"
              className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black file:text-white file:bg-transparent"
              onChange={handleFileChange}
              accept=".pdf, .jpg, .png"
            />
            <small id="applicationProofDesc" className="sr-only">
              Accepts PDF, JPG, or PNG formats.
            </small>

            <label htmlFor="hallTicket" className="block font-medium mt-4 mb-2">
              Upload Hall Ticket
            </label>
            <input
              type="file"
              id="hallTicket"
              name="hallTicket"
              aria-label="Upload Hall Ticket"
              aria-describedby="hallTicketDesc"
              className="w-full p-2 rounded-full bg-white backdrop-blur-md text-black file:text-white file:bg-transparent"
              onChange={handleFileChange}
              accept=".pdf, .jpg, .png"
            />
            <small id="hallTicketDesc" className="sr-only">
              Accepts PDF, JPG, or PNG formats.
            </small>
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 rounded-full text-black font-semibold transition-all hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
              }}
              aria-label="Submit exam registration"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterDisabled;
