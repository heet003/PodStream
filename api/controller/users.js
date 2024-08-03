var express = require("express");
var userRouter = express.Router();
const axios = require("axios");
const mail = require("../core/mail");
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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

user.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  let promise = helper.paramValidate(
    { code: 2010, val: !email },
    { code: 2011, val: !otp }
  );

  var otpDocument;
  var uid;
  var userFound;

  promise
    .then(async () => {
      return await db._findOne("otps", { email });
    })
    .then(async (otp) => {
      if (otp.length < 0) {
        return Promise.reject(403);
      }
      otpDocument = otp[0];
      userFound = await db._findOne("users", { email });
      userFound = userFound[0];
    })
    .then(async () => {
      if (otpDocument.otp == otp) {
        const currentTime = new Date();
        if (currentTime < otpDocument.expiresAt) {
          uid = userFound._id;
          let token = {
            userId: userFound._id,
            role: userFound.role,
            ttl: helper.token.TTL(),
            created: helper.dbDate(),
          };
          return db.insert(ACCESSTOKEN, token);
        }
      }
      await db.delete("otps", { email });
      await db.delete("users", { email });
      return Promise.reject(1003);
    })
    .then((tokenId) => {
      if (tokenId) {
        let tokenInfo = {
          role: userFound.role,
          userId: userFound._id,
          tokenId,
        };
        token = helper.token.get(tokenInfo);
        return token;
      }
      return Promise.reject(1001);
    })
    .then(async (token) => {
      await db.delete("otps", { email });
      helper.success(res, {
        userId: userFound.userId,
        token,
        role: userFound.role,
      });
    })
    .catch(async (e) => {
      helper.error(res, e);
    });
};

user.signup = (req, res) => {
  const { name, email, phone, address, bio, password } = req.body;
  var role = "user";
  var userFound;
  var uid;

  let promise = helper.paramValidate(
    { code: 2010, val: !email },
    { code: 2010, val: !helper.isValidEmail(email) },
    { code: 2011, val: !password },
    { code: 2011, val: !name },
    { code: 2011, val: !role }
  );

  const otp = generateOTP();
  const subject = "Email Verification - PodStream";
  const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .content {
                text-align: left;
            }
            .otp {
                text-align: center;
                font-size: 24px;
                margin: 20px 0;
                padding: 10px;
                background-color: #f0f0f0;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <p>Dear User,</p>
                <p>Thank you for registering with Podstream.</p>
                <p>Your verification code is:</p>
                <div class="otp">${otp}</div>
                <p>Please enter this code to verify your email address and complete your registration.</p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply.</p>
                <p>&copy; 2024 Podstream. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

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
          phone,
          address,
          bio,
          imageUrl:"",
          password: hash,
          searchHistory: [],
          watchHistory: [],
        };
        return await db.insert("users", newUser);
      }
      return Promise.reject(1001);
    })
    .then(async (userId) => {
      uid = userId;
      if (uid) {
        return await mail.sendMail(email, subject, body, true);
      }
      return Promise.reject(1001);
    })
    .then(async (result) => {
      if (result) {
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const otpDocument = {
          userId: uid,
          email,
          otp,
          createdAt: new Date(),
          expiresAt,
        };

        return await db.insert("otps", otpDocument);
      }
      return Promise.reject(403);
    })
    .then((id) => {
      if (id) {
        helper.success(res, {
          uid,
          otp,
        });
      }
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

user.login = (req, res) => {
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

user.userProfile = (req, res) => {
  const { userId } = req.uSession;

  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._findOne("users", { _id: userId });
    })
    .then((u) => {
      if (u.length > 0) {
        return u[0];
      }
      return Promise.reject(1003);
    })
    .then((user) => {
      helper.success(res, { user });
    })
    .catch((err) => {
      helper.error(res, err);
    });
};

user.updateProfile = (req, res) => {
  const { userId } = req.uSession;
  const { role, address, phone, name, bio, image } = req.body;

  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._findOne("users", { _id: userId });
    })
    .then((u) => {
      if (u.length > 0) {
        return u[0];
      }
      return Promise.reject(1003);
    })
    .then(async (user) => {
      const updatedData = {
        role,
        name,
        address,
        bio,
        phone,
      };
      if (image) {
        updatedData.imageUrl = image;
      }

      return await db.update("users", { _id: userId }, updatedData);
    })
    .then((user) => {
      helper.success(res, { user });
    })
    .catch((error) => {
      helper.error(res, error);
    });
};

module.exports = function (app, uri) {
  userRouter.post("/login", user.login);
  userRouter.post("/signup", user.signup);
  userRouter.post("/verify-otp", user.verifyOTP);
  userRouter.get("/profile", user.userProfile);
  userRouter.post("/profile", user.updateProfile);

  app.use(uri, userRouter);
};
