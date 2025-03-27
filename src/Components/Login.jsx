import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/AuthService"; // Make sure the service is updated
import AuthContext from "../Components/AuthContext";
import '../Components/Login.css' // Context to manage global auth state

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useContext(AuthContext); // Using context to store user auth data globally
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, role } = await login(username, password);

      // Save the token and role to AuthContext and localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "Admin") {
        navigate("/admins");
      } else if (role === "User") {
        navigate("/");
      } else if (role === "BusOperator") {
        navigate("/admins");
      }
      setAuth({token, role})
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="fas fa-user"></i>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock"></i>
              <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
         
          <button type="submit">Login</button>
        </form>
    </div>
    
  );
};

export default Login;