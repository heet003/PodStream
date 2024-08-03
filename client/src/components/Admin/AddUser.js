import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHttpClient } from "../hooks/http-hook";
import { useAuth } from "../hooks/auth-hook";
import { storage } from "../UploadPodcast/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Admin.css";

const AddUser = ({ user, onClose, setUsers }) => {
  const { token } = useAuth();
  const { sendRequest } = useHttpClient();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
      });
    }
  }, [user, form]);

  const handleImageUpload = ({ file }) => {
    setImageFile(file);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("role", values.role || user.role);
    formData.append("name", values.name || user.name);
    formData.append("phone", values.phone || user.phone);
    formData.append("email", values.email || user.email);
    formData.append("address", values.address || user.address);
    formData.append("bio", values.bio || user.bio);

    setIsUploading(true);

    // Upload image to Firebase
    if (imageFile) {
      const imageRef = ref(storage, `profileImages/${imageFile.name}`);
      try {
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        formData.append("imageUrl", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image.");
        setIsUploading(false);
        return;
      }
    }

    try {
      const url = user
        ? `http://localhost:5000/api/admins/edit/${user._id}`
        : "http://localhost:5000/api/admins/add-user";
      const method = "POST";

      const response = await sendRequest(url, method, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (user) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? response.user : u))
        );
        message.success("User updated successfully!");
      } else {
        setUsers((prevUsers) => [...prevUsers, response.user]);
        message.success("User added successfully!");
      }

      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to save user.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="add-user-form">
      <h2>{user ? "Edit User" : "Add User"}</h2>
      <Form
        form={form}
        name="addUser"
        onFinish={onFinish}
        layout="vertical"
        style={{ background: "#15171E", padding: "20px", borderRadius: "8px" }}
      >
        <Form.Item
          name="role"
          label={<span style={{ color: "#fff" }}>Role</span>}
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Radio.Group>
            <Radio value="user">User</Radio>
            <Radio value="admin">Admin</Radio>
            <Radio value="creator">Creator</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          label={<span style={{ color: "#fff" }}>Name</span>}
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>

        {!user && (
          <Form.Item
            name="email"
            label={<span style={{ color: "#fff" }}>Email</span>}
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          name="phone"
          label={<span style={{ color: "#fff" }}>Phone</span>}
          rules={[
            { required: true, message: "Please input the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label={<span style={{ color: "#fff" }}>Address</span>}
          rules={[{ required: true, message: "Please input the address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="bio"
          label={<span style={{ color: "#fff" }}>Bio</span>}
          rules={[{ required: true, message: "Please input the bio!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="image"
          label={<span style={{ color: "#fff" }}>Profile Image</span>}
          rules={[{ required: true, message: "Please Upload An Image!" }]}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleImageUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isUploading}>
            {user ? "Update User" : "Add User"}
          </Button>
          <Button
            type="default"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;
