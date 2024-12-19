import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../LanguageContext';
import './css/signup.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    en: {
      signup: "Sign Up",
      username: "Username",
      email: "Email",
      password: "Password",
      terms: "I accept the terms and conditions.",
      placeholderUsername: "Enter your username",
      placeholderEmail: "Enter your email",
      placeholderPassword: "Enter your password",
      signupButton: "Sign Up",
      loadingText: "Signing up...",
      errorTerms: "You must accept the terms and conditions.",
      errorEmail: "Enter a valid email address.",
      errorPassword: "Password must be at least 6 characters.",
      successMessage: "Signup successful!",
    },
    ar: {
      signup: "إنشاء حساب",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      terms: ".أوافق على الشروط والأحكام",
      placeholderUsername: "أدخل اسم المستخدم الخاص بك",
      placeholderEmail: "أدخل بريدك الإلكتروني",
      placeholderPassword: "أدخل كلمة المرور الخاصة بك",
      signupButton: "إنشاء حساب",
      loadingText: "...جارٍ إنشاء الحساب",
      errorTerms: "يجب أن توافق على الشروط والأحكام.",
      errorEmail: "أدخل بريدًا إلكترونيًا صالحًا.",
      errorPassword: ".يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل",
      successMessage: "تم إنشاء الحساب بنجاح!",
    },
  };

  const t = texts[language];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignup = async () => {
    setError('');

    if (!formData.acceptedTerms) {
      setError(t.errorTerms);
      return;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t.errorEmail);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.errorPassword);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/signup', formData);
      alert(t.successMessage);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t.errorPassword);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <h2>{t.signup}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <label htmlFor="username">{t.username}</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder={t.placeholderUsername}
          required
        />

        <label htmlFor="email">{t.email}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t.placeholderEmail}
          required
        />

        <label htmlFor="password">{t.password}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t.placeholderPassword}
          required
        />

        <label className="terms">
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
          />
          {t.terms}
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? t.loadingText : t.signupButton}
        </button>
      </form>
    </div>
  );
}
