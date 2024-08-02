import React, { useState, useContext } from "react";
import "./Auth.css";
import Button from "../Shared/FormElements/Button";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import Otp from "./Otp";
import { message } from "antd";

const Auth = () => {
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, setFormState] = useState({
    name: {
      value: "",
    },
    email: {
      value: "",
    },
    password: {
      value: "",
    },
    phone: {
      value: "",
    },
    address: {
      value: "",
    },
    bio: {
      value: "",
    },
  });

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/verify-otp",
        "POST",
        JSON.stringify({
          email: formState.email.value,
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

  const inputHandler = (id, value, type = "text") => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: {
        value:
          type === "checkbox"
            ? { ...prevState[id].value, [value]: !prevState[id].value[value] }
            : value,
      },
    }));
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    let responseData;
    try {
      if (isLoginMode) {
        responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.email.value,
            password: formState.password.value,
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
            name: formState.name.value,
            email: formState.email.value,
            password: formState.password.value,
            phone: formState.phone.value,
            address: formState.address.value,
            bio: formState.bio.value,
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
          <h2 className="form_header">{isLoginMode ? "Login" : "Signup"}</h2>
          <hr />
          <form className="auth_form" onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <React.Fragment>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => inputHandler("name", e.target.value)}
                  value={formState.name.value}
                />
                <label htmlFor="phone">Phone:</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="12354567890"
                  onChange={(e) => inputHandler("phone", e.target.value)}
                  value={formState.phone.value}
                />
                <label htmlFor="address">Address:</label>
                <input
                  id="address"
                  type="text"
                  placeholder="123 Bleeker Street, New York"
                  onChange={(e) => inputHandler("address", e.target.value)}
                  value={formState.address.value}
                />
                <label htmlFor="bio">Bio (Optional):</label>
                <textarea
                  id="bio"
                  placeholder="Your hobbies, interests, goals."
                  onChange={(e) => inputHandler("bio", e.target.value)}
                  value={formState.bio.value}
                />
              </React.Fragment>
            )}
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="abc@gmail.com"
              onChange={(e) => inputHandler("email", e.target.value)}
              value={formState.email.value}
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="123456"
              onChange={(e) => inputHandler("password", e.target.value)}
              value={formState.password.value}
            />
            <Button type="submit">{isLoginMode ? "LOGIN" : "SIGNUP"}</Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default Auth;
