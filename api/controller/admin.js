var express = require("express");
var adminRouter = express.Router();
var db = require("../lib/database");
var helper = require("../core/helper");
const ACCESSTOKEN = "AccessToken";

let admin = {};

admin.getStats = (req, res) => {
  const { userId } = req.uSession;

  let promise = helper.paramValidate({ code: 2010, val: !userId });
  var userCount;
  var adminCount;
  var podcastCount;
  promise
    .then(async () => {
      return await db._find("users", { role: "admin" });
    })
    .then(async (u) => {
      if (u.length > 0) {
        adminCount = u.length;
        return await db._find("users", { role: { $ne: "admin" } });
      }
      return Promise.reject(1003);
    })
    .then(async (x) => {
      if (x.length > 0) {
        userCount = x.length;
        return await db._find("podcasts", {});
      }
      return Promise.reject(1003);
    })
    .then(async (p) => {
      if (p.length > 0) {
        podcastCount = p.length;
        return podcastCount;
      }
      return Promise.reject(1003);
    })
    .then((count) => {
      if (count) {
        helper.success(res, { userCount, adminCount, podcastCount });
      } else {
        return Promise.reject(1001);
      }
    })
    .catch((error) => {
      helper.error(res, error);
    });
};

admin.getUsers = (req, res) => {
  const { userId } = req.uSession;

  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._find(
        "users",
        { role: { $ne: "admin" } },
        { _id: 1, name: 1, email: 1, phone: 1, address: 1, bio: 1, imageUrl: 1 }
      );
    })
    .then(async (p) => {
      if (p.length > 0) {
        return p;
      }
      return Promise.reject(1003);
    })
    .then((users) => {
      if (users) {
        helper.success(res, { users });
      } else {
        return Promise.reject(1001);
      }
    })
    .catch((error) => {
      helper.error(res, error);
    });
};

admin.getAdmins = (req, res) => {
  const { userId } = req.uSession;

  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._find(
        "users",
        { role: "admin" },
        { _id: 1, name: 1, email: 1, phone: 1, address: 1, bio: 1, imageUrl: 1 }
      );
    })
    .then(async (p) => {
      if (p.length > 0) {
        return p;
      }
      return Promise.reject(1003);
    })
    .then((admins) => {
      if (admins) {
        helper.success(res, { admins });
      } else {
        return Promise.reject(1001);
      }
    })
    .catch((error) => {
      helper.error(res, error);
    });
};

module.exports = function (app, uri) {
  adminRouter.get("/stats", admin.getStats);
  adminRouter.get("/users", admin.getUsers);
  adminRouter.get("/admin", admin.getAdmins);

  app.use(uri, adminRouter);
};
