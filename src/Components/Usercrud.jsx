import React, { useState, useEffect } from "react";
import '../Components/Admincrud.css';  // Ensure your custom CSS is applied

import {
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../Services/AdminService";

const User = () => {
  const [users, setUsers] = useState([]);  // Store users data
  const [newUser, setNewUser] = useState({
    userId: 0,
    userName: "",
    phoneNumber: "",
    gender: "",
    email: "",
    address: "",
    role: "",
    dateCreated: "",
  });

  const [isEdit, setIsEdit] = useState(false);  // Track edit state
  const [editUserId, setEditUserId] = useState(null);  // Track current edit user ID
  const [errors, setErrors] = useState({
    userName: "",
    phoneNumber: "",
    gender: "",
    email: "",
    address: "",
    role: "",
    dateCreated: "",
  });

  useEffect(() => {
    fetchUsers();  // Fetch users when component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();  // Call the backend API to get users
      if (data && data.$values) {
        setUsers(data.$values);  // Set users if the response is valid
      } else {
        console.log("Invalid data structure", data);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!newUser.userName) formErrors.userName = "Name Required.";
    if (!newUser.phoneNumber) formErrors.phoneNumber = "Phone Number Required.";
    if (!newUser.gender) formErrors.gender = "Gender Required.";
    if (!newUser.email) formErrors.email = "Email Required.";
    if (!newUser.address) formErrors.address = "Address Required.";
    if (!newUser.role) formErrors.role = "Role Required.";
    if (!newUser.dateCreated) formErrors.dateCreated = "Date Required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createUsers(newUser);  // Create new user through the service
      fetchUsers();  // Reload the user list
      setNewUser({
        userId: 0,
        userName: "",
        phoneNumber: "",
        gender: "",
        email: "",
        address: "",
        role: "",
        dateCreated: "",
      });
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updateUsers(newUser.userId, newUser);  // Update the existing user
      setUsers(
        users.map((user) =>
          user.userId === newUser.userId ? newUser : user
        )
      );
      setIsEdit(false);
      setEditUserId(null);
      setNewUser({
        userId: 0,
        userName: "",
        phoneNumber: "",
        gender: "",
        email: "",
        address: "",
        role: "",
        dateCreated: "",
      });
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);  // Pre-fill the form with the selected user's data
    setEditUserId(user.userId);  // Set the ID of the user being edited
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteUsers(id, token);  // Call the delete user API
      setUsers(users.filter((user) => user.userId !== id));  // Remove deleted user from state
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  return (
    <div className="user-list">
      <h1>Users</h1>
      <ul className="user-grid">
        {users.map((user) => (
          <li key={user.userId} className="user-container">
            <div>User Name : {user.userName}</div>
            <div>Phone Number : {user.phoneNumber}</div>
            <div>Gender : {user.gender}</div>
            <div>Email : {user.email}</div>
            <div>Address : {user.address}</div>
            <div>Role : {user.role}</div>
            <div>Date Created : {user.dateCreated}</div>

            <div className="buttons">
              <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(user.userId)}>Delete</button>
            </div>

            {editUserId === user.userId && (
              <div className="user-info edit-form">
                <h3>Edit User</h3>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.userName}
                    onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                  />
                  {errors.userName && <span style={{ color: "Red" }}>{errors.userName}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newUser.phoneNumber}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phoneNumber: e.target.value })
                    }
                  />
                  {errors.phoneNumber && <span style={{ color: "Red" }}>{errors.phoneNumber}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Gender"
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                  />
                  {errors.gender && <span style={{ color: "Red" }}>{errors.gender}</span>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  {errors.email && <span style={{ color: "Red" }}>{errors.email}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  />
                  {errors.address && <span style={{ color: "Red" }}>{errors.address}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  />
                  {errors.role && <span style={{ color: "Red" }}>{errors.role}</span>}
                </div>
                <div>
                  <input
                    type="datetime-local"
                    placeholder="Date Created"
                    value={newUser.dateCreated}
                    onChange={(e) => setNewUser({ ...newUser, dateCreated: e.target.value })}
                  />
                  {errors.dateCreated && <span style={{ color: "Red" }}>{errors.dateCreated}</span>}
                </div>

                <button className="edit-button" onClick={handleUpdate}>Update</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
