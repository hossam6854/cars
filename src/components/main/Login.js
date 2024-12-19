import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useLanguage } from '../../LanguageContext';
import './css/login.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    en: {
      login: "Login",
      username: "Username",
      password: "Password",
      placeholderUsername: "Enter your username",
      placeholderPassword: "Enter your password",
      loginButton: "Login",
      loadingText: "Logging in...",
      errorMessage: "Login failed. Please try again.",
    },
    ar: {
      login: "تسجيل الدخول",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      placeholderUsername: "أدخل اسم المستخدم الخاص بك",
      placeholderPassword: "أدخل كلمة المرور الخاصة بك",
      loginButton: "تسجيل الدخول",
      loadingText: "...جارٍ تسجيل الدخول",
      errorMessage: ".فشل تسجيل الدخول. حاول مرة أخرى",
    },
  };

  const t = texts[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const { token, role, username, id } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', id);

      login({ role, username, userId: id });
      navigate('/');
    } catch (err) {
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>{t.login}</h2>
      <form onSubmit={handleLogin}>
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
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? t.loadingText : t.loginButton}
        </button>
      </form>
    </div>
  );
}
