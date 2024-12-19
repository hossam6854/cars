import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./css/SecondAdminPage.css";

const SecondPage = () => {
  const location = useLocation();
const {
  carCondition,
  carType,
  brand,
  model,
  trim,
  style,
  fuel,
  color,
  transmission,
  year,
  capacity,
  price,
  mileage,
  warranty,
  previousOwners,
  accidentHistory,
  carImages,
  dynamicData, // البيانات الديناميكية
} = location.state;

  console.log()

  const [inspectionData, setInspectionData] = useState(() => {
    const parts = [
      "painting",
      "exterior",
      "exteriorParts",
      "lights",
      "glass",
      "tyres",
      "interior",
      "brakes",
      "acBattery",
      "frontUnderbody",
      "rearUnderbody",
      "mechanical",
    ];

    const initialState = {};
    parts.forEach((part) => {
      initialState[part] = {
        image: null,
        status: carCondition === "New" ? null : "",
      };
    });

    return { parts: initialState };
  });

  const handleImageChange = (e, part) => {
    const file = e.target.files[0];
    if (file) {
      setInspectionData((prevData) => ({
        ...prevData,
        parts: {
          ...prevData.parts,
          [part]: {
            ...prevData.parts[part],
            image: file,
          },
        },
      }));
    }
  };
  const handleStatusChange = (part, status) => {
    setInspectionData((prevData) => ({
      ...prevData,
      parts: {
        ...prevData.parts,
        [part]: { ...prevData.parts[part], status },
      },
    }));
  };
  
  const handleSubmit = async () => {
    const formData = new FormData();
  
    // Append car-related details
    formData.append("carCondition", carCondition);
    formData.append("model", model);
    formData.append("trim", trim);
    formData.append("style", style);
    formData.append("transmission", transmission);
    formData.append("year", year);
    formData.append("fuel", fuel);
    formData.append("color", color);
    formData.append("capacity", capacity);
    formData.append("carImages", carImages);
    formData.append("carType", carType);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("mileage", mileage);
    formData.append("warranty", warranty);
    formData.append("previousOwners", previousOwners);
    formData.append("accidentHistory", accidentHistory);

    carImages.forEach((file) => formData.append('carImages', file));


    Object.entries(dynamicData || {}).forEach(([section, fields]) => {
  const validFields = fields.filter((field) => field.label && field.value); // إزالة الحقول الفارغة
  if (validFields.length > 0) {
    formData.append(`dynamicData[${section}]`, JSON.stringify(validFields));
  }
});
    
  
    // Append part images and statuses
    Object.entries(inspectionData.parts).forEach(([part, { image, status }]) => {
      if (image) {
        formData.append(`${part}Image`, image);
      }
      // Append only non-null status
      formData.append(`${part}Status`, status !== null ? status : "N/A");
    });
    console.log(formData)


   

    try {
      const response = await axios.post("http://localhost:5000/api/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        alert("Inspection data submitted successfully!");
      } else {
        alert("Failed to submit inspection data.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      alert("An error occurred while submitting inspection data.");
    }
  };
  

  return (
    <div className="inspection-form">
      <h2>Car Inspection Form</h2>
      {Object.entries(inspectionData.parts).map(([part, { image, status }]) => (
        <div key={part} className="part-inspection">
          <h3>{part.toUpperCase()}</h3>

          {carCondition === "Used" && (
            <select
              value={status || ""}
              onChange={(e) => handleStatusChange(part, e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Good">Good</option>
              <option value="Needs Repair">Needs Repair</option>
              <option value="Damaged">Damaged</option>
            </select>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, part)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Inspection</button>
    </div>
  );
};

export default SecondPage;
