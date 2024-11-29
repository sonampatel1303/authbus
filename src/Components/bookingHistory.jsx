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

  const handleCancelBooking = async (bookingId) => {
    try {
      // Make a PUT request to cancel the booking
      const response = await axios.put(
        `https://localhost:7201/api/Booking/${bookingId}`,
        {},  // No body is needed as the ID is passed in the URL
        {
          headers: {
            Authorization: `Bearer ${auth}`,  // Send the token as a Bearer token
          }
        }
      );

      if (response.status === 200) {
        // Filter out the cancelled booking from the booking history list
        setBookingHistory((prevHistory) =>
          prevHistory.filter((booking) => booking.bookingId !== bookingId)
        );
        alert(response.data);  // Show the success message
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);

      // Check if the error is related to the booking already being cancelled
      if (error.response && error.response.status === 400) {
        alert(error.response.data);  // Display the custom error message
      } else {
        alert("An error occurred while cancelling the booking.");
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
          bookingHistory.map((booking) => {
            // Check if the booking date is greater than the current date
            const bookingDate = new Date(booking.bookingDate);
            const currentDate = new Date();
            const canCancel = bookingDate > currentDate; // Allow cancel if booking date is in the future

            return (
              <div className="booking-item" key={booking.bookingId}>
                <h3>Booking ID: {booking.bookingId}</h3>
                <div className="booking-details">
                  <p><strong>Route ID:</strong> {booking.routeId}</p>
                  <p><strong>Number of Seats:</strong> {booking.numberofSeats}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                  <p><strong>Status:</strong> {booking.bookingStatus}</p>
                  <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                </div>

                {/* Only show the cancel button if the booking date is in the future */}
                {canCancel && booking.bookingStatus !== "Cancelled" && (
                  <button onClick={() => handleCancelBooking(booking.bookingId)} className="cancel-button">
                    Cancel Booking
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>No bookings to display.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
