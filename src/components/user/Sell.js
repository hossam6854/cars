import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../main/AuthContext";
import ChatUser from "./ChatUser";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import CreatableSelect from "react-select/creatable";
import "./css/Sell.css";
import { useLanguage } from "../../LanguageContext"; // سياق اللغة

const UserPage = () => {
  const { auth } = useContext(AuthContext);
  const { language } = useLanguage();

  const texts = {
    en: {
      title: "Sell Your Car",
      labels: {
        condition: "Is the car new or used?",
        carImage: "Upload Car Image",
        carType: "Car Type",
        make: "Make",
        model: "Model",
        year: "Year",
        price: "Price",
        mileage: "Mileage (km)",
        transmission: "Transmission",
        engineSize: "Engine Size",
        name: "Contact Name",
        email: "Contact Email",
        phone: "Contact Phone",
      },
      placeholders: {
        carType: "Select or type car type",
      },
      conditionOptions: {
        new: "New",
        used: "Used",
      },
      buttons: {
        submit: "Submit Car Sale",
      },
      messages: {
        success: "Car sale request submitted successfully!",
        error: "Failed to submit the car sale request.",
        requiredFields: "Please fill in all required fields.",
      },
    },
    ar: {
      title: "بيع سيارتك",
      labels: {
        condition: "هل السيارة جديدة أم مستعملة؟",
        carImage: "تحميل صورة السيارة",
        carType: "نوع السيارة",
        make: "الشركة المصنعة",
        model: "الطراز",
        year: "السنة",
        price: "السعر",
        mileage: "عدد الكيلومترات",
        transmission: "ناقل الحركة",
        engineSize: "حجم المحرك",
        name: "اسمك",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
      },
      placeholders: {
        carType: "اختر أو اكتب نوع السيارة",
      },
      conditionOptions: {
        new: "جديدة",
        used: "مستعملة",
      },
      buttons: {
        submit: "إرسال طلب البيع",
      },
      messages: {
        success: "!تم إرسال طلب بيع السيارة بنجاح",
        error: ".فشل في إرسال طلب بيع السيارة",
        requiredFields: ".يرجى ملء جميع الحقول المطلوبة",
      },
    },
  };

  const t = texts[language];
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    condition: "",
    make: "",
    carType: null,
    model: "",
    year: "",
    price: "",
    mileage: "",
    transmission: "",
    engineSize: "",
    name: "",
    email: "",
    phone: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    carTypes: [
      { label: "Sedan", value: "Sedan" },
      { label: "SUV", value: "SUV" },
      { label: "Truck", value: "Truck" },
    ],
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
  }, [userId]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const {
      condition,
      model,
      year,
      make,
      price,
      name,
      email,
      mileage,
      transmission,
      engineSize,
      carType,
      phone,
    } = formData;

    if (!condition || !model || !year || !make || !price || !name || !email) {
      alert(t.messages.requiredFields);
      return;
    }

    const submissionData = new FormData();
    submissionData.append("user_id", userId);
    submissionData.append("condition", condition);
    submissionData.append("carType", carType.value);
    submissionData.append("make", make);
    submissionData.append("model", model);
    submissionData.append("year", year);
    submissionData.append("price", price);
    submissionData.append("mileage", mileage);
    submissionData.append("transmission", transmission);
    submissionData.append("engineSize", engineSize);
    submissionData.append("name", name);
    submissionData.append("email", email);
    submissionData.append("phone", phone);
    submissionData.append("image_url", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/carsales",
        submissionData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setMessage(t.messages.success);
      } else {
        setMessage(t.messages.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage(t.messages.error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #639cd9",
      borderRadius: "0.5rem",
      boxShadow: "inset 0 0.25rem 0.5rem rgba(0, 0, 0, 0.4)",
      padding: "0.2rem",
      fontSize: "1rem",
      backgroundColor: "#ffffff",
      color: "#000000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#888888",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#639cd9",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#639cd9" : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#000000",
      "&:hover": {
        backgroundColor: "#87ceeb",
        color: "#ffffff",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000000",
    }),
  };


  const handleCreateOption = (option, key) => {
    setDropdownOptions((prev) => ({
      ...prev,
      [key]: [...prev[key], { label: option, value: option }],
    }));
    setFormData((prev) => ({ ...prev, [key]: { label: option, value: option } }));
  };

  return (
    <>
      <div className="user-page">
        <h2>{t.title}</h2>
        <form>
          <div>
            <label htmlFor="condition">{t.labels.condition}</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, condition: e.target.value }))
              }
            >
              <option value="">{t.labels.condition}</option>
              <option value="new">{t.conditionOptions.new}</option>
              <option value="used">{t.conditionOptions.used}</option>
            </select>
          </div>

          <div>
            <label htmlFor="carImage">{t.labels.carImage}</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div>
            <label htmlFor="carType">{t.labels.carType}</label>
            <CreatableSelect
              isClearable
              options={dropdownOptions.carTypes}
              value={formData.carType}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, carType: value }))
              }
              onCreateOption={(option) => handleCreateOption(option, "carTypes")}
              placeholder={t.placeholders.carType}
              styles={customStyles}
            />
          </div>

          <div>
            <label htmlFor="make">{t.labels.make}</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, make: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="model">{t.labels.model}</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, model: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="year">{t.labels.year}</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, year: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="price">{t.labels.price}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>

          {formData.condition === "used" && (
            <>
              <div>
                <label htmlFor="mileage">{t.labels.mileage}</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mileage: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="transmission">{t.labels.transmission}</label>
                <input
                  type="text"
                  name="transmission"
                  value={formData.transmission}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      transmission: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="engineSize">{t.labels.engineSize}</label>
            <input
              type="text"
              name="engineSize"
              value={formData.engineSize}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, engineSize: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="name">{t.labels.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="email">{t.labels.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label htmlFor="phone">{t.labels.phone}</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <button type="button" onClick={handleSubmit}>
            {t.buttons.submit}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
      </div>

      {auth.isLoggedIn && auth.role === "user" && <ChatUser />}
    </>
  );
};

export default UserPage;
