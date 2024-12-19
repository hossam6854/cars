// File: src/FirstPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "./css/AdminForm.css";

const FirstPage = () => {
  const [carCondition, setCarCondition] = useState("");
  const [brand, setBrand] = useState(null);
  const [carType, setCarType] = useState(null);
  const [model, setModel] = useState(null);
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");
  const [trim, setTrim] = useState(null);
  const [style, setStyle] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [warranty, setWarranty] = useState("");
  const [previousOwners, setPreviousOwners] = useState("");
  const [accidentHistory, setAccidentHistory] = useState("");
  const [carImages, setCarImages] = useState([]);
  const navigate = useNavigate();

  const handleConditionChange = (e) => {
    setCarCondition(e.target.value);
  };

  const handleImageChange = (e) => {
    setCarImages(Array.from(e.target.files));
  };

  const handleNext = () => {
    if (
      !carCondition ||
      !carType ||
      !brand ||
      !price ||
      (carCondition === "Used" && (!mileage || !previousOwners)) ||
      carImages.length === 0
    ) {
      alert("All fields are required");
      return;
    }

    const carData = {
      carCondition,
      carType: carType?.value,
      brand: brand?.value,
      model: model?.value,
      trim: trim?.value,
      style: style?.value,
      transmission,
      fuel,
      color,
      year,
      capacity,
      price,
      mileage,
      warranty,
      previousOwners,
      accidentHistory,
      carImages,
    };

    navigate("/data-entry", { state: carData }); 
  };

  const dropdownOptions = {
    brands: [
      { value: "Toyota", label: "Toyota" },
      { value: "Honda", label: "Honda" },
    ],
    carTypes: [
      { value: "Sedan", label: "Sedan" },
      { value: "SUV", label: "SUV" },
      { value: "Truck", label: "Truck" },
    ],
    transmissions: [
      { value: "Manual", label: "Manual" },
      { value: "Automatic", label: "Automatic" },
    ],
    fuel: [
      { value: "Petrol", label: "Petrol" },
      { value: "Diesel", label: "Diesel" },
      { value: "Electric", label: "Electric" },

    ],
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

  return (
    <div className="admin-form">
      <h2 className="admin-form__title">Car Information</h2>

      <div className="admin-form__group">
        <label className="admin-form__label" htmlFor="carCondition">
          Is the car new or used?
        </label>
        <select
          className="admin-form__select"
          name="carCondition"
          id="carCondition"
          value={carCondition}
          onChange={handleConditionChange}
          required
        >
          <option>Select Condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      <div className="admin-form__group">
        <label className="admin-form__label" htmlFor="carImages">
          Upload Car Images
        </label>
        <input
          className="admin-form__input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />
      </div>

      {carCondition &&  (
        <div className="admin-form__details"> 
          <div className="admin-form__group">
      <label className="admin-form__label">Brand</label>
      <CreatableSelect
        isClearable
        options={dropdownOptions.brands}
        value={brand}
        onChange={setBrand}
        placeholder="Select or type brand"
        styles={customStyles}
      />
    </div>

    <div className="admin-form__group">
      <label className="admin-form__label">Car Type</label>
      <CreatableSelect
        isClearable
        options={dropdownOptions.carTypes}
        value={carType}
        onChange={setCarType}
        placeholder="Select or type car type"
        styles={customStyles}
      />
    </div>

    <div className="admin-form__group">
      <label className="admin-form__label">Model</label>
      <CreatableSelect
        isClearable
        value={model}
        onChange={setModel}
        placeholder="Select or type model"
        styles={customStyles}
      />
    </div>

    <div className="admin-form__group">
      <label className="admin-form__label">Trim</label>
      <CreatableSelect
        isClearable
        value={trim}
        onChange={setTrim}
        placeholder="Select or type trim"
        styles={customStyles}
      />
    </div>

    <div className="admin-form__group">
      <label className="admin-form__label">Body Style</label>
      <CreatableSelect
        isClearable
        value={style}
        onChange={setStyle}
        placeholder="Select or type body style"
        styles={customStyles}
      />
    </div>


    <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="Fuel">
            Fuel type
            </label>
            <select
              className="admin-form__select"
              name="Fuel"
              id="Fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              required
            >
              <option >Select Fuel type</option>
              {dropdownOptions.fuel.map((fuel) => (
                <option key={fuel.value} value={fuel.value}>
                  {fuel.label}
                </option>
              ))}
            </select>
          </div>



          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="Transmission">
              Transmission
            </label>
            <select
              className="admin-form__select"
              name="Transmission"
              id="Transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              required
            >
              <option>Select Transmission</option>
              {dropdownOptions.transmissions.map((trans) => (
                <option key={trans.value} value={trans.value}>
                  {trans.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="Color">
              Color
            </label>
            <input
              className="admin-form__input"
              type="text"
              name="Color"
              id="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="Capacity">
              Engine Capacity (CC)
            </label>
            <input
              className="admin-form__input"
              type="text"
              name="Capacity"
              id="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="Year">
              Year of Manufacture
            </label>
            <input
              className="admin-form__input"
              type="number"
              name="Year"
              id="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="warranty">
              Warranty (Years)
            </label>
            <input
              className="admin-form__input"
              type="number"
              name="warranty"
              id="warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="price">
              Price (EGP)
            </label>
            <input
              className="admin-form__input"
              type="number"
              name="price"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required  
            />
          </div>
          {carCondition && carCondition === "New" && (
                      <button className="admin-form__button" type="button" onClick={handleNext}>
                      Next
                    </button>
          )}

        </div>
      )}

      {carCondition === "Used" && (
          <div className="admin-form__details admin-form__details--used"> 
          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="mileage">
              Mileage (km)
            </label>
            <input
              className="admin-form__input"
              type="number"
              name="mileage"
              id="mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="previousOwners">
              Number of Previous Owners
            </label>
            <input
              className="admin-form__input"
              type="number"
              name="previousOwners"
              id="previousOwners"
              value={previousOwners}
              onChange={(e) => setPreviousOwners(e.target.value)}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label" htmlFor="accidentHistory">
              Accident History
            </label>
            <textarea
              className="admin-form__textarea"
              name="accidentHistory"
              id="accidentHistory"
              value={accidentHistory}
              onChange={(e) => setAccidentHistory(e.target.value)}
              required
            />
          </div>
          <button className="admin-form__button" type="button" onClick={handleNext}>
        Next
      </button>
        </div>
      )}


    </div>
  );
};

export default FirstPage;
