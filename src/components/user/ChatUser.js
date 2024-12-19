import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useLanguage } from "../../LanguageContext";
import "./css/ChatUser.css";

const UserPage = () => {
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();

  const texts = {
    en: {
      chatTitle: "Chat",
      messagePlaceholder: "Type a message...",
      sendButton: "Send",
      alertEmptyMessage: "Message cannot be empty.",
      you: "You:",
      admin: "Admin:",
    },
    ar: {
      chatTitle: "الدردشة",
      messagePlaceholder: "...اكتب رسالة",
      sendButton: "إرسال",
      alertEmptyMessage: ".لا يمكن أن تكون الرسالة فارغة",
      you: ":أنت",
      admin: ":المسؤول",
    },
  };

  const t = texts[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // جلب بيانات المستخدم والمدير
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/admins");
        setAdminId(data[0]?.id || "");
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    const fetchMessages = async () => {
      if (userId && adminId) {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/messages/admin/${userId}`
          );
          setMessages(data);
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    if (userId) {
      fetchAdmin();
      fetchMessages();
    }
  }, [userId, adminId]);

  // إرسال رسالة
  const handleSendMessage = async () => {
  if (!userMessage.trim()) {
    alert(t.alertEmptyMessage);
    return;
  }

  const payload = {
    sender_id: userId,
    receiver_id: adminId,
    message: userMessage,
  };

  try {
    // إرسال الرسالة
    const response = await axios.post(
      "http://localhost:5000/api/messages",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setMessages((prev) => [
        ...prev,
        { sender_id: userId, message: userMessage },
      ]);
      setUserMessage("");
      scrollToBottom();

      // إضافة الرسالة كإشعار
      await axios.post("http://localhost:5000/api/notifications", {
        user_id: adminId,
        message: `New message from user ${userId}: ${userMessage}`,
      });
    }
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
};


  return (
    <div className="chatuser">
      <div className="chat-container">
        <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
          💬
        </div>
        {isChatOpen && (
          <div className="chat-box">
            <div className="chat-header">
              <h3>{t.chatTitle}</h3>
              <button onClick={() => setIsChatOpen(false)}>&times;</button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <div
                    className={`${
                      msg.sender_id === userId ? "sender" : "replier"
                    }`}
                  >
                    <strong>
                      {msg.sender_id === userId ? t.you : t.admin}
                    </strong>
                    <p>{msg.message || msg.admin_reply}</p>
                    </div>
                </div> 
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="message-input">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
              />
              <button onClick={handleSendMessage}>{t.sendButton}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
