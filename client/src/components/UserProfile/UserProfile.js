import React, { useState, useEffect, useContext } from "react";
import "./UserProfile.css"; // Ensure this file exists and is styled
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { Button, ConfigProvider, Space } from "antd";
import { css } from "@emotion/css";
import { message } from "antd";
import ImageUpload from "../ImageUpload/ImageUpload";

function UserProfile() {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(
        .${rootPrefixCls}-btn-dangerous
      ) {
      border-width: 0;
      > span {
        position: relative;
      }
      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }
      &:hover::before {
        opacity: 0;
      }
    }
  `;

  const { token, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    role,
    phone: "",
    address: "",
    image: "",
  });

  const handleImageInput = (id, file, isValid) => {
    console.log(file);
    setImageFile(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const resData = await sendRequest(
        "http://localhost:5000/api/users/profile",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      setUser(resData.user);
      setFormData({
        name: resData.user.name,
        bio: resData.user.bio,
        role: resData.user.role,
        email: resData.user.email,
        image: resData.user.imageUrl,
        phone: resData.user.phone,
        address: resData.user.address,
      });
    };

    if (token) {
      fetchUserData();
    }
  }, [token, sendRequest]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      role: value,
    }));
  };

  const handleSave = async () => {
    formData.image = imageFile;
    await sendRequest(
      "http://localhost:5000/api/users/profile",
      "POST",
      JSON.stringify(formData),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    message.success({ content: "Profile Updated!", duration: 2 });
    setUser(formData);
    setEditMode(false);
  };

  return (
    <div className="user-profile">
      <ConfigProvider
        button={{
          className: linearGradientButton,
        }}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <ErrorModal error={error} onClear={clearError} />
        {user && (
          <div className="user-main-body">
            <div className="profile-card">
              {!editMode && (
                <img
                  src={
                    formData.image ||
                    "https://bootdey.com/img/Content/avatar/avatar7.png"
                  }
                  alt="User"
                  className="rounded-circle"
                  width="150"
                />
              )}
              {editMode && (
                <React.Fragment>
                  <ImageUpload
                    id="image"
                    btnText={formData.image ? "Update Image" : "Add Image"}
                    userImage={formData.image}
                    onInput={handleImageInput}
                  />
                </React.Fragment>
              )}
              <div className="mt-3">
                <h4>{user.name}</h4>
                <p>{user.bio}</p>
              </div>
            </div>
            <div className="profile-card mb-3">
              <div className="profile-card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.name}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.email}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.phone}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Address</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.address}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {editMode && (
              <div className="profile-card mb-3">
                <div className="profile-card-body">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option value="user">User</option>
                      <option value="creator">Creator</option>
                    </select>
                  </div>
                  <Space>
                    <Button type="primary" size="large" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="large" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        )}
      </ConfigProvider>
    </div>
  );
}

export default UserProfile;
