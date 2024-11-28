import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext"; // Import the AuthContext
import './bookingHistory.css';

const BookingHistory = () => {
  const [userId, setUserId] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Access the token from AuthContext
  const { auth } = useContext(AuthContext);

  const handleFetchBookingHistory = async () => {
    if (!userId) {
      setErrorMessage("Please enter a User ID.");
      return;
    }

    try {
      console.log('Auth Token:', auth); // Log the token to ensure it's correct
      const response = await axios.get(`https://localhost:7201/api/Booking/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth}`, // Send the token as a Bearer token
        },
      });

      console.log('Response Status:', response.status); // Log the response status
      console.log('Response Data:', response.data); // Log the response to inspect the structure

      // Ensure response contains data in the correct format
      if (response.status === 200 && response.data && response.data.$values) {
        setBookingHistory(response.data.$values); // Access the array from $values
        setErrorMessage(""); // Clear any error message if data is found
      } else if (response.status === 200 && (!response.data || !response.data.$values || response.data.$values.length === 0)) {
        setErrorMessage("No booking history found for this User ID.");
      } else {
        setErrorMessage("Failed to fetch booking history. Please check the User ID.");
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Unauthorized. Please log in.");
      } else {
        setErrorMessage("Failed to fetch booking history. Please check the User ID.");
      }
    }
  };

  return (
    <div className="booking-history-container">
      <h2>Booking History</h2>
      <input
        type="number"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="user-id-input"
      />
      <button onClick={handleFetchBookingHistory} className="fetch-button">Fetch Booking History</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="booking-list">
        {bookingHistory.length > 0 ? (
          bookingHistory.map((booking) => (
            <div className="booking-item" key={booking.bookingId}>
              <h3>Booking ID: {booking.bookingId}</h3>
              <div className="booking-details">
                <p><strong>Route ID:</strong> {booking.routeId}</p>
                <p><strong>Number of Seats:</strong> {booking.numberofSeats}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.bookingStatus}</p>
                <p><strong>BookingDate:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings to display.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
