// import axios from "axios";

// const API_URL = "https://localhost:7201/api/BusRoute"; // The base URL for BusRoute API

// // Fetch bus routes based on source and destination
// export const getBusRoutes = async (source, destination) => {
//   try {
//     const token = localStorage.getItem("token"); // Get token from local storage
//     const response = await axios.get(`${API_URL}?source=${source}&destination=${destination}`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in the headers
//       },
//     });
//     return response.data; // Return the response data (bus routes)
//   } catch (error) {
//     console.error("Error fetching bus routes:", error);
//     throw error; // Throw error if fetching fails
//   }
// };

// // Create a new bus route
// export const createBusRoute = async (busRoute) => {
//   try {
//     const token = localStorage.getItem("token"); // Get token from local storage
//     const response = await axios.post(API_URL, busRoute, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in the headers
//       },
//     });
//     return response.data; // Return the response data (created bus route)
//   } catch (error) {
//     console.error("Error while creating bus route:", error);
//     throw error; // Throw error if creation fails
//   }
// };

// // Update an existing bus route
// export const updateBusRoute = async (routeId, busRoute) => {
//   try {
//     const token = localStorage.getItem("token"); // Get token from local storage
//     const response = await axios.put(`${API_URL}/${routeId}`, busRoute, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in the headers
//       },
//     });
//     return response.data; // Return the response data (updated bus route)
//   } catch (error) {
//     console.error("Error while updating bus route:", error);
//     throw error; // Throw error if updating fails
//   }
// };

// // Delete a bus route
// export const deleteBusRoute = async (routeId) => {
//   try {
//     const token = localStorage.getItem("token"); // Get token from local storage
//     const response = await axios.delete(`${API_URL}/${routeId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include token in the headers
//       },
//     });
//     return response.data; // Return the response data (deleted bus route confirmation)
//   } catch (error) {
//     console.error("Error while deleting bus route:", error);
//     throw error; // Throw error if deletion fails
//   }
// };
