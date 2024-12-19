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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  CircularProgress,
} from "@mui/material";
import "./css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  const navigate = useNavigate();

  const handleChat = (userId) => {
    navigate(`/admin-chat/${userId}`);
  };

  // Fetch car sale requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/carsales");
        setRequests(response.data);
        setFilteredRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car sale requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = requests.filter(
      (req) =>
        req.make?.toLowerCase().includes(value) ||
        req.model?.toLowerCase().includes(value)
    );
    setFilteredRequests(filtered);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    const filtered = requests.filter((req) =>
      value ? req.status === value : true
    );
    setFilteredRequests(filtered);
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/carsales/approve/${id}`);
      alert("Request approved successfully!");
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter a rejection reason (optional):");
    try {
      await axios.post(`http://localhost:5000/api/carsales/reject/${id}`, { reason });
      alert("Request rejected successfully!");
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className={`admin-dashboard`}>
      <div className="header">
        <h2>Car Sale Requests</h2>
      </div>
      <div className="controls">
        <TextField
          label="Search by Make/Model"
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
          <MenuItem value="Approved">Approved</MenuItem>
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
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Transmission</TableCell>
                <TableCell>Engine Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((request) => (
                <TableRow
                  key={request.id}
                  onClick={() => handleOpenDialog(request)}
                >
                  <TableCell>
                    <img
                      src={`http://localhost:5000${request.image_url}`}
                      alt={`${request.make} ${request.model}`}
                      className="car-image"
                    />
                  </TableCell>
                  <TableCell>{request.make || "N/A"}</TableCell>
                  <TableCell>{request.model || "N/A"}</TableCell>
                  <TableCell>{request.condition || "N/A"}</TableCell>
                  <TableCell>{request.year || "N/A"}</TableCell>
                  <TableCell>{request.transmission || "N/A"}</TableCell>
                  <TableCell>{request.engineSize || "N/A"}</TableCell>
                  <TableCell>{request.status || "No Request"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request.id);
                      }}
                      disabled={request.status === "Approved"}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(request.id);
                      }}
                      disabled={request.status === "Rejected"}
                    >
                      Reject
                    </Button>

                    <Button
                variant="contained"
                color="primary"
                onClick={() => handleChat(request.user_id)}
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
        count={Math.ceil(filteredRequests.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="pagination"
      />

      {selectedRequest && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            <p>
              <strong>Make:</strong> {selectedRequest.make}
            </p>
            <p>
              <strong>Model:</strong> {selectedRequest.model}
            </p>
            <p>
              <strong>Price:</strong> $
              {selectedRequest.price?.toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Contact:</strong> {selectedRequest.phone}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
