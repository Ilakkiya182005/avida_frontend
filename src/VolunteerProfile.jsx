import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChatComponent from "./ChatComponent";

const VolunteerProfile = () => {
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [chatConnectionId, setChatConnectionId] = useState(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const userId = localStorage.getItem("userId");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, requestResponse, pendingResponse] = await Promise.all([
          fetch("https://avida-backend.onrender.com/profile", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`https://avida-backend.onrender.com/accepted-requests/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`https://avida-backend.onrender.com/requests/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          })
        ]);

        const [profileData, requestData, pendingData] = await Promise.all([
          profileResponse.json(),
          requestResponse.json(),
          pendingResponse.json()
        ]);

        setVolunteerDetails(profileData);
        setRequests(requestData.acceptedRequests || []);
        setPendingRequests(pendingData.pendingRequests || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5001/respond/${requestId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) throw new Error("Failed to accept request.");
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      
      // Refresh accepted requests
      const updatedResponse = await fetch(`http://localhost:5001/accepted-requests/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const updatedData = await updatedResponse.json();
      setRequests(updatedData.acceptedRequests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5001/respond/${requestId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) throw new Error("Failed to reject request.");
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="min-h-screen p-8" 
      style={{ background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)" }}
    >
      <div className="max-w-xl mx-auto">
        {showChat ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 px-14"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(false)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg backdrop-blur-md border border-white/30 transition-all"
            >
              Back to Profile
            </motion.button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30 p-6"
            >
              <ChatComponent 
                connectionId={chatConnectionId} 
                userId={userId} 
                receiverId={selectedReceiverId} 
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Profile Section */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30 p-8"
            >
              {volunteerDetails && (
                <div className="text-white">
                  <h2 className="text-4xl font-bold text-center mb-8">{volunteerDetails.firstName}'s Profile</h2>
                  <div className="space-y-6">
                    <p className="text-xl px-14"><strong>Email:</strong> {volunteerDetails.emailId}</p>
                    <p className="text-xl  px-14"><strong>Qualification:</strong> {volunteerDetails.qualification}</p>
                    <p className="text-xl  px-14"><strong>Languages Known:</strong> {volunteerDetails.languages_known}</p>
                    <p className="text-xl  px-14"><strong>City:</strong> {volunteerDetails.city}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30 p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Pending Requests</h3>
                <div className="space-y-4 px-14">
                  {pendingRequests.map((req) => (
                    <motion.div
                      key={req._id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/10 rounded-lg p-4 flex justify-between items-center px-14"
                    >
                      <div>
                        <p className="font-medium text-white">{req.disabledUserId.firstName}</p>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(req._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRequest(req._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accepted Requests Section */}
            {requests.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30 p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Your Connections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests.map((req) => (
                    <motion.div
                      key={req._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setChatConnectionId(req._id);
                        setSelectedReceiverId(req.disabledUserId._id);
                        setShowChat(true);
                      }}
                      className="bg-white/10 rounded-lg p-4 cursor-pointer flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center">
                        <span className="text-purple-800 font-bold text-xl">
                          {req.disabledUserId.firstName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{req.disabledUserId.firstName}</p>
                        <p className="text-sm text-white/70">Click to chat</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VolunteerProfile;