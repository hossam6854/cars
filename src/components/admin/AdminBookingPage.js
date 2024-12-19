import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const handleChat = (userId) => {
    navigate(`/admin-chat/${userId}`);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings");
        setBookings(response.data);
        setFilteredBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = bookings.filter(
      (booking) =>
        booking.brand?.toLowerCase().includes(value) ||
        booking.model?.toLowerCase().includes(value) ||
        booking.name?.toLowerCase().includes(value)
    );
    setFilteredBookings(filtered);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    const filtered = bookings.filter((booking) =>
      value ? booking.status === value : true
    );
    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
        status,
      });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
      alert(`Booking ${status} successfully.`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h2>Booking Requests</h2>
      </div>
      <div className="controls">
        <TextField
          label="Search by Brand/Model/Name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="search-box"
        />
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          displayEmpty
          className="filter-select"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Accepted">Accepted</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </div>
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Car Image</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <img
                      src={`http://localhost:5000${booking.image_url}`}
                      alt={`${booking.brand} ${booking.model}`}
                      className="car-image"
                    />
                  </TableCell>
                  <TableCell>{booking.brand || "N/A"}</TableCell>
                  <TableCell>{booking.model || "N/A"}</TableCell>
                  <TableCell>{booking.name || "N/A"}</TableCell>
                  <TableCell>{booking.status || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange(booking.id, "Accepted")}
                      disabled={booking.status === "Accepted"}
                    >
                      <FaCheckCircle /> Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleStatusChange(booking.id, "Rejected")}
                      disabled={booking.status === "Rejected"}
                    >
                      <FaTimesCircle /> Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleChat(booking.user_id)}
                    >
                      Chat with User
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination
        count={Math.ceil(filteredBookings.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="pagination"
      />
    </div>
  );
};

export default AdminBookingPage;
