import React from "react";
import { Flex, Spin } from "antd";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <Flex gap="middle" vertical>
      <Spin tip="Loading" size="large" />
    </Flex>
  );
};

export default LoadingSpinner;
