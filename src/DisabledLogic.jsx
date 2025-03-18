import { useEffect, useState } from "react";
const userId = localStorage.getItem("userId");
const DisabledLogic = () => {
  const [disabledDetails, setDisabledDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndRequests = async () => {
      try {
        // Fetch Disabled User Profile
        const profileResponse = await fetch("http://localhost:5001/get-exam-details", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile details.");

        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
        setDisabledDetails(profileData);

        // Fetch Connection Requests using disabledUserId
        if (profileData.userId._id) {
          const requestResponse = await fetch(`http://localhost:5001/disabled-requests/${profileData.userId._id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (!requestResponse.ok) throw new Error("Failed to fetch connection requests.");

          const requestData = await requestResponse.json();

          // Filter only "accepted" requests
          const acceptedRequests = requestData.requests.filter(req => req.status === "accepted");
          setRequests(acceptedRequests);
        }
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
      <div
        className="flex items-center justify-center min-h-screen w-full"
        style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
      >
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-400 text-xl">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-white"
      style={{
        background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
      }}
      role="main"
    >
      {/* Disabled User Profile Section */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800" role="heading" aria-level="2">
           Disabled User Profile
        </h2>

        <div className="text-lg space-y-5 text-gray-900" role="region" aria-labelledby="profileDetails">
          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold text-gray-700"> Name:</span>
            <span>{disabledDetails?.firstName} {disabledDetails?.lastName}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold text-gray-700"> Exam Name:</span>
            <span>{disabledDetails?.examName}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold text-gray-700"> Exam Venue:</span>
            <span>{disabledDetails?.examVenue}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700"> Exam Date:</span>
            <span>{new Date(disabledDetails?.examDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Connection Requests Section */}
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">✅ Accepted Requests</h2>
        
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="border-b py-4 px-4 flex justify-between items-center rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-900">
                  <strong className="text-purple-700">Volunteer:</strong> {req.volunteerUserId.firstName} {req.volunteerUserId.lastName}
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
  );
};

export default DisabledLogic;
