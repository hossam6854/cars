import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/CarDetails.css";
import InstallmentCalculator from "./Calculator"; // Import the calculator component
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext"; // سياق اللغة



const CarDetailsPage = () => {

  const navigate = useNavigate();
  const { language } = useLanguage(); // استخدام سياق اللغة
  const texts = {
    en: {
      loading: "Loading car details...",
      overview: "Overview",
      overviewDetails: {
        transmission: "Transmission",
        fuelType: "Fuel Type",
        color: "Color",
        warranty: "Warranty",
        engineCapacity: "Engine Capacity",
      },
      installmentCalculator: "Installment Calculator",
      inspectionReport: "Inspection Report",
      partsGallery: "Parts Gallery",
      comparison: "Comparison",
      condition: "Filter by Condition",
      criteria: "Select Comparison Criteria",
      compareButton: "Compare Cars",
      noComparisonMessage: "Select comparison criteria above.",
      scheduleTestDrive: "Schedule a Test Drive",
      Redefining:
        "Redefining luxury and performance, combines innovative technology with stunning design.",
      heroHighlights: {
        awardWinningPerformance: "Award-Winning Performance",
        advancedEngineering: "Advanced Engineering",
        luxuryDesign: "Luxury Design",
      },
      inspectionTitle: "Inspection Report",
      inspectionDescription: "Detailed information about the {category}.",
      galleryTitle: "Parts Gallery",
      comparisonTitle: "Compare with Similar Cars",
      filterByCondition: "Filter by Condition",
      selectCriteria: "Select Comparison Criteria",
    },
    ar: {
      loading: "جارٍ تحميل تفاصيل السيارة...",
      overview: "نظرة عامة",
      overviewDetails: {
        transmission: "ناقل الحركة",
        fuelType: "نوع الوقود",
        color: "اللون",
        warranty: "الضمان",
        engineCapacity: "سعة المحرك",
      },
      installmentCalculator: "حاسبة التقسيط",
      inspectionReport: "تقرير الفحص",
      partsGallery: "معرض القطع",
      comparison: "المقارنة",
      condition: "تصفية حسب الحالة",
      criteria: "اختر معايير المقارنة",
      compareButton: "قارن السيارات",
      noComparisonMessage: "اختر معايير المقارنة أعلاه.",
      scheduleTestDrive: "حجز اختبار القيادة",
      Redefining: ".إعادة تعريف الفخامة والأداء، تجمع بين التكنولوجيا المبتكرة والتصميم المذهل",
      heroHighlights: {
        awardWinningPerformance: "أداء حاصل على جوائز",
        advancedEngineering: "هندسة متطورة",
        luxuryDesign: "تصميم فاخر",
      },
      inspectionTitle: "تقرير الفحص",
      inspectionDescription: "معلومات تفصيلية حول {category}.",
      galleryTitle: "معرض القطع",
      comparisonTitle: "قارن مع سيارات مشابهة",
      filterByCondition: "التصفية حسب الحالة",
      selectCriteria: "اختر معايير المقارنة",
    },
  };
  
  const t = texts[language];
  
  

  

  
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIndex: 0 });

const openLightbox = (index) => {
  setLightbox({ isOpen: true, currentIndex: index });
};

const closeLightbox = () => {
  setLightbox({ isOpen: false, currentIndex: 0 });
};

const showNext = () => {
  setLightbox((prev) => ({
    ...prev,
    currentIndex: (prev.currentIndex + 1) % parts.length,
  }));
};

