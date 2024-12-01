import React, { useState, useEffect } from "react";
import '../Components/Admincrud.css';
import {
    getOperators,
    createOperators,
    updateOperators,
    deleteOperators
} from "../Services/AdminService";

const Operator = () => {
    const [operators, setOperators] = useState([]);  // Store operators data
    const [newOperator, setNewOperator] = useState({
        operatorId: 0,
        operatorName: "",
        operatorPhone: "",
        dateCreated: "",
        busId: ""
    });

    const [editOperatorId, setEditOperatorId] = useState(null);  // Track operator being edited
    const [errors, setErrors] = useState({
        operatorName: "",
        operatorPhone: "",
        dateCreated: "",
        busId: ""
    });

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        try {
            const data = await getOperators();
            if (data && data.$values) {
                setOperators(data.$values);
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
        if (!newOperator.operatorPhone) formErrors.operatorPhone = "Phone Number Required.";
        if (!newOperator.dateCreated) formErrors.dateCreated = "Date Required.";
        if (!newOperator.busId) formErrors.busId = "Bus ID Required.";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        try {
            await createOperators(newOperator);
            fetchOperators();
            setNewOperator({
                operatorId: 0,
                operatorName: "",
                operatorPhone: "",
                dateCreated: "",
                busId: ""
            });
        } catch (error) {
            console.log("Error creating operator:", error);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            await updateOperators(newOperator.operatorId, newOperator);
            setOperators(operators.map((operator) =>
                operator.operatorId === newOperator.operatorId ? newOperator : operator
            ));
            setEditOperatorId(null);
            setNewOperator({
                operatorId: 0,
                operatorName: "",
                operatorPhone: "",
                dateCreated: "",
                busId: ""
            });
        } catch (error) {
            console.log("Error updating operator:", error);
        }
    };

    const handleEdit = (operator) => {
        setNewOperator(operator);
        setEditOperatorId(operator.operatorId);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await deleteOperators(id, token);
            setOperators(operators.filter((operator) => operator.operatorId !== id));
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
                        <div>Operator Name: {operator.operatorName}</div>
                        <div>Phone Number: {operator.operatorPhone}</div>
                        <div>Date Created: {operator.dateCreated}</div>
                        <div>Bus ID: {operator.busId}</div>

                        <div className="buttons">
                            <button className="edit-button" onClick={() => handleEdit(operator)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(operator.operatorId)}>Delete</button>
                        </div>

                        {editOperatorId === operator.operatorId && (
                            <div className="user-info">
                                <h2>Edit Operator</h2>
                                <input
                                    type="text"
                                    placeholder="Operator Name"
                                    value={newOperator.operatorName}
                                    onChange={(e) => setNewOperator({ ...newOperator, operatorName: e.target.value })}
                                />
                                {errors.operatorName && <span style={{ color: "Red" }}>{errors.operatorName}</span>}

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={newOperator.operatorPhone}
                                    onChange={(e) =>
                                        setNewOperator({ ...newOperator, operatorPhone: e.target.value })
                                    }
                                />
                                {errors.operatorPhone && <span style={{ color: "Red" }}>{errors.operatorPhone}</span>}

                                <input
                                    type="datetime-local"
                                    placeholder="Date Created"
                                    value={newOperator.dateCreated}
                                    onChange={(e) => setNewOperator({ ...newOperator, dateCreated: e.target.value })}
                                />
                                {errors.dateCreated && <span style={{ color: "Red" }}>{errors.dateCreated}</span>}

                                <input
                                    type="text"
                                    placeholder="Bus ID"
                                    value={newOperator.busId}
                                    onChange={(e) => setNewOperator({ ...newOperator, busId: e.target.value })}
                                />
                                {errors.busId && <span style={{ color: "Red" }}>{errors.busId}</span>}

                                <button className="edit-button" onClick={handleUpdate}>Update</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div className="user-info">
                <h2>Add New Operator</h2>
                <input
                    type="text"
                    placeholder="Operator Name"
                    value={newOperator.operatorName}
                    onChange={(e) => setNewOperator({ ...newOperator, operatorName: e.target.value })}
                />
                {errors.operatorName && <span style={{ color: "Red" }}>{errors.operatorName}</span>}

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={newOperator.operatorPhone}
                    onChange={(e) =>
                        setNewOperator({ ...newOperator, operatorPhone: e.target.value })
                    }
                />
                {errors.operatorPhone && <span style={{ color: "Red" }}>{errors.operatorPhone}</span>}

                <input
                    type="datetime-local"
                    placeholder="Date Created"
                    value={newOperator.dateCreated}
                    onChange={(e) => setNewOperator({ ...newOperator, dateCreated: e.target.value })}
                />
                {errors.dateCreated && <span style={{ color: "Red" }}>{errors.dateCreated}</span>}

                <input
                    type="text"
                    placeholder="Bus ID"
                    value={newOperator.busId}
                    onChange={(e) => setNewOperator({ ...newOperator, busId: e.target.value })}
                />
                {errors.busId && <span style={{ color: "Red" }}>{errors.busId}</span>}

                <button className="edit-button" onClick={handleCreate}>Add</button>
            </div>
        </div>
    );
};

export default Operator;
