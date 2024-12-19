import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const adminId = 3; // Assuming admin's ID is 3

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/notifications/${adminId}`
        );
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.is_read).length);
      } catch (error) {
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [adminId]);

  const handleMarkAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/mark-read/${adminId}`
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
        `http://localhost:5000/api/notifications/clear-read/${adminId}`
      );
      setNotifications((prev) => prev.filter((notif) => !notif.is_read));
    } catch (error) {
    }
  };

  return (
    <div className="admin-notifications">
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
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
