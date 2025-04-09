import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsEmojiSmile } from "react-icons/bs";
import { FiPaperclip, FiMic, FiSend } from "react-icons/fi";

const ChatComponent = ({ userId, connectionId, receiverId, isDarkMode = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://avida-backend.onrender.com/messages/${connectionId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          
        });

        if (!response.ok) throw new Error("Failed to fetch messages.");

        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (connectionId) {
      fetchMessages();
    }
  }, [connectionId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    if (!receiverId) {
      alert("Receiver ID is missing.");
      return;
    }

    try {
      const response = await fetch("https://avida-backend.onrender.com/send-message", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId,
          sender: userId,
          receiver: receiverId,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message.");

      const sentMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg shadow-xl  ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} border ${isDarkMode ? "border-gray-700" : "border-gray-200"} flex flex-col h-full`}
    >
      <div className={`flex items-center space-x-3  p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className={`w-10 h-10  rounded-full ${isDarkMode ? "bg-gray-700" : "bg-purple-100"} flex items-center justify-center`}>
          <span className={`${isDarkMode ? "text-gray-300" : "text-purple-800"} font-bold`}>
            {receiverId ? receiverId.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Chat</h3>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading messages...</p>
        </div>
      )}
      
      {error && (
        <div className={`${isDarkMode ? "bg-red-900/50 border-red-700 text-red-200" : "bg-red-100 border-red-200 text-red-800"} border p-3 rounded-lg m-4`}>
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${msg.sender === userId
                  ? isDarkMode 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-blue-500 text-white rounded-br-none"
                  : isDarkMode 
                    ? "bg-gray-700 text-white rounded-bl-none"
                    : "bg-white text-gray-800 rounded-bl-none"}`}
              >
                <p>{msg.content}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className={`p-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        {showEmojiPicker && (
          <div className={`mb-2 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-lg`}>
            <p className={`text-center text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Emoji picker would go here</p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowEmojiPicker(false)}
                className="text-sm px-3 py-1 rounded bg-blue-500 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}
          >
            <BsEmojiSmile size={20} />
          </button>
          <button className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
            <FiPaperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full p-3 rounded-full ${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-800 placeholder-gray-500"} focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4 pr-12 border ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              placeholder="Type a message..."
            />
            <button className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
              <FiMic size={20} />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${newMessage.trim() 
              ? "bg-blue-500 hover:bg-blue-600 text-white" 
              : isDarkMode 
                ? "bg-gray-700 text-gray-500" 
                : "bg-gray-200 text-gray-400"}`}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatComponent;