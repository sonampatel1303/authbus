// src/Services/ProductService.js
import axios from "axios";

const API_URL = "https://localhost:7201/api/Payments";

export const getPayments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
export const createPayments = async (payment, token) => {
  try {
    console.log(payment);
    console.log("CreatePayment Called from service");
    const response = await axios.post(API_URL, payment,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log("resonse from api", response.data);
    return response.data;
  } catch (error) {
    console.error("Error While creating New Payments", error);
    throw error;
  }
};

export const updatePayments = async (payment) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/`, payment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } );
    return response.data;
  } catch (error) {
    console.error("Error While updating Payments", error);
    throw error;
  }
};

export const deletePayments = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response =await axios.delete(`${API_URL}/${id}`, 
        {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token here
            },
          });
    return response.data;
  } catch (error) {
    console.error("Error While Deleting Payments", error);
    throw error;
  }
};