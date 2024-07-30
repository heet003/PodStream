var express = require("express");
var userRouter = express.Router();
const axios = require("axios");
var db = require("../lib/database");
var helper = require("../core/helper");
const ACCESSTOKEN = "AccessToken";

// const options = {
//   method: "GET",
//   url: "https://spotify-scraper.p.rapidapi.com/v1/search",
//   params: {
//     term: "news",
//     type: "podcast",
//     limit: "100",
//   },
//   headers: {
//     "x-rapidapi-key": "dfeee1f073msh5f9bc151904928cp1f3eddjsn35fd98560012",
//     "x-rapidapi-host": "spotify-scraper.p.rapidapi.com",
//   },
// };
let user = {};

user.signup = (req, res) => {
  const { role, name, email, password } = req.body;

  var userFound;
  var uid;

  let promise = helper.paramValidate(
    { code: 2010, val: !email },
    { code: 2010, val: !helper.isValidEmail(email) },
    { code: 2011, val: !password },
    { code: 2011, val: !name },
    { code: 2011, val: !role }
  );

  promise
    .then(async () => {
      return await db._findOne("users", { email: email });
    })
    .then((u) => {
      userFound = u[0];
      if (userFound) {
        return Promise.reject(2006);
      }
      return helper.md5(password);
    })
    .then(async (hash) => {
      if (hash) {
        const newUser = {
          role,
          name,
          email,
          password: hash,
          searchHistory: [],
          watchHistory: [],
        };
        return await db.insert("users", newUser);
      }
      return Promise.reject(1001);
    })
    .then((userId) => {
      uid = userId;

      if (userId) {
        let token = {
          userId: user._id,
          role,
          ttl: helper.token.TTL(),
          created: helper.dbDate(),
        };
        return db.insert(ACCESSTOKEN, token);
      }
      return Promise.reject(1001);
    })
    .then((tokenId) => {
      //create token
      let tokenInfo = {
        role,
        userId: uid,
        tokenId,
      };
      token = helper.token.get(tokenInfo);
      user.token = token;
      return token;
    })
    .then((token) =>
      helper.success(res, {
        role,
        token,
      })
    )
    .catch((e) => {
      helper.error(res, e);
    });
};

user.login = async (req, res) => {
  const { email, password } = req.body;

  var existingUser;

  let promise = helper.paramValidate(
    { code: 2010, val: !email },
    { code: 2010, val: !helper.isValidEmail(email) },
    { code: 2011, val: !password }
  );

  promise
    .then(async () => {
      return await db._findOne("users", { email: email });
    })
    .then((u) => {
      existingUser = u[0];
      if (!existingUser) {
        return Promise.reject(403);
      }

      return helper.md5(password);
    })
    .then(async (hash) => {
      if (hash == existingUser.password) {
        let token = {
          userId: existingUser._id,
          role: existingUser.role,
          ttl: helper.token.TTL(),
          created: helper.dbDate(),
        };
        return db.insert(ACCESSTOKEN, token);
      }
      return Promise.reject(401);
    })
    .then((tokenId) => {
      let tokenInfo = {
        role: existingUser.role,
        userId: existingUser._id,
        tokenId,
      };
      token = helper.token.get(tokenInfo);
      user.token = token;
      return token;
    })
    .then((token) =>
      helper.success(res, {
        role: existingUser.role,
        token,
      })
    )
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (app, uri) {
  userRouter.post("/login", user.login);
  userRouter.post("/signup", user.signup);
  app.use(uri, userRouter);
};
