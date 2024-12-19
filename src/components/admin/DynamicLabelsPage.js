import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DynamicLabelsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousData = location.state || {}; // البيانات من الصفحات السابقة

  const [fields, setFields] = useState([{ label: "", value: "" }]);

  const handleAddField = () => {
    setFields([...fields, { label: "", value: "" }]);
  };

  const handleInputChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleNext = () => {
    const dynamicData = fields.reduce((acc, field) => {
      if (field.label && field.value) {
        acc[field.label] = field.value;
      }
      return acc;
    }, {});
  
    const allData = { ...previousData, dynamicData };
  
    navigate("/admin1", { state: allData });
  };
  

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Dynamic Car Details</h2>
      {fields.map((field, index) => (
        <div key={index} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Label"
            value={field.label}
            onChange={(e) => handleInputChange(index, "label", e.target.value)}
            style={{ flex: "1", marginRight: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleInputChange(index, "value", e.target.value)}
            style={{ flex: "2", marginRight: "10px", padding: "5px" }}
          />
          <button
            onClick={() => handleRemoveField(index)}
            style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none" }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={handleAddField}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
        }}
      >
        Add Field
      </button>
      <button
        onClick={handleNext}
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
        }}
      >
        Next
      </button>
    </div>
  );
};

export default DynamicLabelsPage;
