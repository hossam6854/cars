import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/BookingPage.css";
import { jwtDecode } from "jwt-decode";
import { useLanguage } from "../../LanguageContext"; // سياق اللغة

const BookingPage = () => {
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("");
  const { language } = useLanguage(); // استخدام سياق اللغة

  const texts = {
    en: {
      loading: "Loading car details...",
      bookingTitle: "Book a Test Drive",
      carSummary: {
        year: "Year",
        condition: "Condition",
        price: "Price",
      },
      form: {
        title: "Enter Your Details",
        fullName: "Full Name:",
        email: "Email:",
        phone: "Phone Number:",
        preferredDate: "Preferred Test Drive Date:",
        message: "Additional Message (Optional):",
        submitButton: "Submit Booking",
      },
      status: {
        success: "Booking request submitted successfully!",
        error: "Failed to submit booking. Please try again.",
      },
      EGP: "EGP",
    },
    ar: {
      loading: "جارٍ تحميل تفاصيل السيارة...",
      bookingTitle: "حجز اختبار قيادة",
      carSummary: {
        year: "السنة",
        condition: "الحالة",
        price: "السعر",
      },
      form: {
        title: "أدخل بياناتك",
        fullName: "الاسم الكامل:",
        email: "البريد الإلكتروني:",
        phone: "رقم الهاتف:",
        preferredDate: "تاريخ اختبار القيادة المفضل:",
        message: "رسالة إضافية (اختياري):",
        submitButton: "إرسال الحجز",
      },
      status: {
        success: "تم إرسال طلب الحجز بنجاح!",
        error: "فشل في إرسال طلب الحجز. حاول مرة أخرى.",
      },
      EGP: "جنيه",
    },
  };

  const t = texts[language];
  
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

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
    axios
      .get(`http://localhost:5000/api/cars/${id}`)
      .then((res) => setCar(res.data))
      .catch((err) => console.error("Error fetching car details:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      car_id: id,
      userId,
      ...formData,
    };

    axios
      .post("http://localhost:5000/api/bookings", bookingData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDate: "",
            message: "",
          });
          setStatusMessage(t.status.success);
          setStatusType("success");
          alert(t.status.success);
        }
      })
      .catch((err) => {
        console.error("Error submitting booking request:", err);
        setStatusMessage(t.status.error);
        setStatusType("error");
        alert(t.status.error);
      });
  };

  if (!car) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <h1>{t.bookingTitle}</h1>
      <div className="car-summary">
        <img
          src={`http://localhost:5000${car.image_url}`}
          alt={`${car.brand} ${car.model}`}
          className="car-image"
        />
        <h2>{`${car.brand} ${car.model}`}</h2>
        <p>{`${t.carSummary.year}: ${car.year}`}</p>
        <p>{`${t.carSummary.condition}: ${car.car_condition}`}</p>
        <p>{`${t.carSummary.price}: ${car.price.toLocaleString()} ${t.EGP}`}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <h3>{t.form.title}</h3>
        <div className="form-group">
          <label htmlFor="name">{t.form.fullName}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{t.form.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">{t.form.phone}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferredDate">{t.form.preferredDate}</label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">{t.form.message}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          {t.form.submitButton}
        </button>
      </form>
      {statusMessage && (
        <div
          className={`status-message ${
            statusType === "success" ? "success" : "error"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
