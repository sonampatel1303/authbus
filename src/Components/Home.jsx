import React, {useEffect, useContext}from "react";
import { Link } from "react-router-dom";
import img1 from '../images/image1.jpg';
import img2 from '../images/image2.jpg';
import img3 from '../images/image3.jpg';
import img4 from '../images/image4.jpg';
import "./Home.css";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";


const Home = () => {
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    if (auth && auth.role === 'User') { 
      toast.success('Welcome User!', {
        position: 'top-right',
        autoClose: 3000,
        toastId: 'welcome-user-toast',
      });
    }
  }, [auth]);
  return (
    <main className="home-container">
      <section className="hero">
        <h1>Welcome to FastX Bus Booking</h1>
        <p>Your one-stop solution for seamless travel across the country.</p>
        <Link to="/findBus" className="cta-button">
          Book Your Ticket Now
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <img src={img1} alt="Book Tickets" className="feature-image" />
          <h2>Book Tickets</h2>
          <p>Find and book buses to your destination with ease.</p>
          <Link to="/findBus" className="feature-link">Explore Routes</Link>
        </div>

        <div className="feature">
          <img src={img4} alt="Manage Your Trip" className="feature-image" />
          <h2>Manage Your Trip</h2>
          <p>View and manage your bookings anytime, anywhere.</p>
          <Link to="/bookingHistory" className="feature-link">View Bookings</Link>
        </div>

        <div className="feature">
          <img src={img3} alt="Multiple Payment Modes" className="feature-image" />
          <h2>Multiple Payment Modes</h2>
          <p>Pay securely using your preferred method: Credit Card, UPI, Net Banking, or Wallets.</p>
          <Link to="/payments" className="feature-link">Proceed to Payment</Link>
        </div>

        <div className="feature">
          <img src={img2} alt="Travel Across the Country" className="feature-image" />
          <h2>Travel Across the Country</h2>
          <p>Enjoy a hassle-free journey to any destination in India.</p>
          <Link to="/findBus" className="feature-link">Start Your Journey</Link>
        </div>
      </section>
    </main>
  );
};

export default Home;