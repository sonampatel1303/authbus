import React, {useState, useEffect} from "react";
import '../Components/Admincrud.css';
import {
    getOperators,
    createOperators,
    updateOperators,
    deleteOperators
} from "../Services/AdminService";
import { toast } from "react-toastify";

const Operator = () =>{
      const [operators, setOperators] = useState([]);  // Store users data
      const [newOperator, setNewOperator] = useState({
        operatorId: 0,
        operatorName: "",
        operatorPhone: "",
        dateCreated: "",
        busId:""
      });

    const [isEdit, setIsEdit] = useState(false);  // Track edit state
    const [errors, setErrors] = useState({
        operatorName: "",
        operatorPhone: "",
        dateCreated: "",
        busId:""
    });
    useEffect(() => {
        fetchOperators();  // Fetch operaters when component mounts
      }, []);
    
      const fetchOperators = async () => {
        try {
          const data = await getOperators();  // Call the backend API to get users
          if (data && data.$values) {
            setOperators(data.$values);  // Set operators if the response is valid
          } else {
            console.log("Invalid data structure", data);
          }
        } catch (error) {
          console.log("Error fetching operators:", error);
        }
      };
      const validateForm = () => {
        let formErrors = {};
        if (!newOperator.operatorName) formErrors.operatorName = "Name Required.";
        if (!newOperator.operatorPhone) formErrors.phoneNumber = "Phone Number Required.";
        if (!newOperator.dateCreated) formErrors.dateCreated = "Date Required.";
        if (!newOperator.busId) formErrors.busId = "Bus ID Required.";
        
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
      };
      const handleCreate = async () => {
        if (!validateForm()) return;
    
        try {
          await createOperators(newOperator);  // Create new user through the service
          fetchOperators();  // Reload the user list
          setNewOperator({
            operatorId: 0,
            operatorName: "",
            operatorPhone: "",
            dateCreated: "",
            busId:""
          });
          toast.success("A new BusOperator was created successfully!")
        } catch (error) {
          console.log("Error creating Operator:", error);
        }
      };
      const handleUpdate = async () => {
        if (!validateForm()) return;
    
        try {
          await updateOperators(newOperator.operatorId, newOperator);  // Update the existing user
          setOperators(
            operators.map((operator) =>
              operator.operatorId === newOperator.operatorId ? newOperator : operator
            )
          );
          setIsEdit(false);
          setNewOperator({
            operatorId: 0,
            operatorName: "",
            operatorPhone: "",
            dateCreated: "",
            busId:""
          });
          toast.success("BusOperator updated successfully!")
        } catch (error) {
          console.log("Error updating operator:", error);
        }
      };
      const handleEdit = (operator) => {
        setNewOperator(operator);  // Pre-fill the form with the selected user's data
        setIsEdit(true);  // Set editing state to true
      };
      const handleDelete = async (id) => {
        try {
          const token = localStorage.getItem('token');
          await deleteOperators(id, token);  // Call the delete user API
          setOperators(operators.filter((operator) => operator.operatorId !== id));
          toast.success("BusOperator deleted successfully!")  // Remove deleted user from state
        } catch (error) {
          console.log("Error deleting operator:", error);
        }
      };

      return (
        <div className="user-list">
            <h1>Bus Operators</h1>
                <ul className="user-grid">
                {operators.map((operator) => (
                <li key={operator.operatorId} className="user-container">
                    <div>Operator Name : {operator.operatorName}</div>
                    <div> Phone Number : {operator.operatorPhone}</div>
                    <div> DateCreated : {operator.dateCreated}</div>
                    <div> Bus ID : {operator.busId}</div>
                    

                        
                    <div className="buttons">
                    <button className="edit-button" onClick={() => handleEdit(operator)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(operator.operatorId)}>Delete</button>
                    </div>
                
                </li>
                ))}
            </ul>

            <div className="user-info">
                <h2>{isEdit ? "Edit Operator" : "Add New Operator"}</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Operator Name"
                        value={newOperator.operatorName}
                        onChange={(e) => setNewOperator({ ...newOperator, operatorName: e.target.value })}
                    />
                    {errors.operatorName && <span style={{ color: "Red" }}>{errors.operatorName}</span>}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={newOperator.operatorPhone}
                        onChange={(e) =>
                        setNewOperator({ ...newOperator, operatorPhone: e.target.value })
                        }
                    />
                    {errors.operatorPhone && <span style={{ color: "Red" }}>{errors.operatorPhone}</span>}
                    </div>
                    <div>
                        <input
                            type="datetime-local"
                            placeholder="Date Created"
                            value={newOperator.dateCreated}
                            onChange={(e) => setNewOperator({ ...newOperator, dateCreated: e.target.value })}
                        />
                        {errors.dateCreated && <span style={{ color: "Red" }}>{errors.dateCreated}</span>}
                    </div>


                    <div>
                        <input
                            type="text"
                            placeholder="Bus ID"
                            value={newOperator.busId}
                            onChange={(e) => setNewOperator({ ...newOperator, busId: e.target.value })}
                        />
                        {errors.busId && <span style={{ color: "Red" }}>{errors.busId}</span>}
                    </div>

                    <button className="edit-button" onClick={isEdit ? handleUpdate : handleCreate}>
                        {isEdit ? "Update" : "Add"}
                    </button>

            </div>



        </div>
      )
}
export default Operator;