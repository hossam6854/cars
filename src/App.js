import React from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { LanguageProvider } from './LanguageContext';


import Navbar from "./components/main/Navbar";
import Login from "./components/main/Login";
import Signup from "./components/main/Signup";
import Hero from "./components/main/Hero";
import Footer from "./components/main/Footer";
import { AuthProvider } from "./components/main/AuthContext";
import Forbidden from "./components/main/Forbidden";
import ProtectedRouteuser from "./components/main/ProtectedRouteuser";
import ProtectedRoute from "./components/main/ProtectedRoute";

import CarSalePage from "./components/user/CarSalePage";
import ComparePage from "./components/user/ComparePage";
import Sell from "./components/user/Sell";
import BookingPage from "./components/user/BookingPage";
import ChatUser from "./components/user/ChatUser";
import CarDetails from "./components/user/CarDetails";

import AdminDashboard from "./components/admin/AdminDashboard";
import Admin from "./components/admin/AdminForm";
import DataEntry from "./components/admin/adminpage2";
import DynamicLabelsPage from "./components/admin/DynamicLabelsPage";
import Admin1 from "./components/admin/SecondAdminPage";
import AdminBookingPage from "./components/admin/AdminBookingPage";
import AdminChat from "./components/admin/AdminChat";
import AdminNotifications from "./components/admin/AdminNotifications";


import "./App.css";

const AdminChatWrapper = () => {
  const { userId } = useParams(); // الحصول على userId من المسار
  return <AdminChat initialUser={userId} />;
};

function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* المسارات العامة */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* مسارات المستخدم */}
            <Route path="/carsale" element={<CarSalePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route
              path="/chatuser"
              element={
                <ProtectedRouteuser>
                  <ChatUser />
                </ProtectedRouteuser>
              }
            />
            <Route
              path="/sell"
              element={
                <ProtectedRouteuser>
                  <Sell />
                </ProtectedRouteuser>
              }
            />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/cars/:id/book" element={<BookingPage />} />



            {/* مسارات المسؤول */}
            <Route path="/adminnotifications" element={<AdminNotifications />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-entry"
              element={
                <ProtectedRoute>
                  <DataEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dynamic-labels"
              element={
                <ProtectedRoute>
                  <DynamicLabelsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin1"
              element={
                <ProtectedRoute>
                  <Admin1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminbookingpage"
              element={
                <ProtectedRoute>
                  <AdminBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-chat/:userId"
              element={
                <ProtectedRoute>
                  <AdminChatWrapper />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </LanguageProvider>

  );
}

export default App;
