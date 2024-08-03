module.exports = function (app) {
  // require("../controller/customer")(app, "/customer");
  require("../controller/users")(app, "/api/users");
  require("../controller/podcast")(app, "/api/podcasts");
  require("../controller/admin")(app, "/api/admins");
};
