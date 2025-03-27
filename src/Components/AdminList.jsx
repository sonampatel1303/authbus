import React, { useState, useEffect } from "react";
import { getUsers } from "../Services/AdminService"; // Assuming you have this service
import './AdminList.css'; // Import your custom CSS

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store users data
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input
  const [filterRole, setFilterRole] = useState("user"); // Default filter for users

  // Fetch users data from the service
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // Get the data from the backend
        console.log("Fetched data:", data); // Log the response to check its structure

        // Check if the data is in the expected format and has the "$values" array
        if (data && Array.isArray(data.$values)) {
          setUsers(data.$values); // Set users to the state
        } else {
          console.error("No users found or invalid data:", data);
          setUsers([]); // In case of invalid or missing data, set users to empty array
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]); // In case of error, set users to empty array
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Filter users based on search query and role
  const filteredUsers = users.filter(user =>
    (user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    user.role.toLowerCase().includes(filterRole.toLowerCase())
  );

  return (
    <div className="admin-list-container">
      <h3>User List</h3>

      {/* Search input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search users by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      {/* Role filter */}
      <div className="filter-container">
        <select
          className="role-filter"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)} // Update filter role state
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          {/* Add more roles if needed */}
        </select>
      </div>

      {/* Display users */}
      {filteredUsers.length === 0 ? (
        <p className="no-users-message">No users found.</p> // If no users match the filter, show this message
      ) : (
        filteredUsers.map((user) => (
          <div key={user.userId} className="admin-user-card">
            <h4>{user.userName}</h4>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Date Created:</strong> {new Date(user.dateCreated).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;