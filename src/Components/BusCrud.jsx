import React, {useState, useEffect} from "react";
import '../Components/Admincrud.css';
import {
    getBuses,
    createBuses,
    updateBuses,
    deleteBuses
} from "../Services/AdminService";

const Bus = () => {
    const [buses, setBuses] = useState([]);  // Store users data
    const [newBus, setNewBus] = useState({
      busId: 0,
      busName: "",
      bustype: "",
      amenities: "",
      numberofSeats:"",
      pricePerSeat:""
    });
    const [isEdit, setIsEdit] = useState(false);  // Track edit state
    const [errors, setErrors] = useState({
        busName: "",
        bustype: "",
        amenities: "",
        numberofSeats:"",
        pricePerSeat:""
    });
    useEffect(() => {
        fetchBuses();  // Fetch Buses when component mounts
      }, []);

      const fetchBuses = async () => {
        try {
          const data = await getBuses();  // Call the backend API to get users
          if (data && data.$values) {
            setBuses(data.$values);  // Set Buses if the response is valid
          } else {
            console.log("Invalid data structure", data);
          }
        } catch (error) {
          console.log("Error fetching Buses:", error);
        }
      };
      const validateForm = () => {
        let formErrors = {};
        if (!newBus.busName) formErrors.busName = "busName Required.";
        if (!newBus.bustype) formErrors.bustype = "bustype  Required.";
        if (!newBus.amenities) formErrors.amenities = "amenities Required.";
        if (!newBus.numberofSeats) formErrors.numberofSeats = "numberofSeats Required.";
        if (!newBus.pricePerSeat) formErrors.pricePerSeat = "pricePerSeat  Required.";
        
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
      };
      const handleCreate = async () => {
        if (!validateForm()) return;
    
        try {
          await createBuses(newBus);  // Create new user through the service
          fetchBuses();  // Reload the user list
          setNewBus({
            busId: 0,
            busName: "",
            bustype: "",
            amenities: "",
            numberofSeats:"",
            pricePerSeat:""
          });
        } catch (error) {
          console.log("Error creating Bus:", error);
        }
      };
      const handleUpdate = async () => {
        if (!validateForm()) return;
    
        try {
          await updateBuses(newBus);  // Update the existing user
          setBuses(
            buses.map((bus) =>
              bus.busId === newBus.busId ? newBus : bus
            )
          );
          setIsEdit(false);
          setNewBus({
            busId: 0,
            busName: "",
            bustype: "",
            amenities: "",
            numberofSeats:"",
            pricePerSeat:""
          });
        } catch (error) {
          console.log("Error updating bus:", error);
        }
      };
      const handleEdit = (bus) => {
        setNewBus(bus);  // Pre-fill the form with the selected user's data
        setIsEdit(true);  // Set editing state to true
      };
      const handleDelete = async (id) => {
        try {
          const token = localStorage.getItem('token');
          await deleteBuses(id, token);  // Call the delete user API
          setBuses(buses.filter((bus) => bus.busId !== id));  // Remove deleted user from state
        } catch (error) {
          console.log("Error deleting bus:", error);
        }
      };

      return (
        <div className="user-list">
            <h1>Buses</h1>
            <ul className="user-grid">
                {buses.map((bus) => (
                <li key={bus.busId} className="user-container">
                    <div>Bus Name : {bus.busName}</div>
                    <div> Bus Type : {bus.bustype}</div>
                    <div> Amenities : {bus.amenities}</div>
                    <div> Number of Seats : {bus.numberofSeats}</div>
                    <div> Price per Seat : {bus.pricePerSeat}</div>
                                           
                    <div className="buttons">
                    <button className="edit-button" onClick={() => handleEdit(bus)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(bus.busId)}>Delete</button>
                    </div>
                
                </li>
                ))}
            </ul>
            <div className="user-info">
                <h2>{isEdit ? "Edit Bus" : "Add New Bus"}</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Bus Name"
                        value={newBus.busName}
                        onChange={(e) => setNewBus({ ...newBus, busName: e.target.value })}
                    />
                    {errors.busName && <span style={{ color: "Red" }}>{errors.busName}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Bus Type"
                        value={newBus.bustype}
                        onChange={(e) =>
                        setNewBus({ ...newBus, bustype: e.target.value })
                        }
                    />
                    {errors.bustype && <span style={{ color: "Red" }}>{errors.bustype}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Amenities"
                        value={newBus.amenities}
                        onChange={(e) =>
                        setNewBus({ ...newBus, amenities: e.target.value })
                        }
                    />
                    {errors.amenities && <span style={{ color: "Red" }}>{errors.amenities}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Number of Seats"
                        value={newBus.numberofSeats}
                        onChange={(e) =>
                        setNewBus({ ...newBus, numberofSeats: e.target.value })
                        }
                    />
                    {errors.numberofSeats && <span style={{ color: "Red" }}>{errors.numberofSeats}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Price per Seat"
                        value={newBus.pricePerSeat}
                        onChange={(e) =>
                        setNewBus({ ...newBus, pricePerSeat: e.target.value })
                        }
                    />
                    {errors.pricePerSeat && <span style={{ color: "Red" }}>{errors.pricePerSeat}</span>}
                </div>
                <button className="edit-button" onClick={isEdit ? handleUpdate : handleCreate}>
                        {isEdit ? "Update" : "Add"}
                </button>
                

            </div>

        </div>
      )
    
}
export default Bus;