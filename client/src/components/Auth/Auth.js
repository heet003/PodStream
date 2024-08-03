import React, { useState, useContext } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import Otp from "./Otp";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import "./Auth.css";

const { Title } = Typography;

const Auth = () => {
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [form] = Form.useForm();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    form.resetFields(); // Clear form fields when switching modes
  };

  const handleVerifyOtp = async (values) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/verify-otp",
        "POST",
        JSON.stringify({
          email: form.getFieldValue("email"),
          otp: otpValue,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      message.success({ content: "Sign Up Successful!", duration: 2 });
      auth.login(responseData.token, responseData.role);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const authSubmitHandler = async (values) => {
    let responseData;
    try {
      if (isLoginMode) {
        responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
      } else {
        responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            address: values.address,
            bio: values.bio,
          }),
          {
            "Content-Type": "application/json",
          }
        );
      }
      if (responseData.otp) {
        setIsOtpSent(true);
      } else {
        message.success({ content: "Login Successful!", duration: 2 });
        auth.login(responseData.token, responseData.role);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {isOtpSent ? (
        <Otp
          handleVerifyOtp={handleVerifyOtp}
          message={error}
          setOtpValue={setOtpValue}
        />
      ) : (
        <div className="authentication">
          <Title level={2} style={{ color: "white" }} className="form_header">
            {isLoginMode ? "Login" : "Signup"}
          </Title>
          <hr />
          <Form
            form={form}
            className="auth_form"
            onFinish={authSubmitHandler}
            initialValues={{ remember: true }}
          >
            {!isLoginMode && (
              <React.Fragment>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: !isLoginMode,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: !isLoginMode,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input type="tel" placeholder="1234567890" />
                </Form.Item>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: !isLoginMode,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <Input placeholder="123 Bleeker Street, New York" />
                </Form.Item>
                <Form.Item label="Bio (Optional)" name="bio">
                  <Input.TextArea placeholder="Your hobbies, interests, goals." />
                </Form.Item>
              </React.Fragment>
            )}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" placeholder="abc@gmail.com" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="123456" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isLoginMode ? "LOGIN" : "SIGNUP"}
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="default"
            onClick={switchModeHandler}
            className="switch-mode-button"
          >
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default Auth;
