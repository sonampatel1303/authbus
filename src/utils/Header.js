import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Components/AuthContext";
import buslogo from '../images/newlogobus.jpg'; // Import the logo
import './Header.css';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src={buslogo} alt="BusSite Logo" className="logo" /> {/* Add the logo */}
            </Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!auth ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
          <li>
            <Link to="/register">Register</Link>
          </li>
          {auth && (
            <li>
              <Link to="/bookingHistory">Booking History</Link>
            </li>
          )}
          {auth && (
            <li>
              <Link to="/findBus">Buses</Link>
            </li>
          )}
           {auth && (
            <li>
              <Link to="/admins">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