const showPrevious = () => {
  setLightbox((prev) => ({
    ...prev,
    currentIndex: (prev.currentIndex - 1 + parts.length) % parts.length,
  }));
};
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeAccordion, setActiveAccordion] = useState("");
  const [comparisonResults, setComparisonResults] = useState([]);
  const [condition, setCondition] = useState("New and Used"); // Default condition
  const availableCriteria = ["price", "car_type", "fuel_type", "mileage"];
  const [selectedCriteria, setSelectedCriteria] = useState([]);




  const fetchSimilarCars = async () => {
    try {
      const queryParams = new URLSearchParams({
        criteria: selectedCriteria.join(","),
        condition: condition,
      }).toString();
      const response = await axios.get(
        `http://localhost:5000/api/cars/${id}/similar?${queryParams}`
      );
      setComparisonResults(response.data);
    } catch (error) {
      console.error("Error fetching similar cars:", error.response || error.message);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/cars/${id}`)
      .then((res) => setCar(res.data))
      .catch((err) => console.error("Error fetching car details:", err));
  }, [id]);

  if (!car) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }


  const parts = car.parts_images
    ? car.parts_images.split(",").map((partInfo) => {
        const [part, status, imageUrl] = partInfo.split("|");
        return { part, status, imageUrl };
      })
    : [];

  const inspection = [
    { category: "Painting", status: car.painting_status },
    { category: "Exterior", status: car.exterior_status },
    { category: "Exterior Parts", status: car.exterior_parts_status },
    { category: "Lights", status: car.lights_status },
    { category: "Glass", status: car.glass_status },
    { category: "Tyres", status: car.tyres_status },
    { category: "Interior", status: car.interior_status },
    { category: "Brakes", status: car.brakes_status },
    { category: "AC & Battery", status: car.ac_battery_status },
    { category: "Front Underbody", status: car.front_underbody_status },
    { category: "Rear Underbody", status: car.rear_underbody_status },
    { category: "Mechanical", status: car.mechanical_status },
  ];

 




  return (
    <div className="car-details-page">
      <header className="hero">
  <div className="hero-container">
    {/* Left Side: Car Image */}
    <div className="hero-image-wrapper">
      <img
        src={`http://localhost:5000${car.image_url}`}
        alt={`Elegant ${car.brand} ${car.model}`}
        className="hero-image"
      />
    </div>
    {/* Right Side: Car Details */}
    <div className="hero-details">
      <h1 className="hero-title">
        {`${car.brand} ${car.model}`}
      </h1>
      <p className="hero-description">
       {t.Redefining}
      </p>
      <div className="hero-highlights">
        <div className="highlight">
          <i className="fas fa-trophy"></i>
          <p>{t.heroHighlights.awardWinningPerformance}</p>
          </div>
        <div className="highlight">
          <i className="fas fa-cogs"></i>
          <p>{t.heroHighlights.advancedEngineering}</p>
          </div>
        <div className="highlight">
          <i className="fas fa-car-side"></i>
          <p>{t.heroHighlights.luxuryDesign}</p>
          </div>
      </div>
      <div className="badges">
        <span className="badge">
          <i className="fas fa-calendar-alt"></i> {car.year}
        </span>
        <span className={`badge ${car.car_condition.toLowerCase()}`}>
          <i className="fas fa-car"></i> {car.car_condition}
        </span>
        <span className="badge fuel">
          <i className="fas fa-gas-pump"></i> {car.fuel_type}
        </span>
      </div>
      <button
  className="cta-button"
  onClick={() => navigate(`/cars/${id}/book`)}
>
<i className="fas fa-calendar-check"></i> {t.scheduleTestDrive}
</button>

    </div>
  </div>
</header>


<nav className="tabs-nav">
        <button
          className={activeTab === "overview" ? "tab active" : "tab"}
          onClick={() => setActiveTab("overview")}
        >
          <i className="fas fa-info-circle"></i> {t.overview}
        </button>
        <button
          className={`tab ${activeTab === "installment" ? "active" : ""}`}
          onClick={() => setActiveTab("installment")}
        >
          {t.installmentCalculator}
        </button>
        {car.car_condition === "Used" && (
          <button
            className={activeTab === "inspection" ? "tab active" : "tab"}
            onClick={() => setActiveTab("inspection")}
          >
            <i className="fas fa-clipboard-check"></i> {t.inspectionReport}
          </button>
        )}
        <button
          className={activeTab === "gallery" ? "tab active" : "tab"}
          onClick={() => setActiveTab("gallery")}
        >
          <i className="fas fa-images"></i> {t.partsGallery}
        </button>
        <button
          className={activeTab === "comparison" ? "tab active" : "tab"}
          onClick={() => setActiveTab("comparison")}
        >
          <i className="fas fa-balance-scale"></i> {t.comparison}
        </button>
      </nav>



      {/* Tab Content */}
      <div className="tab-content">
  {activeTab === "overview" && (
    <section className="overview">
      <h2 className="overview-title">
      <i className="fas fa-car"></i> {t.overview}
      </h2>
      <div className="overview-grid">
        <div className="overview-item">
          <i className="fas fa-cogs overview-icon"></i>
          <div className="overview-details">
          <h3>{t.overviewDetails.transmission}</h3>
          <p>{car.transmission}</p>
          </div>
        </div>
        <div className="overview-item">
          <i className="fas fa-gas-pump overview-icon"></i>
          <div className="overview-details">
          <h3>{t.overviewDetails.fuelType}</h3>
          <p>{car.fuel_type}</p>
          </div>
        </div>
        <div className="overview-item">
          <i className="fas fa-palette overview-icon"></i>
          <div className="overview-details">
          <h3>{t.overviewDetails.color}</h3>
          <p>{car.color}</p>
          </div>
        </div>
        <div className="overview-item">
          <i className="fas fa-award overview-icon"></i>
          <div className="overview-details">
          <h3>{t.overviewDetails.warranty}</h3>
          <p>{car.warranty} {t.Years}</p>
          </div>
        </div>
        <div className="overview-item">
          <i className="fas fa-tachometer-alt overview-icon"></i>
          <div className="overview-details">
          <h3>{t.overviewDetails.engineCapacity}</h3>
          <p>{car.capacity} CC</p>
          </div>
        </div>
      </div>
    </section>
  )}


{activeTab === "installment" && (
          <section className="installment-tab">
            <InstallmentCalculator price={car.price} condition={car.car_condition} />
          </section>
        )}

{activeTab === "inspection" && car.car_condition === "Used" && (
  <section className="inspection">
    <h2 className="inspection-title">
  <i className="fas fa-clipboard-check"></i> {t.inspectionTitle}
</h2>
    <div className="accordion">
      {inspection.map((item, index) => (
        <div key={index} className={`accordion-item ${item.status.toLowerCase()}`}>
          <button
            className="accordion-header"
            onClick={() =>
              setActiveAccordion((prev) =>
                prev === index ? null : index
              )
            }
          >
            <span className="category">
              <i className="fas fa-wrench"></i> {item.category}
            </span>
            <span className={`status-badge ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </button>
          {activeAccordion === index && (
            <div className="accordion-body">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                       item.status === "Good"
                        ? 100
                        : item.status === "Needs Repair"
                        ? 50
                        : item.status === "Damaged"
                        ? 0
                        : 0
                    }%`,
                    background: `${
                      item.status === "Excellent"
                        ? "linear-gradient(to right, #4caf50, #81c784)"
                        : item.status === "Good"
                        ? "linear-gradient(to right, #ffeb3b, #ffc107)"
                        : "linear-gradient(to right, #e57373, #f44336)"
                    }`,
                  }}
                ></div>
              </div>
              <p className="inspection-description">
  {t.inspectionDescription.replace("{category}", item.category.toLowerCase())}
</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
)}
{activeTab === "gallery" && (
  <section className="gallery">
    <h2 className="gallery-title">
  <i className="fas fa-images"></i> {t.galleryTitle}
</h2>
    <div className="gallery-grid">
      {parts.map((part, index) => (
        <div key={index} className="gallery-card" onClick={() => openLightbox(index)}>
          <div className="image-wrapper">
            <img
              src={`http://localhost:5000${part.imageUrl}`}
              alt={part.part}
              className="gallery-image"
            />
            <div className="overlay">
              <span className={`status-badge ${part.status.toLowerCase()}`}>{part.status}</span>
              <p className="overlay-text">{part.part}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Lightbox */}
    {lightbox.isOpen && (
      <div className="lightbox">
        <button className="lightbox-close" onClick={closeLightbox}>
          &times;
        </button>
        <div className="lightbox-content">
          <button className="lightbox-prev" onClick={showPrevious}>
            &lt;
          </button>
          <img
            src={`http://localhost:5000${parts[lightbox.currentIndex].imageUrl}`}
            alt={parts[lightbox.currentIndex].part}
            className="lightbox-image"
          />
          <button className="lightbox-next" onClick={showNext}>
            &gt;
          </button>
        </div>
        <div className="lightbox-navigation">
          {parts.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${lightbox.currentIndex === idx ? "active" : ""}`}
              onClick={() => setLightbox({ isOpen: true, currentIndex: idx })}
            ></span>
          ))}
        </div>
        <p className="lightbox-caption">
          {parts[lightbox.currentIndex].part} -{" "}
          <strong>{parts[lightbox.currentIndex].status}</strong>
        </p>
      </div>
    )}
  </section>
)}








<div className="tab-content">
        {activeTab === "comparison" && (
          <section className="comparison">
            <h2 className="comparison-title">
            <i className="fas fa-balance-scale"></i> {t.comparisonTitle}
            </h2>
            <div className="comparison-filters">
  <div className="filter-group">
  <h3>{t.filterByCondition}</h3>
    <div className="filter-buttons">
      {["New", "Used", "New and Used"].map((item) => (
        <button
          key={item}
          className={`filter-button ${condition === item ? "active" : ""}`}
          onClick={() => setCondition(item)}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
  <div className="filter-group">
  <h3>{t.selectCriteria}</h3>
    <div className="criteria-buttons">
      {availableCriteria.map((criterion) => (
        <button
          key={criterion}
          className={`criteria-button ${selectedCriteria.includes(criterion) ? "active" : ""}`}
          onClick={() =>
            setSelectedCriteria((prev) =>
              prev.includes(criterion)
                ? prev.filter((c) => c !== criterion)
                : [...prev, criterion]
            )
          }
        >
          {criterion}
        </button>
      ))}
    </div>
  </div>
  <button
    onClick={fetchSimilarCars}
    disabled={selectedCriteria.length === 0}
    className="fetch-button"
  >
    Compare Cars
  </button>
</div>

<div className="comparison-results">
  {comparisonResults.length > 0 ? (
    <div className="comparison-cards-container">
      {/* Current Car Card */}
      <div className="comparison-card">
        <h3 className="card-title">{car.brand} {car.model}</h3>
        <img
        src={`http://localhost:5000${car.image_url}`}
        alt={`Elegant ${car.brand} ${car.model}`}
        className="hero-image"
      />
        <p className="card-subtitle">Base Model</p>
        <div className="card-content">
          {selectedCriteria.map((criterion) => (
            <div key={criterion} className="card-item">
              <span className="item-label">{criterion}:</span>
              <span className="item-value">{car[criterion]}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Comparison Cars Cards */}
      {comparisonResults.map((result, index) => (
        <div key={index} className="comparison-card">
          <h3 className="card-title">{result.brand} {result.model}</h3>
          <img
        src={`http://localhost:5000${result.image_url}`}
        alt={`Elegant ${result.brand} ${result.model}`}
        className="hero-image"
      />
          <p className="card-subtitle">Compared Model</p>
          <div className="card-content">
            {selectedCriteria.map((criterion) => (
              <div key={criterion} className="card-item">
                <span className="item-label">{criterion}:</span>
                <span className="item-value">{result[criterion]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="no-comparison-message">Select comparison criteria above.</p>
  )}
</div>
          </section>
        )}
        </div>

      </div>
    </div>
  );
};

export default CarDetailsPage;
