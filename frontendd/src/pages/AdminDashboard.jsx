import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    admin: null,
    pdsLocations: [],
    godowns: [],
  });
  console.log("dashboardData ***:  ",dashboardData);
  
  const [selectedPDS, setSelectedPDS] = useState(null);
  const [selectedGodown, setSelectedGodown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the main admin dashboard data
  const fetchAdminDashboard = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard data");
      }

      const result = await response.json();
      console.log("Admin Dashboard Data:", result);
      setDashboardData({
        admin: result.admin,
        pdsLocations: result.pdsLocations || [],
        godowns: result.godowns || [],
      });
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific PDS dashboard data
  const fetchPDSDashboard = async (pdsId) => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/pds-dashboard/${pdsId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDS dashboard data");
      }

      const result = await response.json();
      console.log("PDS Dashboard Data:", result);
      setSelectedPDS(result.pds);
      console.log('result.pds', result.pds)
      setSelectedGodown(null); // Clear godown selection
    } catch (err) {
      console.error("Error fetching PDS dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific Godown dashboard data
  const fetchGodownDashboard = async (godownId) => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/godown-dashboard/${godownId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Godown dashboard data");
      }

      const result = await response.json();
      console.log("Godown Dashboard Data:", result);
      setSelectedGodown(result.godown);
      setSelectedPDS(null); // Clear PDS selection
    } catch (err) {
      console.error("Error fetching Godown dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePDSSelect = (pdsId) => {
    fetchPDSDashboard(pdsId);
  };

  const handleGodownSelect = (godownId) => {
    fetchGodownDashboard(godownId); // Fixed typo here
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchAdminDashboard();
    } else {
      console.error("No token found in sessionStorage");
      navigate("/"); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    <div className="containerr">
      <div className="dashboard_container">
      <h2>
          Alagappa Chettiar Government College of Engineering & Technology,
          Karaikudi
        </h2>
        <p className="proTitle" >
        Project Title: <strong>Transparent Stock Management in PDS Using GS1-128 FIFO System</strong>
      </p>
        <h2>Admin Dashboard</h2>
        <div className="button-container">
          <button className="logout" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        {/* Admin Details */}
        {dashboardData.admin && (
          <div className="admin-details">
            <h3>Admin Details</h3>
            <ul>
              <li><strong>ID:</strong> {dashboardData.admin.id || "N/A"}</li>
              <li><strong>Name:</strong> {dashboardData.admin.name || "N/A"}</li>
              <li><strong>District:</strong> {dashboardData.admin.district || "N/A"}</li>
            </ul>
          </div>
        )}

        {/* PDS Locations List */}
        <div className="pds-list">
          <h3>PDS Locations</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>PDS Location</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.pdsLocations.length > 0 ? (
                dashboardData.pdsLocations.map((pds) => (
                  <tr key={pds.id}>
                    <td>{pds.pdslocation}</td>
                    <td>{pds.name}</td>
                    <td>
                      <button onClick={() => handlePDSSelect(pds.id)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No PDS locations found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Godowns List */}
        <div className="godown-list">
          <h3>Godowns</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Godown Name</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.godowns.length > 0 ? (
                dashboardData.godowns.map((godown) => (
                  <tr key={godown.id}>
                    <td>{godown.godownname}</td>
                    <td>{godown.name}</td>
                    <td>
                      <button onClick={() => handleGodownSelect(godown.id)}> {/* Fixed typo here */}
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No godowns found</td>
                </tr>
              )}
            </tbody>
          </table>
            </div>

        {/* Selected PDS Details */}
        {selectedPDS && (
          <div className="selected-pds-details">
            <h3>PDS Details: </h3>
            <ul>
              <li><strong>ID:</strong> {selectedPDS.id || "N/A"}</li>
              <li><strong>Incharge Name:</strong> {selectedPDS.name || "N/A"}</li>
              <li><strong>PDS Location:</strong> {selectedPDS.pdslocation || "N/A"}</li>
              <li><strong>Linked Godown:</strong> {selectedPDS.godownname || "Not Linked"}</li>
              <li><strong>District:</strong> {selectedPDS.district || "N/A"}</li>

            </ul>
            <h4>Products</h4>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Weight (kg)</th>
                  <th>Count</th>
                  <th>Total Count</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedPDS.products && selectedPDS.products.length > 0 ? (
                  selectedPDS.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName || "N/A"}</td>
                      <td>{product.weight || "N/A"}</td>
                      <td>{product.count || 0}</td>
                      <td>{product.totalCount || 0}</td>
                      <td>{product.date ? new Date(product.date).toISOString().split('T')[0] : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected Godown Details */}
        {selectedGodown && (
          <div className="selected-godown-details">
            <h3>Godown Details: </h3>
            <ul>
              <li><strong>ID:</strong> {selectedGodown.id || "N/A"}</li>
              <li><strong>Incharge Name:</strong> {selectedGodown.name || "N/A"}</li>
              <li><strong>Godown Name:</strong> {selectedGodown.godownname || "N/A"}</li>
              <li><strong>District:</strong> {selectedGodown.district || "N/A"}</li>
              
            </ul>
            <h4>Products</h4>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Weight (kg)</th>
                  <th>Goods In</th>
                  <th>Goods Out</th>
                  <th>PDS ID</th>
                  <th>Total Count</th>
                  <th>Pending Count</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedGodown.products && selectedGodown.products.length > 0 ? (
                  selectedGodown.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName || "N/A"}</td>
                      <td>{product.weight || "N/A"}</td>
                      <td>{product.goodsInCount || 0}</td>
                      <td>{product.goodsOutCount || 0}</td>
                      <td>{product.pdsId || "N/A"}</td>
                      <td>{product.totalCount || 0}</td>
                      <td>{product.pendingCount || 0}</td>
                      <td>{product.date ? new Date(product.date).toISOString().split('T')[0] : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;