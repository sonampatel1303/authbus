import axios from "axios";

const API_URL = "https://localhost:7201/api/Admin/users";
const OP_API_URL = "https://localhost:7201/api/Admin/operators";
const BUS_API_URL = "https://localhost:7201/api/Buses";
const ROUTE_API_URL = "https://localhost:7201/api/BusRoute";

//service for users
export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const createUsers = async (user) => {
    try {
      console.log(user);
      console.log("CreateUser  Called from service");
      const token = localStorage.getItem("token");
        const response = await axios.post(API_URL, user,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("resonse from api", response.data);
      return response.data;
    } catch (error) {
      console.error("Error While creating New User", error);
      throw error;
    }
  };
  
  export const updateUsers = async (userid, user) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${userid}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error While updating User", error);
      throw error;
    }
  };
  
  export const deleteUsers = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response=await axios.delete(`${API_URL}/${id}`, 
        {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token here
            },
          });
      return response.data
      
    } catch (error) {
      console.error("Error While Deleting User", error);
      throw error;
    }
  };

  //service for operators
  export const getOperators = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(OP_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching operators:", error);
      throw error;
    }
  };

  export const createOperators = async (busOperator) => {
    try {
      console.log(busOperator);
      console.log("CreateOperator  Called from service");
      const token = localStorage.getItem("token");
        const response = await axios.post(OP_API_URL, busOperator,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("resonse from api", response.data);
      return response.data;
    } catch (error) {
      console.error("Error While creating New Operator", error);
      throw error;
    }
  };
  export const updateOperators = async (opid, busOperator) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${OP_API_URL}/${opid}`, busOperator, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error While updating operator", error);
      throw error;
    }
  };
  export const deleteOperators = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response=await axios.delete(`${OP_API_URL}/${id}`, 
        {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token here
            },
          });
      return response.data
      
    } catch (error) {
      console.error("Error While Deleting operator", error);
      throw error;
    }
  };

//service for buses
export const getBuses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(BUS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};
export const createBuses = async (bus) => {
  try {
    console.log(bus);
    console.log("CreateOperator  Called from service");
    const token = localStorage.getItem("token");
      const response = await axios.post(BUS_API_URL, bus,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log("resonse from api", response.data);
    return response.data;
  } catch (error) {
    console.error("Error While creating New Bus", error);
    throw error;
  }
};
export const updateBuses = async ( bus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(BUS_API_URL, bus, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error While updating bus", error);
    throw error;
  }
};
export const deleteBuses = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response=await axios.delete(`${BUS_API_URL}/${id}`, 
      {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the token here
          },
        });
    return response.data
    
  } catch (error) {
    console.error("Error While Deleting bus", error);
    throw error;
  }
};


//service for bus routes
export const getBusRoutes = async (source, destination) => {
  if (!source || !destination) {
    throw new Error("Source and destination must be provided.");
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${ROUTE_API_URL}?source=${source}&destination=${destination}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bus routes:", error);
    throw error;
  }
};


// CREATE Bus Route
export const createBusRoutes = async (busRoute) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(ROUTE_API_URL, busRoute, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating bus route:", error);
    throw error;
  }
};

// UPDATE Bus Route
export const updateBusRoutes = async (routeId, busRoute) => {
  try {
      // Check RouteId and busRoute values
      console.log("Updating bus route with ID:", routeId, "and data:", busRoute);

      const token = localStorage.getItem("token");
      const response = await axios.put(`${ROUTE_API_URL}/${routeId}`, busRoute, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });
      return response.data;
  } catch (error) {
      console.log("Error updating bus route:", error.response ? error.response.data : error.message);
      throw error;
  }
};




// DELETE Bus Route
export const deleteBusRoutes = async (routeId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${ROUTE_API_URL}/${routeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting bus route:", error);
    throw error;
  }
};