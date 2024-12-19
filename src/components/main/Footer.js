import React from 'react';
import { Link } from 'react-router-dom'; // For internal routing
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // React Icons
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h2>4Matic Motors</h2>
          <p className="footer-description">
            Find, buy, and sell cars effortlessly with 4Matic Motors. Your ultimate car marketplace.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p className="footer-text">123 Main Street, Cairo, Egypt</p>
          <p className="footer-text">Email: support@4maticmotors.com</p>
          <p className="footer-text">Phone: +20 123 456 7890</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <Link to="/facebook" aria-label="Facebook" className="social-icon"><FaFacebook /></Link>
            <Link to="/twitter" aria-label="Twitter" className="social-icon"><FaTwitter /></Link>
            <Link to="/instagram" aria-label="Instagram" className="social-icon"><FaInstagram /></Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 4Matic Motors. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
