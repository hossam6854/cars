import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useLanguage } from '../../LanguageContext';
import AdminNotifications from "../admin/AdminNotifications";
import UserNotifications from "../user/UserNotifications";



import './css/Navbar.css';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useLanguage(); // استخدام سياق اللغة
  const [active, setActive] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  
  


  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/login');
  };

  const handleClick = (item) => {
    setActive(item);
    if (isOpen) setIsOpen(false);
  };

  // النصوص بلغتين
  const texts = {
    en: {
      home: 'Home',
      buy: 'Buy',
      sell: 'Sell',
      contact: 'Contact Us',
      addCar: 'Add Car',
      bookedCars: 'Booked Cars',
      adminChat:'Admin Chat',
      adminDashboard: 'Admin Dashboard',
      signup: 'Sign Up',
      login: 'Login',
      logout: 'Logout',
      toggleLanguage: 'Switch to Arabic',
      notifications: 'Notifications',
      noNotifications: 'No Notifications',
    },
    ar: {
      home: 'الرئيسية',
      buy: 'شراء',
      sell: 'بيع',
      contact: 'اتصل بنا',
      addCar: 'إضافة سيارة',
      bookedCars: 'السيارات المحجوزة',
      adminChat:'دردشة المسؤول',
      adminDashboard: 'لوحة تحكم المسؤول',
      signup: 'إنشاء حساب',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      toggleLanguage: 'التبديل إلى الإنجليزية',
      notifications: 'الإشعارات',
      noNotifications: 'لا توجد إشعارات',
    },
  };

  const t = texts[language]; // النصوص بناءً على اللغة المختارة

  return (
    <header className="navbar">
      
      <div className="logo">4Matic Motors</div>
      <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" className={active === '/' ? 'active' : ''} onClick={() => handleClick('/')}>
          {t.home}
        </Link>

        {(!auth.isLoggedIn || auth.role === 'user') && (
          <>
            <Link to="/carsale" className={active === '/carsale' ? 'active' : ''} onClick={() => handleClick('/carsale')}>
              {t.buy}
            </Link>
            <Link to="/sell" className={active === '/sell' ? 'active' : ''} onClick={() => handleClick('/sell')}>
              {t.sell}
            </Link>
            <Link to="#contact" className={active === '#contact' ? 'active' : ''} onClick={() => handleClick('#contact')}>
              {t.contact}
            </Link>
          </>
        )}

{auth.role === 'user' && (
          <>
            <UserNotifications/>
          </>
        )}

        {auth.isLoggedIn && auth.role === 'admin' && (
          <>
          
            <Link to="/admin" className={active === '/admin' ? 'active' : ''} onClick={() => handleClick('/admin')}>
              {t.addCar}
            </Link>
            <Link
              to="/AdminBookingPage"
              className={active === '/AdminBookingPage' ? 'active' : ''} onClick={() => handleClick('/AdminBookingPage')}>
              {t.bookedCars}
            </Link>
            <Link
              to="/admindashboard"
              className={active === '/admindashboard' ? 'active' : ''} onClick={() => handleClick('/admindashboard')}>
              {t.adminDashboard}
            </Link>
            <Link
      to={`/admin-chat/${auth.userId}`} // dynamically insert userId
      className={active === `/admin-chat/${auth.userId}` ? 'active' : ''}
      onClick={() => handleClick(`/admin-chat/${auth.userId}`)}
    >
      {t.adminChat}
    </Link>
            <AdminNotifications/>
          </>
        )}

        {!auth.isLoggedIn ? (
          <>
            <Link to="/signup" className={active === '/signup' ? 'active' : ''} onClick={() => handleClick('/signup')}>
              {t.signup}
            </Link>
            <Link to="/login" className={active === '/login' ? 'active' : ''} onClick={() => handleClick('/login')}>
              {t.login}
            </Link>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>
            {t.logout}
          </button>
        )}
      </nav>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      {isOpen && (
        <button className="close-menu" onClick={() => setIsOpen(false)}>
          ×
        </button>
      )}
      


      <button className="language-toggle" onClick={toggleLanguage}>
        {t.toggleLanguage}
      </button>
    </header>
  );
};

export default Navbar;
