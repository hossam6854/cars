import React, { useContext } from 'react';
import { FaHandshake, FaBolt, FaCheckCircle, FaHeadset, FaLightbulb, FaQuoteLeft, FaStar } from 'react-icons/fa';
import './css/Hero.css';
import Img1 from '../images/2.png';

import { AuthContext } from './AuthContext';
import { useLanguage } from '../../LanguageContext'; // استيراد سياق اللغة
import ChatUser from '../user/ChatUser';

const Hero = () => {
  const { auth } = useContext(AuthContext);
  const { language } = useLanguage(); // استخدام سياق اللغة

  // النصوص باللغتين
  const texts = {
    en: {
      welcome: "Welcome to",
      subtitle: "Your trusted destination for buying and selling cars with ease and confidence.",
      whyChooseUs: "Why Choose Us",
      dreamsMeetRoad: "Where dreams meet the road, and every car tells a story.",
      effortlessDealing: "Effortless Dealing",
      effortlessDescription: "Navigate our user-friendly platform designed to make car buying and selling as smooth as a luxury ride.",
      lightningSpeed: "Lightning Speed",
      lightningDescription: "Experience fast performance—from searching for cars to finalizing your transaction.",
      uncompromisingQuality: "Uncompromising Quality",
      uncompromisingDescription: "Verified vehicles meeting our high standards of quality ensure peace of mind.",
      support: "24/7 Support",
      supportDescription: "Our team is always here to help, offering guidance and support around the clock.",
      innovativeFeatures: "Innovative Features",
      innovativeDescription: "Advanced filters, AI-driven recommendations, and car comparisons tailored for you.",
      userOpinions: "What Our Users Say",
      trustedReviews: "Your trusted reviews drive us forward.",
      trustedBrands: "Our Trusted Brands",
      testimonials: [
        { quote: "4Matic Motors helped me sell my car in just two days! Highly recommend it.", name: "Ahmed H.", rating: 5 },
        { quote: "Found my dream car at an amazing price. Excellent service!", name: "Salma K.", rating: 4 },
        { quote: "Best platform for car lovers. The process was so easy and quick!", name: "Omar A.", rating: 4.5 },
      ],
      brands: ["Toyota", "BMW", "Mercedes", "Audi", "Honda", "Chevrolet", "Nissan"],
    },
    ar: {
      welcome: "مرحبًا بكم في",
      subtitle: ".وجهتكم الموثوقة لشراء وبيع السيارات بسهولة وثقة",
      whyChooseUs: "لماذا تختارنا",
      dreamsMeetRoad: ".حيث تلتقي الأحلام بالطريق، وكل سيارة تروي قصة",
      effortlessDealing: "سهولة التعامل",
      effortlessDescription: ".استمتع بمنصتنا السهلة المصممة لجعل شراء وبيع السيارات سلسًا مثل قيادة سيارة فاخرة",
      lightningSpeed: "سرعة البرق",
      lightningDescription: ".استمتع بأداء سريع - من البحث عن السيارات إلى إنهاء المعاملة",
      uncompromisingQuality: "جودة لا تقبل المساومة",
      uncompromisingDescription: ".سيارات موثوقة تلبي معاييرنا العالية لضمان راحة بالك",
      support: "الدعم على مدار الساعة",
      supportDescription: ".فريقنا دائمًا هنا لمساعدتك، وتقديم الإرشادات والدعم على مدار اليوم",
      innovativeFeatures: "ميزات مبتكرة",
      innovativeDescription: ".مرشحات متقدمة، توصيات مدعومة بالذكاء الاصطناعي، ومقارنات سيارات مخصصة لك",
      userOpinions: "ماذا يقول مستخدمونا",
      trustedReviews: ".مراجعاتكم الموثوقة تحفزنا على التقدم",
      trustedBrands: "علاماتنا التجارية الموثوقة",
      testimonials: [
        { quote: ".ساعدني في بيع سيارتي خلال يومين فقط! أوصي به بشدة", name: "أحمد ح.", rating: 5 },
        { quote: "!وجدت سيارة أحلامي بسعر مذهل. خدمة ممتازة", name: "سلمى ك.", rating: 4 },
        { quote: "أفضل منصة لمحبي السيارات. كانت العملية سهلة وسريعة", name: "عمر أ.", rating: 4.5 },
      ],
      brands: ["تويوتا", "بي إم دبليو", "مرسيدس", "أودي", "هوندا", "شيفروليه", "نيسان"],
    },
  };

  const t = texts[language]; // النصوص النشطة بناءً على اللغة المختارة

  return (
    <section className="hero">
      {/* قسم الترحيب */}
      <div className="hero-header">
        <div className="hero-content">
          <h1>
            {t.welcome} <p>4Matic Motors</p>
          </h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="hero-image">
          <img src={Img1} alt="Dream Car" />
        </div>
      </div>

      {/* لماذا تختارنا */}
      <div className="why-choose-us">
        <h2>{t.whyChooseUs}</h2>
        <p>{t.dreamsMeetRoad}</p>
        <div className="benefits">
          <div className="benefit-item">
            <FaHandshake className="icon" />
            <h3>{t.effortlessDealing}</h3>
            <p>{t.effortlessDescription}</p>
          </div>
          <div className="benefit-item">
            <FaBolt className="icon" />
            <h3>{t.lightningSpeed}</h3>
            <p>{t.lightningDescription}</p>
          </div>
          <div className="benefit-item">
            <FaCheckCircle className="icon" />
            <h3>{t.uncompromisingQuality}</h3>
            <p>{t.uncompromisingDescription}</p>
          </div>
          <div className="benefit-item">
            <FaHeadset className="icon" />
            <h3>{t.support}</h3>
            <p>{t.supportDescription}</p>
          </div>
          <div className="benefit-item">
            <FaLightbulb className="icon" />
            <h3>{t.innovativeFeatures}</h3>
            <p>{t.innovativeDescription}</p>
          </div>
        </div>
      </div>

      {/* آراء المستخدمين */}
      <div className="user-opinions">
        <h2>{t.userOpinions}</h2>
        <p>{t.trustedReviews}</p>
        <div className="testimonials">
          {t.testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial">
              <FaQuoteLeft className="quote-icon" />
              <p className="quote">{testimonial.quote}</p>
              <div className="user-info">
                <span className="user-name">{testimonial.name}</span>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(testimonial.rating) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* العلامات التجارية */}
      <div className="famous-brands">
        <h2>{t.trustedBrands}</h2>
        <div className="brand-grid">
          {t.brands.map((brand, index) => (
            <div className="brand-item" key={index}>
              <p>{brand}</p>
            </div>
          ))}
        </div>
      </div>

      {/* الدردشة إذا كان المستخدم مسجل الدخول */}
      {auth.isLoggedIn && auth.role === 'user' && <ChatUser />}
    </section>
  );
};

export default Hero;
