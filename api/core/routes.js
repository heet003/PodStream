module.exports = function (app) {
  // require("../controller/customer")(app, "/customer");
  require("../controller/users")(app, "/api/users");
};
