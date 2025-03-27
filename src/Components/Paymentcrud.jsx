import React, { useState, useEffect } from "react";
import { getPayments, createPayments, updatePayments, deletePayments } from "../Services/PaymentService";
import './Paymentcrud.css'; // Import the specific stylesheet

const Payment = () => {
  const [payments, setPayments] = useState([""]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filter, setFilter] = useState("all"); // Filter state
  const [newPayment, setNewPayment] = useState({
    id: "",
    bookingId: "",
    paymentAmount: "",
    paymentMode: "",
    status: "",
    paymentDate: ""
  });
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({
    id: "",
    bookingId: "",
    paymentAmount: "",
    paymentMode: "",
    status: "",
    paymentDate: ""
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilter(); // Apply filter whenever filter state or payments change
  }, [filter, payments]);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      if (data && data.$values) {
        setPayments(data.$values);
      } else {
        console.log("Invalid data structure", data);
      }
    } catch (error) {
      console.log("Error fetching payment:", error);
    }
  };

  const applyFilter = () => {
    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") {
      setFilteredPayments(payments.filter(payment => payment.paymentDate.startsWith(today)));
    } else if (filter === "past") {
      setFilteredPayments(payments.filter(payment => payment.paymentDate < today));
    } else {
      setFilteredPayments(payments);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!newPayment.id) formErrors.id = "PaymentId Required.";
    if (!newPayment.bookingId) formErrors.bookingId = "BookingId Required.";
    if (!newPayment.paymentAmount) formErrors.paymentAmount = "Payment Amount Required.";
    if (!newPayment.paymentMode) formErrors.paymentMode = "Payment Mode Required.";
    if (!newPayment.status) formErrors.status = "Status Required.";
    if (!newPayment.paymentDate) formErrors.paymentDate = "Payment Date Required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createPayments(newPayment);
      fetchPayments();
      resetForm();
    } catch (error) {
      console.log("Error creating payment:", error);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updatePayments(newPayment);
      setPayments(
        payments.map((payment) =>
          payment.id === newPayment.id ? newPayment : payment
        )
      );
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.log("Error updating payment:", error);
    }
  };

  const handleEdit = (payment) => {
    setNewPayment(payment);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deletePayments(id, token);
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (error) {
      console.log("Error deleting payment:", error);
    }
  };

  const resetForm = () => {
    setNewPayment({
      id: "",
      bookingId: "",
      paymentAmount: "",
      paymentMode: "",
      status: "",
      paymentDate: ""
    });
  };

  return (
    <div className="payment-container">
      <h1>Payments</h1>
      
      {/* Filter Dropdown */}
      <div className="filter-container">
        <label>Filter Payments:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="today">Today's Payments</option>
          <option value="past">Past Payments</option>
        </select>
      </div>

      <ul>
        {filteredPayments.map((payment) => (
          <li key={payment.id}>
            <div>Booking Id: {payment.bookingId}</div>
            <div>Payment Amount: {payment.paymentAmount}</div>
            <div>Payment Mode: {payment.paymentMode}</div>
            <div>Status: {payment.status}</div>
            <div>Payment Date: {payment.paymentDate}</div>
            <div>
              <button onClick={() => handleEdit(payment)}>Edit</button>
              <button onClick={() => handleDelete(payment.id)}>Delete</button>
            </div>

            {isEdit && newPayment.id === payment.id && (
              <div>
                <h2>Edit Payment</h2>
                {/* Form Fields with Error Display */}
                <div>
                  <input
                    type="text"
                    placeholder="Booking ID"
                    value={newPayment.bookingId}
                    onChange={(e) => setNewPayment({ ...newPayment, bookingId: e.target.value })}
                  />
                  {errors.bookingId && <span style={{ color: "red" }}>{errors.bookingId}</span>}
                </div>
                {/* Other input fields similar to above */}
                <button onClick={handleUpdate}>Update</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payment;