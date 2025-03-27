import React, { useState, useEffect, useContext } from "react";
import '../Components/Admincrud.css';
import '../Components/BusRouteCrud.css';
import {
    getBusRoutes,
    createBusRoutes,
    updateBusRoutes,
    deleteBusRoutes
} from "../Services/AdminService";
import { toast } from "react-toastify";
import  AuthContext  from "../Components/AuthContext";

const BusRoute = () => {
    const [busRoutes, setBusRoutes] = useState([]); 
    const [newBusRoute, setNewBusRoute] = useState({
        RouteId: 0,
        SourcePoint: "",
        Destination: "",
        BusId: "",
        DepartureTime: "",
        ArrivalTime: ""
    });
    const [filter, setFilter] = useState({ SourcePoint: "", Destination: "" });
    const [isEdit, setIsEdit] = useState(false); 
    const [errors, setErrors] = useState({
        SourcePoint: "",
        Destination: "",
        BusId: "",
        DepartureTime: "",
        ArrivalTime: ""
    });
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        fetchBusRoutes(); 
    }, []);

    const fetchBusRoutes = async () => {
        try {
            const data = await getBusRoutes(filter.SourcePoint, filter.Destination);
            if (data && data.$values) {
                setBusRoutes(data.$values); 
            } else {
                console.log("Invalid data structure", data);
            }
        } catch (error) {
            console.log("Error fetching BusRoutes:", error);
            
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!newBusRoute.SourcePoint) formErrors.SourcePoint = "Source Point is required.";
        if (!newBusRoute.Destination) formErrors.Destination = "Destination is required.";
        if (!newBusRoute.BusId) formErrors.BusId = "Bus ID is required.";
        if (!newBusRoute.DepartureTime) formErrors.DepartureTime = "Departure Time is required.";
        if (!newBusRoute.ArrivalTime) formErrors.ArrivalTime = "Arrival Time is required.";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        try {
            await createBusRoutes(newBusRoute);
            fetchBusRoutes(); 
            setNewBusRoute({
                RouteId: 0,
                SourcePoint: "",
                Destination: "",
                BusId: "",
                DepartureTime: "",
                ArrivalTime: ""
            });
            toast.success("A new BusRoute was created successfully!")
        } catch (error) {
            console.log("Error creating BusRoute:", error);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        if (!newBusRoute.RouteId) {
            console.error("RouteId is missing or invalid");
            return; // Stop the update if RouteId is missing or invalid
        }

        try {
            console.log("Updating bus route with RouteId:", newBusRoute.RouteId);
            await updateBusRoutes(newBusRoute.RouteId, newBusRoute);
            setBusRoutes(
                busRoutes.map((busRoute) =>
                    busRoute.RouteId === newBusRoute.RouteId ? newBusRoute : busRoute
                )
            );
            setIsEdit(false);
            setNewBusRoute({
                RouteId: 0,
                SourcePoint: "",
                Destination: "",
                BusId: "",
                DepartureTime: "",
                ArrivalTime: ""
            });
            toast.success("BusRoute updated successfully")
        } catch (error) {
            console.log("Error updating BusRoute:", error);
        }
    };

    const handleEdit = (busRoute) => {
        setNewBusRoute({
            RouteId: busRoute.routeId,  // Ensure the RouteId is correctly set
            SourcePoint: busRoute.sourcePoint,
            Destination: busRoute.destination,
            BusId: busRoute.busId,
            DepartureTime: busRoute.departureTime,
            ArrivalTime: busRoute.arrivalTime
        });
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        if (auth && auth.role === "BusOperator") {
            toast.error("Bus Operators cannot delete busroutes.");
            return;
          }
        try {
            await deleteBusRoutes(id);
            setBusRoutes(busRoutes.filter((busRoute) => busRoute.RouteId !== id));
            toast.success("BusRoute deleted successfully!")
        } catch (error) {
            console.log("Error deleting BusRoute:", error);
        }
    };

    return (
        <div className="user-list">
            <h1>Bus Routes</h1>
            
            <div className="filter-container">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by Source Point"
                    value={filter.SourcePoint}
                    onChange={(e) => setFilter({ ...filter, SourcePoint: e.target.value })}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by Destination"
                    value={filter.Destination}
                    onChange={(e) => setFilter({ ...filter, Destination: e.target.value })}
                />
                <button className="filter-button" onClick={fetchBusRoutes}>Filter Routes</button>
            </div>

            <ul className="user-grid">
                {busRoutes.map((busRoute) => (
                    <li key={busRoute.routeId} className="user-container">
                        <div>Route ID: {busRoute.routeId}</div>
                        <div>Source Point: {busRoute.sourcePoint}</div>
                        <div>Destination: {busRoute.destination}</div>
                        <div>Bus ID: {busRoute.busId}</div>
                        <div>Departure Time: {new Date(busRoute.departureTime).toLocaleString()}</div>
                        <div>Arrival Time: {new Date(busRoute.arrivalTime).toLocaleString()}</div>
                        
                        <div className="buttons">
                            <button className="edit-button" onClick={() => handleEdit(busRoute)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(busRoute.routeId)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="user-info">
                <h2>{isEdit ? "Edit Bus Route" : "Add New Bus Route"}</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Source Point"
                        value={newBusRoute.SourcePoint}
                        onChange={(e) => setNewBusRoute({ ...newBusRoute, SourcePoint: e.target.value })}
                    />
                    {errors.SourcePoint && <span style={{ color: "red" }}>{errors.SourcePoint}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Destination"
                        value={newBusRoute.Destination}
                        onChange={(e) => setNewBusRoute({ ...newBusRoute, Destination: e.target.value })}
                    />
                    {errors.Destination && <span style={{ color: "red" }}>{errors.Destination}</span>}
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Bus ID"
                        value={newBusRoute.BusId}
                        onChange={(e) => setNewBusRoute({ ...newBusRoute, BusId: e.target.value })}
                    />
                    {errors.BusId && <span style={{ color: "red" }}>{errors.BusId}</span>}
                </div>
                <div>
                    <input
                        type="datetime-local"
                        placeholder="Departure Time"
                        value={newBusRoute.DepartureTime}
                        onChange={(e) => setNewBusRoute({ ...newBusRoute, DepartureTime: e.target.value })}
                    />
                    {errors.DepartureTime && <span style={{ color: "red" }}>{errors.DepartureTime}</span>}
                </div>
                <div>
                    <input
                        type="datetime-local"
                        placeholder="Arrival Time"
                        value={newBusRoute.ArrivalTime}
                        onChange={(e) => setNewBusRoute({ ...newBusRoute, ArrivalTime: e.target.value })}
                    />
                    {errors.ArrivalTime && <span style={{ color: "red" }}>{errors.ArrivalTime}</span>}
                </div>
                <button className="edit-button" onClick={isEdit ? handleUpdate : handleCreate}>
                    {isEdit ? "Update" : "Add"}
                </button>
            </div>
        </div>
    );
};

export default BusRoute;