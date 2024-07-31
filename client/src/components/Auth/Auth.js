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
    role: {
      value: "",
    },
    name: {
      value: "",
    },
    email: {
      value: "",
    },
    password: {
      value: "",
    },
  });

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
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

    auth.login(responseData.token, responseData.role);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  // const openMessage = () => {
  //   setTimeout(() => {}, 2000);
  // };

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
          role: formState.role.value,
          name: formState.name.value,
          email: formState.email.value,
          password: formState.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    }
    if (responseData.otp) {
      setIsOtpSent(true);
    } else {
      message.success({ content: "Login Successfull!", duration: 2 });
      auth.login(responseData.token, responseData.role);
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
          <h2 className="form_header">Login Required</h2>
          <hr />
          <form className="auth_form" onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <React.Fragment>
                <label htmlFor="type">Role:</label>
                <select
                  id="role"
                  value={formState.role.value}
                  onChange={(e) => inputHandler("role", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                </select>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  onChange={(e) => inputHandler("name", e.target.value)}
                  value={formState.name.value}
                />
              </React.Fragment>
            )}
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="E-Mail"
              onChange={(e) => inputHandler("email", e.target.value)}
              value={formState.email.value}
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
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
