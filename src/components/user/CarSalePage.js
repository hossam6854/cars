// /src/components/CarSalePage.js

import React, { useEffect, useState, useCallback ,useContext } from "react";
import axios from "axios";

import {
  FaCar,
  FaBuilding,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaPalette,
  FaGasPump,
  FaMoneyBillAlt,
  FaTachometerAlt,
  FaShieldAlt,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/CarSalePage.css";

import { AuthContext } from '../main/AuthContext';
import { useLanguage } from "../../LanguageContext";


import ChatUser from './ChatUser';


const CarSalePage = () => {
  const { language } = useLanguage();

  const { auth } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCars, setSelectedCars] = useState([]); // السيارات المحددة للمقارنة

  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  // Fetch car data
  useEffect(() => {
    axios.get("http://localhost:5000/api/cars").then((res) => {
      setCars(res.data);
      setFilteredCars(res.data);

      const uniqueBrands = [...new Set(res.data.map((car) => car.brand))];
      const uniqueColors = [...new Set(res.data.map((car) => car.color))];
      const uniqueFuelTypes = [...new Set(res.data.map((car) => car.fuel_type))];

      setBrands(uniqueBrands);
      setColors(uniqueColors);
      setFuelTypes(uniqueFuelTypes);
    });
  }, []);

  // Apply Filters
  const applyFilters = useCallback(() => {
    const lowercasedSearchQuery = searchQuery.toLowerCase();

    const filtered = cars.filter((car) => {
      const matchesCondition = selectedCondition
        ? car.car_condition === selectedCondition
        : true;
      const matchesFuel = selectedFuel ? car.fuel_type === selectedFuel : true;
      const matchesColor = selectedColor ? car.color === selectedColor : true;
      const matchesPrice =
        (!minPrice || car.price >= minPrice) &&
        (!maxPrice || car.price <= maxPrice);
      const matchesSearch =
        lowercasedSearchQuery === "" ||
        car.brand.toLowerCase().includes(lowercasedSearchQuery) ||
        car.car_type.toLowerCase().includes(lowercasedSearchQuery) ||
        car.model.toLowerCase().includes(lowercasedSearchQuery);

      return (
        matchesCondition && matchesFuel && matchesColor && matchesPrice && matchesSearch
      );
    });

    setFilteredCars(filtered);
  }, [
    cars,
    searchQuery,
    selectedCondition,
    selectedFuel,
    selectedColor,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);



   // Handle car selection for comparison
   const toggleCarSelection = (car) => {
    setSelectedCars((prevSelected) => {
      if (prevSelected.some((selected) => selected.id === car.id)) {
        return prevSelected.filter((selected) => selected.id !== car.id);
      }
      if (prevSelected.length < 3) {
        return [...prevSelected, car];
      }
      alert(t.compareLimitAlert);
      return prevSelected;
    });
  };


  const texts = {
    en: {
      pageTitle: "Discover Your Perfect Car",
      pageSubtitle:
        "Explore a wide selection of new and pre-owned cars tailored to your preferences.",
      searchPlaceholder: "Search by brand, type, or model...",
      filters: "Filters",
      clearAll: "Clear All",
      carCondition: "Car Condition",
      all: "All",
      new: "New",
      used: "Used",
      brand: "Brand",
      fuelType: "Fuel Type",
      color: "Color",
      priceRange: "Price Range",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      noCarsMessage: "No cars available",
      compareButton: "Compare Selected Cars",
      viewDetails: "View Details",
      addToCompare: "Add to Compare",
      removeFromCompare: "Remove from Compare",
      mileage: "Mileage",
      warranty: "Warranty",
      Explore:"Explore",
      years:"years",
      EGP:"EGP",
      kg:"KG",
    },
    ar: {
      pageTitle: "اكتشف سيارتك المثالية",
      pageSubtitle: "استكشف مجموعة واسعة من السيارات الجديدة والمستعملة المصممة لتناسب تفضيلاتك.",
      searchPlaceholder: "ابحث حسب العلامة التجارية أو النوع أو الطراز...",
      filters: "التصفية",
      clearAll: "مسح الكل",
      carCondition: "حالة السيارة",
      all: "الكل",
      new: "جديد",
      used: "مستعمل",
      brand: "العلامة التجارية",
      fuelType: "نوع الوقود",
      color: "اللون",
      priceRange: "نطاق السعر",
      minPrice: "الحد الأدنى للسعر",
      maxPrice: "الحد الأقصى للسعر",
      noCarsMessage: "لا توجد سيارات متاحة",
      compareButton: "مقارنة السيارات المحددة",
      viewDetails: "عرض التفاصيل",
      addToCompare: "إضافة للمقارنة",
      removeFromCompare: "إزالة من المقارنة",
      mileage: "المسافة المقطوعة",
      warranty: "الضمان",
      Explore:"تصفخ",
      years:"سنين",
      EGP:"جنيه",
      kg:"كيلوجرام",
    },
  };

  const t = texts[language];


  return (
    
    <div className="car-sale-page">
      <header className="car-sale-header">
      <h1>{t.pageTitle}</h1>
      <p>{t.pageSubtitle}</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={applyFilters}>
            <FaSearch />
          </button>
        </div>
      </header>
      <div className="compo">
      <div className="filters">
      <div className="filters">
  <div className="filter-header">
  <h2>{t.filters}</h2>
  <button className="clear-filters">
  {t.clearAll}
  </button>
  </div>

  <div className="filter-group">
    <h3>
    <FaCar /> {t.carCondition}
    </h3>
    <div className="condition-buttons">
      {['', 'New', 'Used'].map((condition) => (
        <button
          key={condition}
          className={`condition-button ${selectedCondition === condition ? 'active' : ''}`}
          onClick={() => setSelectedCondition(condition)}
        >
                {condition ? t[condition.toLowerCase()] : t.all}
                </button>
      ))}
    </div>
  </div>

  <div className="filter-group">
    <h3>
    <FaBuilding /> {t.brand}
    </h3>
    <div className="filter-dropdown">
      <select onChange={(e) => setSearchQuery(e.target.value)}>
      <option value="">{t.all}</option>
      {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="filter-group">
    <h3>
      <FaGasPump /> {t.fuelType}
    </h3>
    <div className="filter-dropdown">
      <select onChange={(e) => setSelectedFuel(e.target.value)}>
        <option value="">{t.all}</option>
        {fuelTypes.map((fuel, index) => (
          <option key={index} value={fuel}>
            {fuel}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="filter-group">
    <h3>
      <FaPalette /> {t.color}
    </h3>
    <div className="filter-dropdown">
      <select onChange={(e) => setSelectedColor(e.target.value)}>
        <option value="">{t.all}</option>
        {colors.map((color, index) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="filter-group">
    <h3>
      <FaMoneyBillWave />{t.priceRange}
    </h3>
    <div className="price-range">
      <input
        type="number"
        placeholder={t.minPrice}
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder={t.maxPrice}
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>
  </div>
</div>

      </div>

      <div className="car-list">
  {filteredCars.length > 0 ? (
    filteredCars.map((car) => (
      <div
        key={car.id}
        className="car-card"
        role="button"
        aria-label={`View details for ${car.brand} ${car.car_type}`}
      >
        {/* Car Image */}
        <div className="car-image">
        <img
        src={`http://localhost:5000${car.image_url}`}
        alt={`Elegant ${car.brand} ${car.model}`}
            loading="lazy"
          />
          <div className="car-overlay">
            <p className="overlay-text">{t.Explore} {car.brand}</p>
          </div>
        </div>

        <div className="car-details">
  <h4 className="car-title">
    {car.brand} {car.car_type}
  </h4>
  <div className="car-meta">
    <div className="meta-item">
      <FaCalendarAlt /> <span>{car.year}</span>
    </div>
    <div className="meta-item">
      <FaPalette /> <span>{car.color}</span>
    </div>
    <div className="meta-item">
      <FaGasPump /> <span>{car.fuel_type}</span>
    </div>
  </div>
  <div className="car-price">
    <FaMoneyBillAlt /> <span>{car.price.toLocaleString()} {t.EGP}</span>
  </div>
  <div className="car-extra">
    {car.car_condition === 'New' ? (
      <div className="extra-item">
        <FaShieldAlt /> <span>{t.warranty}: {car.warranty} {t.years}</span>
      </div>
    ) : (
      <div className="extra-item">
        <FaTachometerAlt /> <span>{t.mileage}: {car.mileage.toLocaleString()} {t.kg}</span>
      </div>
    )}
     <button
        onClick={() => navigate(`/cars/${car.id}`)}
        className={`compare-button1 ${
    selectedCars.some((selected) => selected.id === car.id) ? "active" : ""
  }`}
>
  {t.viewDetails}

</button>

      <button
  onClick={() => toggleCarSelection(car)}
  className={`compare-button ${
    selectedCars.some((selected) => selected.id === car.id) ? "active" : ""
  }`}
>
  {selectedCars.some((selected) => selected.id === car.id)
     ? t.removeFromCompare
     : t.addToCompare}
</button>

  </div>
</div>


        {/* Condition Badge */}
        <div className={`car-condition-badge ${car.car_condition.toLowerCase()}`}>
          {car.car_condition}
        </div>
      </div>
    ))
  ) : (
    <p>{t.noCarsMessage}</p>
  )}
</div>
{selectedCars.length > 0 && (
  <div className="compare-section">
    <button
      onClick={() => navigate("/compare", { state: { selectedCars } })}
      disabled={selectedCars.length < 2}
    >
      Compare Selected Cars
    </button>
  </div>
)}

      
    </div>


    {auth.isLoggedIn && auth.role === 'user' && (
          <>
          <ChatUser/> 
          </>

        )}

      </div>
  );
};

export default CarSalePage;
