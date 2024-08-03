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
        {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          address: 1,
          bio: 1,
          imageUrl: 1,
        }
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
        {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          address: 1,
          bio: 1,
          imageUrl: 1,
        }
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

admin.editUser = (req, res) => {
  const { userId } = req.uSession;
  const { role, name, email, address, phone, bio, imageUrl } = req.body;
  let promise = helper.paramValidate(
    { code: 2010, val: !userId },
    { code: 2010, val: !role },
    { code: 2010, val: !name },
    { code: 2010, val: !email },
    { code: 2010, val: !address },
    { code: 2010, val: !phone },
    { code: 2010, val: !bio }
  );

  promise
    .then(async () => {
      return await db._findOne("users", { email });
    })
    .then(async (user) => {
      if (user) {
        return await db.update(
          "users",
          { email },
          { role, name, address, phone, bio, imageUrl }
        );
      }
      return Promise.reject(1003);
    })
    .then((user) => {
      if (user) {
        helper.success(res, {user });
      } else {
        return Promise.reject(1001);
      }
    })
    .catch((error) => {
      helper.error(res, error);
    });
};

admin.addUser = (req, res) => {
  const { userId } = req.uSession;
  const { role, name, email, address, phone, bio, imageUrl } = req.body;
  let promise = helper.paramValidate(
    { code: 2010, val: !userId },
    { code: 2010, val: !role },
    { code: 2010, val: !name },
    { code: 2010, val: !email },
    { code: 2010, val: !address },
    { code: 2010, val: !phone },
    { code: 2010, val: !bio },
    { code: 2010, val: !imageUrl }
  );

  promise
    .then(async () => {
      return await db.insert("users", {
        name,
        role,
        email,
        address,
        phone,
        imageUrl,
        bio,
        searchHistory: [],
        watchHistory: [],
        createdBy: userId,
        createdAt: new Date(),
      });
    })
    .then(async (id) => {
      if (id) {
        return await db.update(
          "users",
          { _id: userId },
          { $push: { usersCreated: id } }
        );
      }
      return Promise.reject(1003);
    })
    .then((admins) => {
      if (admins) {
        helper.success(res, { message: "Success" });
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
  adminRouter.post("/edit/:id", admin.editUser);
  adminRouter.post("/add-user", admin.addUser);

  app.use(uri, adminRouter);
};
