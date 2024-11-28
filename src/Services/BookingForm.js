import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ route, onClose }) => {
  const [bookingDetails, setBookingDetails] = useState({
    userId: '', // This will be entered manually by the user
    routeId: route.routeId,
    numberOfSeats: 1,
    totalPrice: route.bus.pricePerSeat,
    bookingDate: new Date().toISOString().slice(0, 16), // Default to current date and time, formatted for datetime-local
    bookingStatus: 'Booked', // Default status
    paymentMode: 'Online',  // Default payment mode
  });
  
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      totalPrice: name === 'numberOfSeats' ? value * route.bus.pricePerSeat : prevDetails.totalPrice,
    }));
  };

  const submitBooking = () => {
    // Reset error messages before submitting
    setError('');
    setPaymentError('');

    // Send the booking details to your API endpoint
    axios
      .post('https://localhost:7201/api/Booking', bookingDetails, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      })
      .then((response) => {
        alert('Booking successful!');
        const bookingId = response.data.bookingId; // Ensure bookingId is returned

        // Now submit the payment with the bookingId
        submitPayment(bookingId); // Pass the bookingId to the payment function
        onClose(); // Close the booking form after successful booking
      })
      .catch((error) => {
        console.error('Error booking ticket:', error);
        setError('There was an error processing your booking. Please try again.');
      });
  };

  const submitPayment = (bookingId) => {
    // Prepare the payment details
    const paymentDetails = {
      bookingId: bookingId, // Pass the bookingId to the payment
      paymentAmount: bookingDetails.totalPrice,
      paymentMode: bookingDetails.paymentMode,
      paymentDate: new Date().toISOString(), // Set current date for payment
      status: bookingDetails.paymentMode === 'Online' ? 'Completed' : 'Pending', // Set status based on payment mode
    };

    console.log("Payment details being sent:", paymentDetails); // Log the payment details for debugging

    // Send the payment details to your API endpoint
    axios
      .post('https://localhost:7201/api/Payments', paymentDetails, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      })
      .then((response) => {
        console.log('Payment response:', response.data); // Log the response from the API
        alert('Payment successful!');
      })
      .catch((error) => {
        console.error('Error processing payment:', error);
        setPaymentError('There was an error processing your payment. Please try again.');
      });
  };

  // Get today's date and time in the format required for datetime-local input
  const today = new Date().toISOString().slice(0, 16); // "yyyy-mm-ddThh:mm"

  return (
    <div className="booking-form">
      <h2>Book Ticket</h2>
      {error && <div className="error-message">{error}</div>}
      {paymentError && <div className="error-message">{paymentError}</div>}
      <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }}>
        <div>
          <label htmlFor="userId">User ID</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={bookingDetails.userId}
            onChange={handleBookingChange}
            required
          />
        </div>
        <div>
          <label htmlFor="routeId">Route ID</label>
          <input
            type="text"
            id="routeId"
            name="routeId"
            value={bookingDetails.routeId}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="numberOfSeats">Number of Seats</label>
          <input
            type="number"
            id="numberOfSeats"
            name="numberOfSeats"
            value={bookingDetails.numberOfSeats}
            onChange={handleBookingChange}
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="totalPrice">Total Price</label>
          <input
            type="text"
            id="totalPrice"
            name="totalPrice"
            value={`₹${bookingDetails.totalPrice}`}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="bookingDate">Booking Date & Time</label>
          <input
            type="datetime-local"
            id="bookingDate"
            name="bookingDate"
            value={bookingDetails.bookingDate}
            onChange={handleBookingChange}
            min={today} // Set the min date to today's date and time
          />
        </div>
        <div>
          <label htmlFor="bookingStatus">Booking Status</label>
          <input
            type="text"
            id="bookingStatus"
            name="bookingStatus"
            value={bookingDetails.bookingStatus}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="paymentMode">Payment Mode</label>
          <select
            id="paymentMode"
            name="paymentMode"
            value={bookingDetails.paymentMode}
            onChange={handleBookingChange}
          >
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
