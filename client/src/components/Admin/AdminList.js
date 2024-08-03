import React, { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import { useAuth } from "../hooks/auth-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./Admin.css";
import AddUser from "./AddUser";

const AdminList = () => {
  const { token, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admins/admin",
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setAdmins(responseData.admins);
      } catch (err) {
        console.log(err);
      }
    };
    if (token && role === "admin") {
      fetchAdmins();
    }
  }, [sendRequest, token, role]);

  const deleteUser = async (adminId) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/admins/delete/${adminId}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== adminId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const closeEditMode = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  const renderAdmins = () =>
    admins.map((user) => (
      <div key={user._id} className="user-card">
        <div className="user-card-img">
          {user.imageUrl && (
            <img src={user.imageUrl} alt={`${user.name}'s profile`} />
          )}
        </div>
        <div className="user-card-content">
          <p>
            <strong>ID:</strong> {user._id}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          <button className="edit-icon" onClick={() => editUser(user)}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
          <button className="delete-icon" onClick={() => deleteUser(user._id)}>
            <FontAwesomeIcon icon={faTrashAlt} /> Delete
          </button>
        </div>
      </div>
    ));

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {!isEditing && (
        <div>
          <h2>ADMINS</h2>
          {renderAdmins()}
        </div>
      )}
      <div>
        {isEditing && (
          <AddUser
            user={selectedUser}
            onClose={closeEditMode}
            setUsers={setAdmins}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AdminList;
