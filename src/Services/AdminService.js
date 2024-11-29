import axios from "axios";

const API_URL = "https://localhost:7201/api/Admin/users";

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
      const response = await axios.post(API_URL, user);
      console.log("resonse from api", response.data);
      return response.data;
    } catch (error) {
      console.error("Error While creating New User", error);
      throw error;
    }
  };
  
  export const updateUsers = async (userid, user) => {
    try {
      const response = await axios.put(`${API_URL}?id=${userid}`, user);
      return response.data;
    } catch (error) {
      console.error("Error While updating User", error);
      throw error;
    }
  };
  
  export const deleteUsers = async (id, token) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`, 
        {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token here
            },
          });
      
    } catch (error) {
      console.error("Error While Deleting User", error);
      throw error;
    }
  };
