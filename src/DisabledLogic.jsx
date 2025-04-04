import { useEffect, useState } from "react";
import ChatComponent from "./ChatComponent";

const DisabledLogic = () => {
  const [disabledDetails, setDisabledDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatUserId, setChatUserId] = useState(null);
  const [connectionId, setConnectionId] = useState(null); // ✅ Added missing state

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfileAndRequests = async () => {
      try {
        setLoading(true);

        // Fetch Disabled User Profile
        const profileResponse = await fetch("https://avida-backend.onrender.com/get-exam-details", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile details.");

        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
        setDisabledDetails(profileData);

        // Ensure userId is valid before making another API call
        const disabledUserId = profileData?.userId?._id;
        if (!disabledUserId) throw new Error("Invalid User ID");

        // Fetch Connection Requests
        const requestResponse = await fetch(`https://avida-backend.onrender.com/disabled-requests/${disabledUserId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!requestResponse.ok) throw new Error("Failed to fetch connection requests.");

        const requestData = await requestResponse.json();
        console.log("Requests Data:", requestData);

        // Ensure requests exist and filter accepted ones
        const acceptedRequests = requestData?.requests?.filter(req => req.status === "accepted") || [];
        setRequests(acceptedRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full"
        style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}>
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-400 text-xl">{error}</p>;
    return (
      <div
        className="min-h-screen w-full px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
      >
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
          
          {/* Left Column: Profile + Requests */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
    
            {/* Disabled User Profile */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Disabled User Profile
              </h2>
              <div className="text-lg space-y-5 text-gray-900">
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span>{disabledDetails?.firstName} {disabledDetails?.lastName}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Exam Name:</span>
                  <span>{disabledDetails?.examName}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Exam Venue:</span>
                  <span>{disabledDetails?.examVenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Exam Date:</span>
                  <span>{disabledDetails?.examDate ? new Date(disabledDetails.examDate).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
    
            {/* Accepted Requests */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">✅ Accepted Requests</h2>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req._id} className="border-b py-4 px-4 flex justify-between items-center rounded-lg shadow-md bg-gray-50">
                      <p className="text-gray-900">
                        <strong className="text-purple-700">Volunteer:</strong> {req.volunteerUserId?.firstName} {req.volunteerUserId?.lastName}
                      </p>
                      <span className="text-green-600 font-bold">Accepted ✅</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-700 text-lg">No accepted requests yet.</p>
              )}
            </div>
          </div>
    
          {/* Right Column: Chat Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">💬 Chat with Volunteers</h2>
              {requests.length === 0 ? (
                <p className="text-center text-gray-700 text-lg">No volunteers assigned yet.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req._id} className="border-b py-4 px-4 flex justify-between items-center rounded-lg shadow-md bg-gray-50">
                      <p className="text-gray-900">
                        <strong className="text-purple-700">Volunteer:</strong> {req.volunteerUserId?.firstName}
                      </p>
                      <button 
                        onClick={() => {
                          setChatUserId(req.volunteerUserId?._id);
                          setConnectionId(req._id);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                      >
                        Chat
                      </button>
                    </div>
                  ))}
                </div>
              )}
    
              {/* ChatComponent */}
              {chatUserId && connectionId && (
                <div className="mt-4">
                  <ChatComponent userId={userId} receiverId={chatUserId} connectionId={connectionId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
    
};

export default DisabledLogic;
