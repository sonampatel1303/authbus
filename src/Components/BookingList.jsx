import React, { useEffect, useState } from "react";
import { getBookings } from "../Services/Booking.js";
import './Booking.css';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
  
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const data = await getBookings();
          console.log("Fetched bookings:", data); // Debugging log
          setBookings(data);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };
  
      fetchBookings();
    }, []);
  
    return (
      <div className="product-list">
        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div className="product-card" key={booking.bookingId}>
              <h2>User ID: {booking.userId ?? "N/A"}</h2>
              <p>Route ID: {booking.routeId ?? "N/A"}</p>
              <p>Price: ${booking.totalPrice ?? "N/A"}</p>
              <p>Seats: {booking.numberofSeats ?? "N/A"}</p>
              <p>Booking Status: {booking.bookingStatus ?? "N/A"}</p>
              <p>Date: {booking.bookingDate ?? "N/A"}</p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default BookingList;