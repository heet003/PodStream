var helper = require("../core/helper");

module.exports = function (app) {
  let auth = function (req, res, next) {
    let prefix = "";
    let noAuthURL = [
      prefix + "/",
      prefix + "/api/users/signup",
      prefix + "/api/users/verify-otp",
      prefix + "/api/users/login",
      prefix + "/api/podcasts/",
    ];

    // console.log("no auth url: ",req.body)

    Promise.resolve()
      .then(() => {
        c =
          !noAuthURL.includes(req.originalUrl) &&
          req.originalUrl.search("favicon.ico") == -1;

        if (c) {
          return helper.token.verify(req);
        }
        return Promise.reject(false);
      })
      .then((d) => {
        req.uSession = d;

        next();
      })
      .catch((err) => {
        if (err === false) next();
        else helper.error(res, 401);
      });
  };

  app.use(auth);
};
