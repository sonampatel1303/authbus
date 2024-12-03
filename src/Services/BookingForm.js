
// import React, { useState } from 'react';
// import axios from 'axios';
// import './BookingForm.css'
// const BookingForm = ({ route, onClose }) => {
//   const [bookingDetails, setBookingDetails] = useState({
//     userId: '', // This will be entered manually by the user
//     routeId: route.routeId,
//     numberofSeats: 1, // Default value is 1
//     totalPrice: route.bus.pricePerSeat,
//     bookingDate: new Date().toISOString().slice(0, 16), // Default to current date and time, formatted for datetime-local
//     bookingStatus: 'Booked', // Default status
//     paymentMode: 'Online',  // Default payment mode
//   });

//   const [selectedSeats, setSelectedSeats] = useState([]); // Store selected seats as an array
//   const [error, setError] = useState('');
//   const [paymentError, setPaymentError] = useState('');

//   const handleBookingChange = (e) => {
//     const { name, value } = e.target;
//     setBookingDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//       totalPrice: name === 'numberofSeats' ? value * route.bus.pricePerSeat : prevDetails.totalPrice,
//     }));
//   };

//   // Handle seat selection
//   const toggleSeatSelection = (seatNumber) => {
//     setSelectedSeats((prevSeats) => {
//       const updatedSeats = prevSeats.includes(seatNumber)
//         ? prevSeats.filter((seat) => seat !== seatNumber) // Unselect the seat if already selected
//         : [...prevSeats, seatNumber]; // Select the seat
//       const updatedNumberOfSeats = updatedSeats.length;
//       setBookingDetails((prevDetails) => ({
//         ...prevDetails,
//         numberofSeats: updatedNumberOfSeats,
//         totalPrice: updatedNumberOfSeats * route.bus.pricePerSeat,
//       }));
//       return updatedSeats;
//     });
//   };

//   const submitBooking = () => {
//     setError('');
//     setPaymentError('');

//     // Send the booking details to your API endpoint
//     axios
//       .post('https://localhost:7201/api/Booking', bookingDetails, {
//         headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
//       })
//       .then((response) => {
//         alert('Booking successful!');
//         const bookingId = response.data.bookingId; // Ensure bookingId is returned

//         // Now submit the payment with the bookingId
//         submitPayment(bookingId); // Pass the bookingId to the payment function
//         onClose(); // Close the booking form after successful booking
//       })
//       .catch((error) => {
//         console.error('Error booking ticket:', error);
//         setError('There was an error processing your booking. Please try again.');
//       });
//   };

//   const submitPayment = (bookingId) => {
//     // Prepare the payment details
//     const paymentDetails = {
//       bookingId: bookingId, // Pass the bookingId to the payment
//       paymentAmount: bookingDetails.totalPrice,
//       paymentMode: bookingDetails.paymentMode,
//       paymentDate: new Date().toISOString(), // Set current date for payment
//       status: bookingDetails.paymentMode === 'Online' ? 'Completed' : 'Pending', // Set status based on payment mode
//     };

//     console.log("Payment details being sent:", paymentDetails); // Log the payment details for debugging

//     // Send the payment details to your API endpoint
//     axios
//       .post('https://localhost:7201/api/Payments', paymentDetails, {
//         headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
//       })
//       .then((response) => {
//         console.log('Payment response:', response.data); // Log the response from the API
//         alert('Payment successful!');
//       })
//       .catch((error) => {
//         console.error('Error processing payment:', error);
//         setPaymentError('There was an error processing your payment. Please try again.');
//       });
//   };

//   // Get today's date and time in the format required for datetime-local input
//   const today = new Date().toISOString().slice(0, 16); // "yyyy-mm-ddThh:mm"

//   // Dynamically generate seat grid based on route.bus.numberofSeats
//   const totalSeats = route.bus.numberofSeats; // Get total seats from the bus details
//   const seatsPerRow = 4; // 4 seats per row
//   const seatRows = Math.ceil(totalSeats / seatsPerRow); // Calculate the number of rows

