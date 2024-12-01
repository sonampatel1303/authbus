import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import UserCRUD from '../Components/Usercrud';  // Make sure this path is correct
import OperatorCRUD from '../Components/Operatorcrud';  // Make sure this path is correct
import './AdminDashboard.css'
const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="admin-dashboard">
    <h1>Admin Control</h1>
    <select onChange={handleSelectionChange} value={selectedOption}>
      <option value="">Select an option</option>
      <option value="users">Users</option>
      <option value="operators">Bus Operators</option>
    </select>
  
    <div>
      {selectedOption === 'users' && <UserCRUD />}
      {selectedOption === 'operators' && <OperatorCRUD />}
    </div>
  </div>
  
  );
};

export default AdminDashboard;