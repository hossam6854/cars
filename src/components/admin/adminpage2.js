import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/DataEntry.css"; 

const DataEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousData = location.state || {}; 

 
  const [sections, setSections] = useState([
    { title: "Engine", fields: [{ label: "", value: "" }] },
    { title: "Tires & Wheels", fields: [{ label: "", value: "" }] },
    { title: "Suspension", fields: [{ label: "", value: "" }] },
    { title: "Measurements", fields: [{ label: "", value: "" }] },
    { title: "Weight & Capacity", fields: [{ label: "", value: "" }] },
    { title: "Safety", fields: [{ label: "", value: "" }] },
    { title: "Electrical", fields: [{ label: "", value: "" }] },
    { title: "Brakes", fields: [{ label: "", value: "" }] },
  ]);


  const handleAddField = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.push({ label: "", value: "" });
    setSections(updatedSections);
  };

  
  const handleInputChange = (sectionIndex, fieldIndex, key, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex][key] = value;
    setSections(updatedSections);
  };


  const handleRemoveField = (sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.splice(fieldIndex, 1);
    setSections(updatedSections);
  };

  const handleNext = () => {
    const dynamicData = sections.reduce((acc, section) => {
      acc[section.title] = section.fields.filter((field) => field.label && field.value);
      return acc;
    }, {});

    const allData = { ...previousData, dynamicData };
    navigate("/admin1", { state: allData }); 
  };

  return (
    <div className="admin-form1">
      <h2 className="admin-form__title">Dynamic Data Entry</h2>

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="admin-form__details admin-form__details--new">
          <h3 className="admin-form__subtitle">{section.title}</h3>
          {section.fields.map((field, fieldIndex) => (
            <div key={fieldIndex} className="admin-form__group">
              <input
                className="admin-form__input"
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleInputChange(sectionIndex, fieldIndex, "label", e.target.value)}
                style={{ marginRight: "10px" }}
              />
              <input
                className="admin-form__input"
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) => handleInputChange(sectionIndex, fieldIndex, "value", e.target.value)}
              />
              <button
                className="admin-form__button admin-form__button--delete"
                type="button"
                onClick={() => handleRemoveField(sectionIndex, fieldIndex)}
                style={{ marginLeft: "10px", backgroundColor: "red" }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="admin-form__button"
            type="button"
            onClick={() => handleAddField(sectionIndex)}
          >
            Add Field
          </button>
        </div>
      ))}

      <button className="admin-form__button" type="button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default DataEntry;
