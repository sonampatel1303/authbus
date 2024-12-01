
import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css'
const BookingForm = ({ route, onClose }) => {
  const [bookingDetails, setBookingDetails] = useState({
    userId: '', // This will be entered manually by the user
    routeId: route.routeId,
    numberofSeats: 1, // Default value is 1
    totalPrice: route.bus.pricePerSeat,
    bookingDate: new Date().toISOString().slice(0, 16), // Default to current date and time, formatted for datetime-local
    bookingStatus: 'Booked', // Default status
    paymentMode: 'Online',  // Default payment mode
  });

  const [selectedSeats, setSelectedSeats] = useState([]); // Store selected seats as an array
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      totalPrice: name === 'numberofSeats' ? value * route.bus.pricePerSeat : prevDetails.totalPrice,
    }));
  };

  // Handle seat selection
  const toggleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      const updatedSeats = prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber) // Unselect the seat if already selected
        : [...prevSeats, seatNumber]; // Select the seat
      const updatedNumberOfSeats = updatedSeats.length;
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        numberofSeats: updatedNumberOfSeats,
        totalPrice: updatedNumberOfSeats * route.bus.pricePerSeat,
      }));
      return updatedSeats;
    });
  };

  const submitBooking = () => {
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

  // Dynamically generate seat grid based on route.bus.numberofSeats
  const totalSeats = route.bus.numberofSeats; // Get total seats from the bus details
  const seatsPerRow = 4; // 4 seats per row
  const seatRows = Math.ceil(totalSeats / seatsPerRow); // Calculate the number of rows

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

        {/* Seat Selection Grid */}
        <div className="seat-grid">
          <h3>Select Seats</h3>
          {Array.from({ length: seatRows }, (_, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                if (seatNumber > totalSeats) return null; // Skip rendering extra seats
                const isSelected = selectedSeats.includes(seatNumber);
                return (
                  <button
                    type="button"
                    key={seatNumber}
                    className={`seat ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSeatSelection(seatNumber)}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="numberofSeats">Number of Seats</label>
          <input
            type="number"
            id="numberofSeats"
            name="numberofSeats"
            value={bookingDetails.numberofSeats}
            readOnly
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
