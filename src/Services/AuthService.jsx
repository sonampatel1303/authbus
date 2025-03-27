import axios from "axios";


const API_URL = "https://localhost:7201/api/Authentication";


const login = async (username, password) => {
  try {
    console.log("service called");
    console.log(username, password);

    // Sending request to backend to authenticate user
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    
    console.log("API Response:", response);

    
    const { token, role } = response.data;

    
    if (typeof token !== 'string') {
      throw new Error("Invalid token format");
    }

    
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    console.log("Token and Role saved to localStorage");

    
    return { token, role };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; 
  }
};


const getProtectedData = async () => {
  try {
  
    const token = localStorage.getItem("token");

    console.log("Retrieved token:", token);

    
    if (!token) {
      throw new Error("No token found in localStorage");
    }

  
    const response = await axios.get("https://localhost:7201/api/protected-endpoint", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the protected data from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};

export { login, getProtectedData };