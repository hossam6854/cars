import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaUserCircle, FaTimes } from "react-icons/fa";
import "./css/AdminChat.css";

const AdminChat = ({ initialUser }) => {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialUser || null); // يبدأ بالمستخدم المختار
  const [adminMessage, setAdminMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [adminId] = useState(3);
  const [chatOpen, setChatOpen] = useState(!!initialUser); // فتح الشات إذا تم تمرير `initialUser`
  const [unreadMessages] = useState({});
  const messageEndRef = useRef(null);

  

  // Fetch users and requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users-requests");
        setRequests(response.data);
      } catch (error) {
      }
    };

    fetchRequests();
  }, []);

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      const fetchUserMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/messages/admin/${selectedUser}`
          );
          setUserMessages(response.data);

          // Mark messages as read
        

          // Scroll to the latest message
          scrollToBottom();
        } catch (error) {
        }
      };

      fetchUserMessages();
    }
  }, [selectedUser]);

useEffect(() => {
  if (chatOpen) {
    scrollToBottom();
  }
}, [userMessages, chatOpen]);


const handleSendMessage = async () => {
  if (!selectedUser || !adminMessage.trim()) {
    alert("Please select a user and enter a message.");
    return;
  }

  try {
    // إرسال الرسالة
    await axios.post("http://localhost:5000/api/messages", {
      sender_id: adminId,
      receiver_id: selectedUser,
      admin_reply: adminMessage,
    });

    // إضافة إشعار للمستخدم
    await axios.post("http://localhost:5000/api/notifications", {
      user_id: selectedUser,
      message: `New message from Admin: ${adminMessage}`,
    });

    setUserMessages((prev) => [
      ...prev,
      { sender_id: adminId, receiver_id: selectedUser, admin_reply: adminMessage },
    ]);
    setAdminMessage("");
    scrollToBottom();
  } catch (error) {
  }
};


  const toggleChatWindow = (userId) => {
    setSelectedUser(userId);
    setChatOpen(true);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  

  return (
    <div className="admin-chat">
      {/* User List */}
      <div className="user-list">
        <h3>Users</h3>
        {requests.map((request) => (
          <button
            key={request.user_id}
            className={`user-button ${
              selectedUser === request.user_id ? "active" : ""
            }`}
            onClick={() => toggleChatWindow(request.user_id)}
          >
            <FaUserCircle size={20} />
            <span>{request.username}</span>
            {unreadMessages[request.user_id] > 0 && (
              <span className="unread-badge">{unreadMessages[request.user_id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat with {selectedUser}</h3>
            <button className="close-button" onClick={() => setChatOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-messages">
  {userMessages.map((msg, index) => (
    <div
      key={index}
      className={`message ${
        msg.sender_id === adminId ? "admin" : "user"
      }`}
    >

      <p>{msg.admin_reply || msg.message}</p>
    </div>

  ))}
</div>


          <div className="chat-input">
            <textarea
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              placeholder="Type your message..."
            ></textarea>
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
