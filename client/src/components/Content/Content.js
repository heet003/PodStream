// Content.js
import React from "react";
import "./Content.css";

const Content = ({ children, isOpen }) => {
  return <div className={`content ${isOpen ? "shifted" : ""}`}>{children}</div>;
};

export default Content;
