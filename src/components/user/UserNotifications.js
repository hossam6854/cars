import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import for jwtDecode
import "./css/UserNotifications.css";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userId, setUserId] = useState(null);

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
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/notifications/${userId}`
        );
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.is_read).length);
      } catch (error) {
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/mark-read/${userId}`
      );
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
    }
  };

  const handleClearReadNotifications = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/clear-read/${userId}`
      );
      setNotifications((prev) => prev.filter((notif) => !notif.is_read));
    } catch (error) {
    }
  };

  return (
    <div className="user-notifications">
      <div
        className="notifications-icon"
        onClick={() => {
          setIsNotificationOpen(!isNotificationOpen);
          handleMarkAsRead();
        }}
      >
        🔔
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>
      {isNotificationOpen && (
        <div className="notifications-dropdown">
          {notifications.length > 0 ? (
            <>
              {notifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <p>{notif.message}</p>
                </div>
              ))}
              <button
                className="clear-button"
                onClick={handleClearReadNotifications}
              >
                Clear Read Notifications
              </button>
            </>
          ) : (
            <p className="no-notifications">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
