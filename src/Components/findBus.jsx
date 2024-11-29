import React, { useState, useEffect } from 'react';
import './findBus.css';
import BookingForm from '../Services/BookingForm';

const BusRouteSearch = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null); // To store selected route for booking
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false); // Controls booking form visibility

  // Function to handle the search of bus routes
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://localhost:7201/api/BusRoute?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await response.json();

      // Transform the response data to remove unnecessary metadata
      if (data && data.$values) {
        const filteredRoutes = data.$values.map(route => ({
          routeId: route.routeId,
          sourcePoint: route.sourcePoint,
          destination: route.destination,
          departureTime: route.departureTime,
          arrivalTime: route.arrivalTime,
          bus: {
            busId: route.bus.busId,
            busName: route.bus.busName,
            bustype: route.bus.bustype,
            amenities: route.bus.amenities,
            numberofSeats: route.bus.numberofSeats,
            pricePerSeat: route.bus.pricePerSeat
          }
        }));

        setRoutes(filteredRoutes);
        setError('');
      } else {
        setRoutes([]);
        setError('No routes found.');
      }
    } catch (err) {
      setError('Error fetching routes.');
      console.error(err);
    }
  };

  // Search for routes when source or destination changes
  useEffect(() => {
    if (source && destination) {
      handleSearch();
    }
  }, [source, destination]);

  // Handle clicking on Book Ticket button
  const handleBookTicketClick = (route) => {
    setSelectedRoute(route);
    setIsBookingFormVisible(true); // Show booking form
  };

  // Close the booking form
  const closeBookingForm = () => {
    setIsBookingFormVisible(false);
    setSelectedRoute(null); // Clear selected route
  };

  return (
    <div className="search-container">
      <h2>Bus Route Search</h2>
      <div>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p>{error}</p>}

      {routes.length > 0 ? (
        <div className="routes-list">
          {routes.map((route) => (
            <div key={route.routeId} className="route-card">
              <h3>{`Route: ${route.sourcePoint} to ${route.destination}`}</h3>
              <p>Departure: {new Date(route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
<p>Arrival: {new Date(route.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

              {/* <p>Departure: {new Date(route.departureTime).toLocaleString()}</p>
              <p>Arrival: {new Date(route.arrivalTime).toLocaleString()}</p> */}
              <h4>Bus Information</h4>
              <p>Bus Name: {route.bus.busName}</p>
              <p>Bus Type: {route.bus.bustype}</p>
              <p>Amenities: {route.bus.amenities}</p>
              <p>Seats Available: {route.bus.numberofSeats}</p>
              <p>Price per Seat: ₹{route.bus.pricePerSeat}</p>

              {/* Add Book Ticket button */}
              {isBookingFormVisible && selectedRoute?.routeId === route.routeId ? (
                // Render the BookingForm if the current route is selected
                <BookingForm route={selectedRoute} onClose={closeBookingForm} />
              ) : (
                <button onClick={() => handleBookTicketClick(route)}>Book Ticket</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No routes found.</p>
      )}
    </div>
  );
};

export default BusRouteSearch;
