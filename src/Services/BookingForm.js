import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ route, onClose }) => {
  const today = new Date().toISOString().slice(0, 16);
  const totalSeats = route.bus.numberofSeats;
  const seatsPerRow = 5;

  const [bookingDetails, setBookingDetails] = useState({
    userId: '',
    routeId: route.routeId,
    numberofSeats: 1,
    totalPrice: route.bus.pricePerSeat,
    bookingDate: new Date().toISOString().slice(0, 16),
    bookingStatus: 'Booked',
    paymentMode: 'Online',
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Get the stored booked seats for the given route and date
  const getBookedSeats = () => {
    const storedBookings = JSON.parse(localStorage.getItem('bookedSeats')) || {};
    const bookedSeats = storedBookings[route.routeId] || {};
    return bookedSeats[bookingDetails.bookingDate] || [];
  };

  const [bookedSeats, setBookedSeats] = useState(getBookedSeats);

  // Effect to update booked seats when booking date changes
  useEffect(() => {
    setBookedSeats(getBookedSeats());
  }, [bookingDetails.bookingDate]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      totalPrice: name === 'numberofSeats' ? value * route.bus.pricePerSeat : prevDetails.totalPrice,
    }));
  };

  const toggleSeatSelection = (seatNumber) => {
    // Prevent selecting already booked seats for the selected date
    if (bookedSeats.includes(seatNumber)) {
      alert(`Seat ${seatNumber} is already booked for ${bookingDetails.bookingDate}!`);
      return;
    }

    setSelectedSeats((prevSeats) => {
      const updatedSeats = prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber];

      // Update seat count and price
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

    // Update localStorage with new booking data
    const storedBookings = JSON.parse(localStorage.getItem('bookedSeats')) || {};
    const updatedBookedSeats = { ...storedBookings };
    if (!updatedBookedSeats[route.routeId]) updatedBookedSeats[route.routeId] = {};
    if (!updatedBookedSeats[route.routeId][bookingDetails.bookingDate]) {
      updatedBookedSeats[route.routeId][bookingDetails.bookingDate] = [];
    }

    // Check if the selected seats are already booked for the date
    const alreadyBooked = updatedBookedSeats[route.routeId][bookingDetails.bookingDate].some(seat =>
      selectedSeats.includes(seat)
    );

    if (alreadyBooked) {
      alert(`Some of the selected seats are already booked on ${bookingDetails.bookingDate}`);
      return;
    }

    updatedBookedSeats[route.routeId][bookingDetails.bookingDate] = [
      ...updatedBookedSeats[route.routeId][bookingDetails.bookingDate],
      ...selectedSeats,
    ];
    localStorage.setItem('bookedSeats', JSON.stringify(updatedBookedSeats));

    // Proceed with booking
    axios
      .post('https://localhost:7201/api/Booking', bookingDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        alert('Booking successful!');
        submitPayment(response.data.bookingId);
        setBookedSeats((prevSeats) => [...prevSeats, ...selectedSeats]);
        onClose();
      })
      .catch(() => setError('There was an error processing your booking. Please try again.'));
  };

  const submitPayment = (bookingId) => {
    const paymentDetails = {
      bookingId,
      paymentAmount: bookingDetails.totalPrice,
      paymentMode: bookingDetails.paymentMode,
      paymentDate: new Date().toISOString(),
      status: bookingDetails.paymentMode === 'Online' ? 'Completed' : 'Pending',
    };

    axios
      .post('https://localhost:7201/api/Payments', paymentDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => alert('Payment successful!'))
      .catch(() => setPaymentError('There was an error processing your payment. Please try again.'));
  };

  return (
    <div className="booking-form">
      <h2>Book Ticket</h2>
      {error && <div className="error-message">{error}</div>}
      {paymentError && <div className="error-message">{paymentError}</div>}
      <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }}>
        <div className="seat-grid">
          <h3>Select Seats</h3>
          {Array.from({ length: Math.ceil(totalSeats / seatsPerRow) }, (_, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                if (seatNumber > totalSeats) return null;

                const isSelected = selectedSeats.includes(seatNumber);
                const isBooked = bookedSeats.includes(seatNumber);

                return (
                  <React.Fragment key={seatNumber}>
                    {seatIndex === 2 && rowIndex % 2 === 0 && (
                      <div className="seat-gap" />
                    )}
                    <button
                      type="button"
                      className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSeatSelection(seatNumber)}
                      disabled={isBooked}
                    >
                      {seatNumber}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        {/* Other Inputs */}
        {[
          { label: 'User ID', type: 'number', name: 'userId', value: bookingDetails.userId, required: true },
          { label: 'Route ID', type: 'text', name: 'routeId', value: bookingDetails.routeId, readOnly: true },
          { label: 'Number of Seats', type: 'number', name: 'numberofSeats', value: bookingDetails.numberofSeats, readOnly: true },
          { label: 'Total Price', type: 'text', name: 'totalPrice', value: `₹${bookingDetails.totalPrice}`, readOnly: true },
          { label: 'Booking Date & Time', type: 'datetime-local', name: 'bookingDate', value: bookingDetails.bookingDate, min: today },
          { label: 'Booking Status', type: 'text', name: 'bookingStatus', value: bookingDetails.bookingStatus, readOnly: true },
        ].map(({ label, ...inputProps }) => (
          <div className="form-group" key={inputProps.name}>
            <label htmlFor={inputProps.name}>{label}</label>
            <input id={inputProps.name} {...inputProps} onChange={handleBookingChange} />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="paymentMode">Payment Mode</label>
          <select id="paymentMode" name="paymentMode" value={bookingDetails.paymentMode} onChange={handleBookingChange}>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;