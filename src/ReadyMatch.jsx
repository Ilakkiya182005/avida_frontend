import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

import "@fontsource/outfit";
const ReadyMatch = () => {
  const [examDetails, setExamDetails] = useState(null);
  const [matchedVolunteers, setMatchedVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await fetch("https://avida-backend.onrender.com/get-exam-details", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch exam details.");

        const data = await response.json();
        setExamDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, []);

  const fetchMatchedVolunteers = async () => {
    if (!examDetails) return;

    try {
      setLoading(true);
      const response = await fetch(`https://avida-backend.onrender.com/match-volunteers/${examDetails._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch matched volunteers.");

      const data = await response.json();
      setMatchedVolunteers(data.matchedVolunteers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (volunteerId) => {
    try {
      const response = await fetch(`https://avida-backend.onrender.com/send/${volunteerId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Failed to send request.");

      toast.success("Request Sent Successfully", {
            theme: "colored",
             position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "#862D86", color: "white" },
          });
      
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-700 text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-xl">{error}</p>;
  if (!examDetails) return <p className="text-center text-gray-700 text-xl">No exam details found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white"
      style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}>
        <ToastContainer/>
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 text-black">
        <h2 className="text-4xl font-bold mb-6 text-center"
          style={{
            background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          📖 Exam Details
        </h2>
        <div className="space-y-5 text-gray-800" role="region" aria-labelledby="examDetails">
          <p className="text-2xl" id="examDetails"><strong>📖 Exam Name:</strong> {examDetails.examName}</p>
          <p className="text-2xl"><strong>📍 Venue:</strong> {examDetails.examVenue}</p>
          <p className="text-2xl"><strong>🕒 Session:</strong> {examDetails.examSession}</p>
          <p className="text-2xl"><strong>📅 Date:</strong> {new Date(examDetails.examDate).toLocaleDateString()}</p>
          <p className="text-2xl"><strong>🎓 Qualification Needed:</strong> {examDetails.qualification_needed_for_volunteer}</p>
          <p className="text-2xl"><strong>🗣 Language Preference:</strong> {examDetails.language_should_be_known_for_volunteer}</p>
          <p className="text-2xl"><strong>⚧ Gender Preference:</strong> {examDetails.gender}</p>
        </div>
        <button onClick={fetchMatchedVolunteers} className="w-full text-white py-3 px-6 mt-8 rounded-lg transition transform hover:scale-105 text-2xl font-bold shadow-md"
          style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}>
          Ready for Matching
        </button>
      </div>

      {matchedVolunteers.map((volunteer) => (
        <div key={volunteer._id} className="border-b py-6 px-4 flex justify-between items-center space-x-4">
          <p className="text-xl font-semibold text-white">{volunteer.firstName}</p>
          <button onClick={() => sendRequest(volunteer.volunteerId)} className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition text-lg font-semibold shadow-md">
            Send Request
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReadyMatch;
