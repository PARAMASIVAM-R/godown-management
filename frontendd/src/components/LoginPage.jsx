

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [selectedrole, setSelectedrole] = useState("Admin");
  const navigate = useNavigate();

  // ✅ Handle Input Changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Redirect to Appropriate Dashboard
  const navigateToDashboard = (role, name, district, pdslocation, godownName) => {
    console.log("Navigating to:", role); // Debugging log

    // ✅ Pass extra user info if needed in state
    switch (role) {
      case "Admin":
        navigate("/admin-dashboard", {
          state: { role, name, district },
        });
        break;
      case "Godown Incharge":
        navigate("/godown-dashboard", {
          state: { role, name, godownName, district },
        });
        break;
      case "PDS Incharge":
        navigate("/pds-dashboard", {
          state: { role, name, pdslocation, district },
        });
        break;
      default:
        alert("Unauthorized role detected!");
    }
  };

  // ✅ Handle Form Submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // ✅ Send Correct Payload to Backend
  //   const loginPayload = {
  //     role: selectedrole, // Send the role to validate against backend
  //     id: formData.id,
  //     password: formData.password,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(loginPayload),
        
        
  //     });
  //     console.log("loginPayload  :", loginPayload);

  //     const data = await response.json();
  //     if (!response.ok) return alert(data.message);

  //     // ✅ Store token & user details securely
  //     sessionStorage.setItem("token", data.token);
  //     sessionStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         role:        data.user.role,
  //         name:        data.user.name,
  //         district:    data.user.district || "",
  //         pdslocation: data.user.pdslocation || "",
  //         godownName:  data.user.godownName || "",
  //       })
  //     );

      
  //     console.log('***************data :',data )
  //     console.log("Backend role:", data.user.role); // Debugging
  //     console.log("Selected role:", selectedrole); // Debugging

  //     // ✅ Validate role from backend
  //     if (data.user.role !== selectedrole) {
  //       alert(
  //         `Invalid login: You are registered as ${data.user.role}, not ${selectedrole}`
  //       );
  //       return;
  //     }

  //     // ✅ Navigate to Correct Dashboard
  //     navigateToDashboard(
  //       data.user.role,
  //       data.user.name,
  //       data.user.district,
  //       data.user.pdslocation,
  //       data.user.godownName
  //     );
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Login failed!");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // ✅ Constructing the login payload
    const loginPayload = {
      role: selectedrole, // Send the role to validate against backend
      id: formData.id,
      password: formData.password,
    };
  
    console.log("Sending loginPayload:", loginPayload); // Log payload
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });
  
      console.log("Raw response:", response); // Debugging response object
  
      const data = await response.json();
      console.log("Response data:", data); // Log actual response
  
      if (!response.ok) {
        alert(data.message || "Login failed!");
        return;
      }
  
      // ✅ Store token & user details securely
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          role: data.role,
          name: data.name,
          district: data.district || "",
          pdslocation: data.pdslocation || "",
          godownName: data.godownName || "",
        })
      );
  
      console.log("Login successful:", data);
  
      // ✅ Validate role from backend
      if (data.role !== selectedrole) {
        alert(
          `Invalid login: You are registered as ${data.role}, not ${selectedrole}`
        );
        return;
      }
  
      // ✅ Navigate to Correct Dashboard
      navigateToDashboard(
        data.role,
        data.name,
        data.district,
        data.pdslocation,
        data.godownName
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed!");
    }
  };
  

  return (
    <div className="login-body">
    
      {/* <div className="background-blur" /> */}
      
      <div className="login-content">
      <h2  className="college" >Alagappa Chettiar Government College of Engineering & Technology, <br></br>Karaikudi</h2>

        <div className="login-container">
        <h2 className="login-title">Select User Type</h2>
        <div className="user-selection">
          {["Admin", "Godown Incharge", "PDS Incharge"].map((type) => (
            <button
              key={type}
              className={`user-selection-button ${
                selectedrole === type ? "active" : ""
              }`}
              onClick={() => setSelectedrole(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <h3 className="login-subtitle">{selectedrole} Login</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            name="id"
            placeholder={`${selectedrole} ID`}
            onChange={handleChange}
            required
          />
          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button className="login-submit-button" type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <a className="login-link" href="/register">
            Register
          </a>
        </p>
        <p>
          Otherwise go {" "}
          <a className="login-link" href="/">
            Home
          </a>
        </p>
      </div>
     </div>

    </div>
  );
};

export default LoginPage;
