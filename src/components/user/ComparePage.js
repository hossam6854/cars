import React from "react";
import { useLocation } from "react-router-dom";
import "./css/ComparePage.css";
import { useLanguage } from "../../LanguageContext"; // سياق اللغة


const ComparePage = () => {
  const location = useLocation();
  const { selectedCars } = location.state;
  const { language } = useLanguage(); // استخدام سياق اللغة

  // النصوص المترجمة
  const texts = {
    en: {
      pageTitle: "Compare Cars",
      cardSubtitle: "{year} - {condition}",
      cardLabels: {
        price: "Price:",
        type: "Type:",
        fuelType: "Fuel Type:",
        mileage: "Mileage:",
        warranty: "Warranty:",
        previousOwners: "Previous Owners:",
        notAvailable: "N/A",
      },
      unit: {
        price: "EGP",
        mileage: "KM",
        warranty: "Years",
      },
    },
    ar: {
      pageTitle: "مقارنة السيارات",
      cardSubtitle: "{year} - {condition}",
      cardLabels: {
        price: "السعر:",
        type: "النوع:",
        fuelType: "نوع الوقود:",
        mileage: "عدد الكيلومترات:",
        warranty: "الضمان:",
        previousOwners: "المالكون السابقون:",
        notAvailable: "غير متوفر",
      },
      unit: {
        price: "جنيه",
        mileage: "كم",
        warranty: "سنوات",
      },
    },
  };

  // تغيير اللغة يدويًا حسب الحاجة
  const t = texts[language];

  return (
    <div className="compare-page">
      <h1 className="page-title">{t.pageTitle}</h1>
      <div className="compare-cards-container">
        {/* عرض الكروت الخاصة بكل سيارة */}
        {selectedCars.map((car) => (
          <div key={car.id} className="compare-card">
            <h2 className="card-title">{`${car.brand} ${car.model}`}</h2>
            <p className="card-subtitle">
              {t.cardSubtitle
                .replace("{year}", car.year)
                .replace("{condition}", car.car_condition)}
            </p>
            <div className="card-content">
              <div className="card-item">
                <span className="item-label">{t.cardLabels.price}</span>
                <span className="item-value">
                  {car.price} {t.unit.price}
                </span>
              </div>
              <div className="card-item">
                <span className="item-label">{t.cardLabels.type}</span>
                <span className="item-value">{car.car_type}</span>
              </div>
              <div className="card-item">
                <span className="item-label">{t.cardLabels.fuelType}</span>
                <span className="item-value">{car.fuel_type}</span>
              </div>
              <div className="card-item">
                <span className="item-label">{t.cardLabels.mileage}</span>
                <span className="item-value">
                  {car.mileage} {t.unit.mileage}
                </span>
              </div>
              <div className="card-item">
                <span className="item-label">{t.cardLabels.warranty}</span>
                <span className="item-value">
                  {car.warranty} {t.unit.warranty}
                </span>
              </div>
              <div className="card-item">
                <span className="item-label">{t.cardLabels.previousOwners}</span>
                <span className="item-value">
                  {car.previous_owners || t.cardLabels.notAvailable}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;
