import React, { useState, useEffect } from "react";
import "./Auth.css";
import { Input } from "antd";

const Otp = ({ handleVerifyOtp, message, setOtpValue }) => {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const onChange = (text) => {
    setOtpValue(text);
  };
  const sharedProps = {
    onChange,
  };

  return (
    <div className="otp-box">
      <h2 className="otp-h2">Enter OTP</h2>
      <form className="otp-form" onSubmit={handleVerifyOtp}>
        <Input.OTP mask="🔒" size="large" {...sharedProps} />
        <p className="otp-p">An OTP has been sent to your email.</p>
        <p className="otp-p">OTP will be valid for {formatTime(timeLeft)}</p>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default Otp;
