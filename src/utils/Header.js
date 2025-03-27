import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Components/AuthContext";
import buslogo from '../images/newlogobus.jpg';
import './Header.css';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears auth state in context
    localStorage.removeItem("token"); // Removes token from local storage
    navigate("/login"); // Navigates to login page
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src={buslogo} alt="BusSite Logo" className="logo" />
            </Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>

          {!auth ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>

              {/* Role-based Navigation */}
              {auth.role === "User" && (
                <>
                  <li>
                    <Link to="/findBus">Find Bus</Link>
                  </li>
                  <li>
                    <Link to="/bookingHistory">Booking History</Link>
                  </li>
                  
                </>
              )}

              {auth.role === "BusOperator" && (
                <>
                  <li>
                    <Link to="/admins">Admin Control</Link> {/* Bus operators can access admin control */}
                  </li>
                </>
              )}

              {auth.role === "Admin" && (
                <>
                  <li>
                    <Link to="/admins">Admin Control</Link> {/* Admin can access all sections */}
                  </li>
                  <li>
                    <Link to="/payments">Payments</Link> {/* Admin can access payments */}
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;