//   return (
//     <div className="booking-form">
//       <h2>Book Ticket</h2>
//       {error && <div className="error-message">{error}</div>}
//       {paymentError && <div className="error-message">{paymentError}</div>}
//       <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }}>
//         <div>
//           <label htmlFor="userId">User ID</label>
//           <input
//             type="number"
//             id="userId"
//             name="userId"
//             value={bookingDetails.userId}
//             onChange={handleBookingChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="routeId">Route ID</label>
//           <input
//             type="text"
//             id="routeId"
//             name="routeId"
//             value={bookingDetails.routeId}
//             readOnly
//           />
//         </div>

//         {/* Seat Selection Grid */}
//         <div className="seat-grid">
//           <h3>Select Seats</h3>
//           {Array.from({ length: seatRows }, (_, rowIndex) => (
//             <div key={rowIndex} className="seat-row">
//               {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
//                 const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
//                 if (seatNumber > totalSeats) return null; // Skip rendering extra seats
//                 const isSelected = selectedSeats.includes(seatNumber);
//                 return (
//                   <button
//                     type="button"
//                     key={seatNumber}
//                     className={`seat ${isSelected ? 'selected' : ''}`}
//                     onClick={() => toggleSeatSelection(seatNumber)}
//                   >
//                     {seatNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </div>

//         <div>
//           <label htmlFor="numberofSeats">Number of Seats</label>
//           <input
//             type="number"
//             id="numberofSeats"
//             name="numberofSeats"
//             value={bookingDetails.numberofSeats}
//             readOnly
//           />
//         </div>
//         <div>
//           <label htmlFor="totalPrice">Total Price</label>
//           <input
//             type="text"
//             id="totalPrice"
//             name="totalPrice"
//             value={`₹${bookingDetails.totalPrice}`}
//             readOnly
//           />
//         </div>
//         <div>
//           <label htmlFor="bookingDate">Booking Date & Time</label>
//           <input
//             type="datetime-local"
//             id="bookingDate"
//             name="bookingDate"
//             value={bookingDetails.bookingDate}
//             onChange={handleBookingChange}
//             min={today} // Set the min date to today's date and time
//           />
//         </div>
//         <div>
//           <label htmlFor="bookingStatus">Booking Status</label>
//           <input
//             type="text"
//             id="bookingStatus"
//             name="bookingStatus"
//             value={bookingDetails.bookingStatus}
//             readOnly
//           />
//         </div>

//         <div>
//           <label htmlFor="paymentMode">Payment Mode</label>
//           <select
//             id="paymentMode"
//             name="paymentMode"
//             value={bookingDetails.paymentMode}
//             onChange={handleBookingChange}
//           >
//             <option value="Online">Online</option>
//             <option value="Cash">Cash</option>
//           </select>
//         </div>

//         <div>
//           <button type="submit">Confirm Booking</button>
//           <button type="button" onClick={onClose}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BookingForm;
import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ route, onClose }) => {
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

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      totalPrice: name === 'numberofSeats' ? value * route.bus.pricePerSeat : prevDetails.totalPrice,
    }));
  };

  const toggleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      const updatedSeats = prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber];
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
    axios
      .post('https://localhost:7201/api/Booking', bookingDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        alert('Booking successful!');
        submitPayment(response.data.bookingId);
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

  const today = new Date().toISOString().slice(0, 16);
  const totalSeats = route.bus.numberofSeats;
  const seatsPerRow = 4;
  const seatRows = Math.ceil(totalSeats / seatsPerRow);

  return (
    <div className="booking-form">
      <h2>Book Ticket</h2>
      {error && <div className="error-message">{error}</div>}
      {paymentError && <div className="error-message">{paymentError}</div>}
      <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }}>
        {[ 
          { label: 'User ID', type: 'number', name: 'userId', value: bookingDetails.userId, required: true },
          { label: 'Route ID', type: 'text', name: 'routeId', value: bookingDetails.routeId, readOnly: true },
        ].map(({ label, ...inputProps }) => (
          <div className="form-group" key={inputProps.name}>
            <label htmlFor={inputProps.name}>{label}</label>
            <input id={inputProps.name} {...inputProps} onChange={handleBookingChange} />
          </div>
        ))}
        
        {/* Seat Grid Below Route ID */}
        <div className="seat-grid">
          <h3>Select Seats</h3>
          {Array.from({ length: seatRows }, (_, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                if (seatNumber > totalSeats) return null;
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

        {[ 
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
