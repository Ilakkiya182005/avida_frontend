import { useEffect, useState } from "react";

const VolunteerProfile = () => {
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndRequests = async () => {
      try {
        // Fetch Volunteer Profile
        const profileResponse = await fetch("http://localhost:5001/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile details.");

        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
        setVolunteerDetails(profileData);

        // Fetch Connection Requests using volunteerUserId from profileData.userId
        if (profileData.userId._id) {
          const requestResponse = await fetch(`http://localhost:5001/requests/${profileData.userId._id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (!requestResponse.ok) throw new Error("Failed to fetch connection requests.");

          const requestData = await requestResponse.json();
          setRequests(requestData.pendingRequests || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRequests();
  }, []);

  const handleRespondToRequest = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/respond/${requestId}`, {
        method: "POST", // Correct method for updating request status
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error(`Failed to ${status} request.`);

      alert(`Request ${status} successfully!`);

      // Update UI by filtering out the handled request
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

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

  if (error) return <p className="text-center text-red-600 text-xl">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100"
    style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}>
      {/* Volunteer Profile Section */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 mb-6">
  <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{volunteerDetails?.firstName}'s Profile</h2>
  
  <div className="text-lg space-y-4">
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Name:</span>
      <span className="text-gray-900">{volunteerDetails?.firstName} {volunteerDetails?.lastName}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Location:</span>
      <span className="text-gray-900">{volunteerDetails?.city}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Email:</span>
      <span className="text-gray-900">{volunteerDetails?.emailId}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Languages Known:</span>
      <span className="text-gray-900">{volunteerDetails?.languages_known}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Qualification:</span>
      <span className="text-gray-900">{volunteerDetails?.qualification}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Past Experience:</span>
      <span className="text-gray-900">{volunteerDetails?.past_experience}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">Available Dates:</span>
      <span className="text-gray-900">
        {volunteerDetails?.available_dates?.map(date => 
          new Date(date).toISOString().split('T')[0].replace(/-/g, '/')
        ).join(", ")}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="font-semibold text-gray-700">Available Session:</span>
      <span className="text-gray-900">{volunteerDetails?.available_session}</span>
    </div>
  </div>
</div>

      {/* Connection Requests Section */}
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-4">Connection Requests</h2>
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req._id} className="border-b py-4 flex justify-between items-center">
              <p>{req.disabledUserId.firstName} 
                {/* - {req.disabledUserId.examName} */}
                </p>
              {req.status === "pending" ? (
                <div className="space-x-2">
                  <button onClick={() => handleRespondToRequest(req._id, "accepted")}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                    Accept
                  </button>
                  <button onClick={() => handleRespondToRequest(req._id, "rejected")}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                    Reject
                  </button>
                </div>
              ) : req.status === "accepted" ? (
                <span className="text-green-600 font-bold">Accepted ✅</span>
              ) : (
                <span className="text-red-600 font-bold">Declined ❌</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 text-xl">No requests.</p>
        )}
      </div>
    </div>
  );
};

export default VolunteerProfile;
