import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from "../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
  const [useremail, setEmail] = useState("");
  const [userpassword, setPassword] = useState("");
  const { login, isLoggedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();



  useEffect(() => {
    if (isLoggedIn && role) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isLoggedIn, role, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(useremail, userpassword);

    try {

      const response = await Api.post(
        "/users/login",
        {
          email: useremail,
          password: Number(userpassword)
        });

      console.log("Response:", response.data);
      const userRole = response.data.userdata.role;

      login({
        token: response.data.token,
        role: userRole,
      });

      toast.success("Login Successfull");

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {

      console.error("Error:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }

    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h2 className="text-center mb-4">Clubhouse Login</h2>

        <form onSubmit={handleLogin}>
          {/* The Email Box */}
          <div className="mb-3">
            <label className="form-label">Enter Email </label>
            <input
              type="email"
              className="form-control"
              placeholder="name@email.com"
              value={useremail}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>


          {/* The Password Box */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={userpassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* The Magic Button */}
          <button type="submit" className="btn btn-primary w-100">
            Open the Gate!
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;