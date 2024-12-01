import axios from "axios";

const API_URL = "https://localhost:7201/api/Admin/users";
const OP_API_URL = "https://localhost:7201/api/Admin/operators";

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