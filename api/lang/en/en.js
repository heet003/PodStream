const message = {
  401: {
    message: "unauthorised access",
    httpCode: 401,
  },
  403: {
    message: "you don't have permission to perform this action",
    httpCode: 403,
  },
  1001: {
    message: "Something went wrong on server",
    httpCode: 400,
  },
  1002: {
    message: "param error",
    httpCode: 400,
  },
  1003: {
    message: "User Not Found",
    httpCode: 400,
  },
  1004: {
    message: "Please subscribe to package to add device",
    httpCode: 400,
  },
  1500: {
    message: "done",
    httpCode: 200,
  },
  2001: {
    message: "name is required",
    httpCode: 400,
  },
  2002: {
    message: "email is required",
    httpCode: 400,
  },
  2003: {
    message: "email is invalid",
    httpCode: 400,
  },
  2004: {
    message: "password is required",
    httpCode: 400,
  },
  2005: {
    message: "password should be greater than 6 and less than 20",
    httpCode: 400,
  },
  2010: {
    message: "Email Already Exists",
    httpCode: 400,
  },
};

module.exports = message;
