import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7201/api/Authentication/register", {
        username,
        email,
        password,
        role, // Include role in the request
      });
      toast.success(response.data.message || "Registration successful");
      // Redirect to login page
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("Registration failed: Unable to connect to server");
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>

        <div className="form-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="BusOperator">Bus Operator</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
