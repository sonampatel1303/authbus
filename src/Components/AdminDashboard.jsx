import React, { useState,useEffect, useContext } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserCRUD from '../Components/Usercrud';  
import OperatorCRUD from '../Components/Operatorcrud';  
import BusCRUD from '../Components/BusCrud';
import BusRouteCRUD from '../Components/BusRouteCrud';
import '../Components/AdminDashboard.css';
import AuthContext from './AuthContext';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const { auth } = useContext(AuthContext); 

  const isAdmin = auth && auth.role === 'Admin';
  const isBusOperator = auth && auth.role === 'BusOperator';

  useEffect(() => {
    if (auth && auth.role) {
      toast.success(`Welcome ${auth.role}!`, {
        position: 'top-right',
        autoClose: 3000,
        toastId: 'welcome-toast', 
      });
    }
  }, [auth]);

  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='admin-dashboard'>
      <h1>Admin Control</h1>

      {isAdmin || isBusOperator? (
        <>
            <select onChange={handleSelectionChange} value={selectedOption}>
              <option value="">Select an option</option>
              {isAdmin && <option value="users">Users</option>}
              {isAdmin && <option value="operators">Bus Operators</option>}
              <option value="buses">Buses</option>
              <option value="busroutes">Bus Routes</option>
          </select>

          <div>
            {/* Conditionally render CRUD components based on selection */}
            {selectedOption === 'users' && isAdmin && <UserCRUD />}
            {selectedOption === 'operators' && isAdmin && <OperatorCRUD />}
            {selectedOption === 'buses' && <BusCRUD />}
            {selectedOption === 'busroutes' && <BusRouteCRUD />}
          </div>
        </>
      ) : (
        <p>Only Admin can access this page</p>
      )}
    
    </div>
  );
};

export default AdminDashboard;