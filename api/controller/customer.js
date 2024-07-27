var express = require("express");
let Jimp = require("jimp");
var customerRouter = express.Router();
var db = require("../lib/database");
var helper = require("../core/helper");
var upload = require("../core/upload");

// /* ---Define Collection or Table Name--- */
// const CUSTOMER = "Customer"; 
// const ROLE = "Role";
// const ROLEMAPPING = "RoleMapping";
// const ACCESSTOKEN = "AccessToken";
// const PACKAGEPURCHASED = "PackagePurchased";
// const PACKAGE = "Package";
// const DASHBOARD = "Dashboard";
// const SETTING = "Setting";

/* ------------------------------------- */

let customer = {};

/**
 * @api {post} customer/login Login
 * @apiName customer/login
 * @apiGroup Customer
 * @apiVersion 1.1.0
 * @apiDescription This api is use to login the customer
 * added package key for package checking at client side
 *
 * @apiParam {object} credential
 * @apiParam {String} credential.email Customer's email id
 * @apiParam {String} credential.password Customer's password
 *
 * @apiError 2010 Credentials is required
 * @apiError 2011 Credentials is required
 * @apiError 2012 Account de activated
 * @apiError 2013 No role assigned
 * @apiUse ErrorResponse
 *
 * @apiSuccess {String}  _id                          Customer's unique id
 * @apiSuccess {String}  ownerId                      Main Customer's id who is the owner of customer account
 * @apiSuccess {Object}  role                         Role details
 * @apiSuccess {String}  role.roleId                  Role assigned to user
 * @apiSuccess {String}  role.roleMappingId           Role mapped to user id
 * @apiSuccess {String}  role.roleName                Role name
 * @apiSuccess {Array}   role.modules                 Customer access layer
 * @apiSuccess {String}  role.modules.name            Individual section name or text as 'all' which means it has access to all section
 * @apiSuccess {String}  role.modules.grantPermission User has permission to read/write
 * @apiSuccess {Array/String}  role.modules.on        User has permission on dashboard/site id as example or text as 'all' means has permission on all ids
 * @apiSuccess {Boolean} isPackagePurchased           Customer has purchased package
 * @apiSuccess {Object}  package                      Customer package details
 * @apiSuccess {String}  package.packageId            Customer package id
 * @apiSuccess {String}  package.deviceCount          Customer package allowed device to be added
 * @apiSuccess {String}  profileImage                         Customer's profile image
 * @apiSuccess {String}  name                         Customer's name
 * @apiSuccess {String}  mobile                         Customer's mobile
 * @apiSuccess {String}  email                        Customer's email id
 * @apiSuccess {String}  address                      Customer's address
 * @apiSuccess {String}  defaultDashboard             default dashboard id send user to its default dashbaord if this key has id
 * @apiSuccess {Boolean} isActive                     Customer's status active or inactive
 * @apiSuccess {Date}    created                      Customer's creation date
 * @apiSuccess {String}  toke                         JWT token
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *         "_id": "5a43b43f1fd3552b8099e3e1",
 *         "ownerId": "5a43b43f1fd3552b8099e3e1",
 *         "role": {
 *             "roleId": "5a41fd588bca800604b140cc",
 *             "roleMappingId": "5a43b4401fd3552b8099e3e2",
 *             "roleName": "Super Admin",
 *             "modules": [
 *                 {
 *                     "name": "all",
 *                     "grantPermission": "write",
 *                     "on": "all"
 *                 }
 *             ]
 *         },
 *         "profileImage": "",
 *         "name": "suhail",
 *         "email": "suhail2@gmail.com",
 *         "address": "",
 *         "defaultDashboard": "5kasfd31a32sd1f6asdf3e2",
 *         "isActive": 1,
 *         "created": "2017-12-27 14:54:55.989",
 *         "isPackagePurchased": 0,
 *         "package": {
 *             "packageId": "",
 *             "deviceCount": 0
 *         },
 *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiY3VzdG9tZXIiLCJ1c2VySWQiOiI1YTQzYjQzZjFmZDM1NTJiODA5OWUzZTEiLCJvd25lcklkIjoiNWE0M2I0M2YxZmQzNTUyYjgwOTllM2UxIiwidG9rZW5JZCI6IjVhNWYxYzgxNWZiZGNiMjNiY2YyMjI5ZCIsInBhY2thZ2UiOnsicGFja2FnZUlkIjoiIiwiZGV2aWNlQ291bnQiOjB9LCJtb2R1bGVzIjpbeyJuYW1lIjoiYWxsIiwiZ3JhbnRQZXJtaXNzaW9uIjoid3JpdGUiLCJvbiI6ImFsbCJ9XSwiaWF0IjoxNTE2MTgyNjU3fQ.wq9uIFGRM9ArYFaCX0FUt0qxpdaJ43BiyLAD3FP5BZo"
 *     }
 */

customer.login = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  const credential = body.credential;
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    { code: 2010, val: !credential.email },
    { code: 2010, val: !helper.isValidEmail(credential.email) },
    { code: 2011, val: !credential.password }
  );
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  let user = {};
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise
    .then(() => {
      //find user
      let project = {
        ownerId: 1,
        role: 1,
        profileImage: 1,
        name: 1,
        email: 1,
        mobile: 1,
        address: 1,
        defaultDashboard: 1,
        isPackagePurchased: 1,
        package: 1,
        isActive: 1,
        created: 1,
      };
      return db.findOne(
        CUSTOMER,
        {
          email: credential.email,
          password: helper.md5(credential.password),
          isDeleted: { $ne: 1 },
        },
        project
      );
    })
    .then((u) => {
      //check user is exist or not
      if (u.length == 1) {
        user = u[0];
        if (!user.package || user._id != user.ownerId) {
          user.isPackagePurchased = 0;
          user.package = {
            packageId: "",
            deviceCount: 0,
          };
        }
        return Promise.resolve(user);
      }
      return Promise.reject(2010);
    })
    .then(() => {
      //check user is active or not
      if (user.isActive == 1) {
        //get default dashboard name
        return db
          .findOne(DASHBOARD, { _id: user.defaultDashboard })
          .then((d) => {
            if (d.length > 0) {
              user.defaultDashboardName = d[0].dashboardName;
            } else {
              user.defaultDashboard = "";
            }
          });

        return Promise.resolve(user);
      }
      return Promise.reject(2012);
    })
    .then(() => {
      //check package for owner
      if (user._id != user.ownerId) {
        return db
          .findOne(
            CUSTOMER,
            { _id: user.ownerId },
            { isPackagePurchased: 1, package: 1 }
          )
          .then((owner) => {
            if (owner.length > 0) {
              if (owner[0].isPackagePurchased) {
                user.isPackagePurchased = owner[0].isPackagePurchased;
                user.package = {
                  packageId: owner[0].package.packageId,
                  deviceCount: owner[0].package.deviceCount,
                };
              }
            }
          });
      }
    })
    .then(() => {
      //get role
      return db.findOne(ROLE, {
        _id: user.role.roleId,
        isDeleted: { $ne: 1 },
      });
    })
    .then((role) => {
      if (role.length == 0) {
        return Promise.reject(2013);
      }
      user.role.roleName = role[0].roleName;
      user.role.modules = role[0].modules;
    })
    .then(() => {
      //get export settings
      return db.find(SETTING, { customerId: user.ownerId });
    })
    .then((r) => {
      //if user settings is not find assign setting for localoffset and timezone
      if (r && r.length > 0) {
        user.settings = r[0];
      } else {
        user.settings = {
          localOffSet: "+00:00",
          dateTimeFormat: "YYYY-MM-DDTHH:mm",
        };
      }
      //insert token token
      let token = {
        user: "customer",
        userId: user._id,
        ttl: helper.token.TTL(),
        created: helper.dbDate(),
      };
      return db.insert(ACCESSTOKEN, token);
    })
    .then((tokenId) => {
      //create token
      let tokenInfo = {
        user: "customer",
        userId: user._id,
        ownerId: user.ownerId || user._id,
        tokenId: tokenId,
        package: user.package,
        modules: user.role.modules,
        settings: user.settings,
      };
      token = helper.token.get(tokenInfo);
      user.token = token;
    })
    .then(() => helper.success(res, user))
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* --------------Response--------------- */
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {get} customer/logout Logout
 * @apiName customer/logout
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will deactivate the token
 *
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'logout successfully',
 *          'data': []
 *     }
 */
customer.logout = (req, res) => {
  /* ---------------Expect---------------- */
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  db.update(ACCESSTOKEN, { _id: req.uSession.tokenId }, { ttl: 0 })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, "", 2502);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {post} customer/changePassword Change Password
 * @apiName customer/changePassword
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will change users password. logout user after changing password
 *
 * @apiParam {String} oldPassword   old password
 * @apiParam {String} newPassword   new password
 *
 * @apiError 2018 old password is required
 * @apiError 2019 new password is required
 * @apiError 2005 password should be greater than 6 and less than 20
 * @apiError 2020 invalid old password
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'updated successfully',
 *          'data': []
 *     }
 */
customer.changePassword = (req, res) => {
  const body = req.body;
  /* ---------------Expect---------------- */
  const oldPassword = body.oldPassword || "";
  const newPassword = body.newPassword || "";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  promise = helper.paramValidate(
    { code: 2018, val: !oldPassword || typeof oldPassword != "string" },
    { code: 2019, val: !newPassword || typeof newPassword != "string" },
    { code: 2005, val: newPassword.length < 6 || newPassword.length > 20 }
  );
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise
    .then(() => {
      return db.findOne(
        CUSTOMER,
        { _id: req.uSession.userId },
        { password: 1 }
      );
    })
    .then((d) => {
      if (helper.md5(oldPassword) != d[0].password) {
        return Promise.reject(2020);
      }
      return db.update(
        CUSTOMER,
        { _id: req.uSession.userId, password: helper.md5(oldPassword) },
        { password: helper.md5(newPassword) }
      );
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, "", 2503);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {post} customer Create
 * @apiName customer/create
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will add or register new customer to portal.
 * No user can create super admin
 *
 * @apiParam {String} name  customer name
 * @apiParam {String} email customer email
 * @apiParam {String} mobile customer mobile
 * @apiParam {String} roleId customer assigned or selected roleId
 * @apiParam {String} address customer address
 *
 * @apiError 2001 Name is required
 * @apiError 2002 Email is required
 * @apiError 2003 Email is invalid
 * @apiError 2004 Password is required #removed
 * @apiError 2005 Password should be greater than 6 and less than 20 #removed
 * @apiError 2006 Address is required
 * @apiError 2007 Role not selected
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   the success message
 * @apiSuccess {Array}   data                      blank array
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'user created',
 *          'data': []
 *     }
 */
customer.create = (req, res) => {
  const body = req.body;
  /* ---------------Expect---------------- */
  const name = body.name;
  const email = body.email;
  //const pwd = body.password || "";
  const mobile = body.mobile || "";
  // const pwd = helper.generatePassword();
  const pwd = "xpandRocks1234";
  const roleId = body.roleId;
  const address = body.address || "";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper
    .paramValidate(
      { code: 2001, val: !name || typeof name != "string" },
      { code: 2002, val: !email },
      { code: 2003, val: !helper.isValidEmail(email) },
      //{ code: 2004, val: !pwd || typeof pwd != "string" },
      //{ code: 2005, val: pwd.length < 6 || pwd.length > 20 },
      { code: 2006, val: typeof address != "string" },
      { code: 2007, val: !roleId }
    )
    .then(() => {
      return helper
        .isExist(CUSTOMER, { email, isDeleted: { $ne: 1 } })
        .then((d) => {
          if (d == 1) {
            return Promise.reject(2008);
          }
          return Promise.resolve();
        });
    })
    .then(() => {
      //check role should be of owner or both
      //no one can assign Super Admin role to any other than owner
      return helper
        .isExist(ROLE, {
          _id: roleId,
          roleName: { $ne: "Super Admin" },
          isDeleted: { $ne: 1 },
        })
        .then((d) => {
          if (d == 1) {
            return Promise.resolve();
          }
          return Promise.reject(2009);
        });
    });
  /* ------------------------------------- */

  /* ------------Param Define-------------- */
  let role = {
    roleId: roleId,
    roleMappingId: "",
  };
  /* ------------------------------------- */

  /* ------------Before Response-------------- */
  promise = promise
    .then(() => {
      //create new customer
      let customer = {
        ownerId: req.uSession.ownerId,
        role: role,
        profileImage: "",
        name: name,
        password: helper.md5(pwd),
        email: email,
        mobile,
        address,
        defaultDashboard: "",
        spocDetails: [],
        isActive: 1,
        isDeleted: 0,
        modified: helper.dbDate(),
        created: helper.dbDate(),
      };

      return db.insert(CUSTOMER, customer);
    })
    .then((customerId) => {
      let roleMapping = {
        user: "customer",
        userId: customerId,
        roleId: roleId,
      };

      return db.insert(ROLEMAPPING, roleMapping).then((roleMappingId) => {
        return Promise.resolve({ roleMappingId, customerId });
      });
    })
    .then((d) => {
      role.roleMappingId = d.roleMappingId;
      return db.update(CUSTOMER, { _id: d.customerId }, { role });
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, {}, 2501);
    })
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  //send mail with welcome msg and username and password
  promise
    .then(() => {
      mq.addTask({
        action: "welcomeCustomerMail",
        name: name,
        email: email,
        password: pwd,
      });
    })
    .catch((e) => {});
  /* ------------------------------------- */
};

/**
 * @api {patch} customer Update details
 * @apiName customer/update
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will update customer details.
 * super admin can not edit email and role and own user also can not edit email and role
 * same thing applies for isActive flag
 *
 * @apiParam {String} customerId customer to update
 * @apiParam {String} [name]     customer name
 * @apiParam {String} [email]    customer email
 * @apiParam {String} [mobile]    customer mobile
 * @apiParam {String} [roleId]   customer assigned or selected roleId
 * @apiParam {String} [address]  customer address
 * @apiParam {String} [isActive] customer active/deactive
 *
 * @apiError 2016 Customer id is required
 * @apiError 2017 No value provided to update
 * @apiError 2001 Name can not be blank
 * @apiError 2002 Email can not be blank
 * @apiError 2003 Email invalid
 * @apiError 2006 Address can not be blank
 * @apiError 2007 Role not selected
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   the success message
 * @apiSuccess {Array}   data                      blank array
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'updated successfully',
 *          'data': []
 *     }
 */
customer.update = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  const customerId = body.customerId;
  const name = body.name;
  const email = body.email;
  const mobile = body.mobile;
  const address = body.address;
  let roleId = body.roleId || 0;
  const isActive = parseInt(body.isActive);
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  promise = helper
    .paramValidate(
      { code: 2016, val: typeof customerId != "string" || customerId == "" },
      { code: 2017, val: !name && !email && !address && roleId == 0 },
      {
        code: 2003,
        val: typeof email == "string" && !helper.isValidEmail(email),
      }
    )
    .then(() => {
      if (!email) {
        return Promise.resolve();
      }
      return helper
        .isExist(CUSTOMER, {
          _id: { $ne: customerId },
          email,
          isDeleted: { $ne: 1 },
        })
        .then((d) => {
          if (d == 1) {
            return Promise.reject(2008);
          }
          return Promise.resolve();
        });
    })
    .then(() => {
      //role can not be change for super admin
      if (customerId == req.uSession.ownerId) {
        roleId = 0;
      }

      //if role is 0 then not change user role
      if (roleId == 0) {
        return Promise.resolve();
      }

      return helper
        .isExist(ROLE, {
          _id: roleId,
          roleName: { $ne: "Super Admin" },
          isDeleted: { $ne: 1 },
        })
        .then((d) => {
          if (d == 1) {
            return Promise.resolve();
          }
          return Promise.reject(2009);
        });
    });
  /* ------------------------------------- */

  /* ------------Param Define-------------- */
  let role = {
    roleId: roleId,
    roleMappingId: "",
  };
  let user = {};
  let dbUser = {
    role: { roleId: "" },
    email: "",
  };
  afterResponse = 0;
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise = promise
    .then(() => {
      //get user
      return db
        .findOne(CUSTOMER, { _id: customerId }, { role: 1, email: 1 })
        .then((u) => {
          if (u.length == 1) {
            dbUser = u[0];
          }
        });
    })
    .then(() => {
      //set update param
      if (name && typeof name == "string") {
        user.name = name;
      }

      if (
        email &&
        typeof email == "string" &&
        customerId != req.uSession.ownerId
      ) {
        user.email = email;
      }

      if (mobile && typeof mobile == "string") {
        user.mobile = mobile;
      }

      if (address && typeof address == "string") {
        user.address = address;
      }

      if (isActive == 0 || isActive == 1) {
        user.isActive = isActive;
      }
    })
    .then(() => {
      if (roleId == 0) {
        return Promise.resolve();
      }
      let roleMapping = {
        user: "customer",
        userId: customerId,
        roleId: roleId,
      };

      return db.insert(ROLEMAPPING, roleMapping).then((roleMappingId) => {
        role.roleMappingId = roleMappingId;
        user.role = role;
        return Promise.resolve();
      });
    })
    .then(() => {
      user.modified = helper.dbDate();
      return db.update(
        CUSTOMER,
        { _id: customerId, ownerId: req.uSession.ownerId },
        user
      );
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      afterResponse = 1;
      helper.success(res, "", 2503);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  //TODO
  //send mail if role change
  //semd mail if user is active deactive
  //remove all token for this user if mail is changed
  promise
    .then(() => {
      //remove user token
      if (afterResponse == 0) {
        return Promise.resolve();
      }

      if (!email && isActive != 0 && !roleId) {
        return Promise.resolve();
      }

      if (
        dbUser.email == email &&
        isActive != 0 &&
        dbUser.role.roleId == roleId
      ) {
        return Promise.resolve();
      }

      return db
        .update(
          ACCESSTOKEN,
          { userId: customerId, user: "customer" },
          { ttl: 0 }
        )
        .then((d) => {});
    })
    .catch((e) => helper.log(e));
  /* ------------------------------------- */
};

/**
 * @api {delete} customer/:id Delete
 * @apiName customer/delete
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will deactivate the customer. user will not be able to delete self or owner
 *
 * @apiError 2016 invalid cutomer
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'deleted successfully',
 *          'data': []
 *     }
 */
customer.delete = function (req, res) {
  let customerId = req.params.id;
  /* ---------------Expect---------------- */
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate({
    code: 2016,
    val:
      !customerId ||
      typeof customerId != "string" ||
      [req.uSession.userId, req.uSession.ownerId].includes(customerId),
  });
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise
    .then(() => {
      db.update(CUSTOMER, { _id: customerId }, { isDeleted: 1 });
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, "", 2504);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {get} customer List
 * @apiName customer/list
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will deactivate the token
 *
 * @apiParam {String} fields   will define param later
 *
 * @apiError NA NA
 * @apiUse ErrorResponse
 *
 * @apiSuccess {String}  _id                          Customer's unique id
 * @apiSuccess {String}  ownerId                      Main Customer's id who is the owner of customer account
 * @apiSuccess {Object}  role                         Role details
 * @apiSuccess {String}  role.roleId                  Role assigned to user
 * @apiSuccess {String}  role.roleMappingId           Role mapped to user id
 * @apiSuccess {String}  role.roleName                Role name
 * @apiSuccess {Array}   role.modules                 Customer access layer
 * @apiSuccess {String}  role.modules.name            Individual section name or text as 'all' which means it has access to all section
 * @apiSuccess {String}  role.modules.grantPermission User has permission to read/write
 * @apiSuccess {Array/String}  role.modules.on              User has permission on dashboard/site id as example or text as 'all' means has permission on all ids
 * @apiSuccess {String}  name                         Customer's name
 * @apiSuccess {String}  email                        Customer's email id
 * @apiSuccess {String}  mobile                        Customer's mobile
 * @apiSuccess {String}  address                      Customer's address
 * @apiSuccess {Boolean} isActive                     Customer's status active or inactive
 * @apiSuccess {Date}    created                      Customer's creation date
 * @apiSuccess {String}  toke                         JWT token
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *		"_id": "5a43b43f1fd3552b8099e3e1",
 *		"ownerId": "5a43b43f1fd3552b8099e3e1",
 *		"role": {
 *			"roleId": "5a41fd588bca800604b140cc",
 *			"roleMappingId": "5a43b4401fd3552b8099e3e2",
 *			"roleName": "Super Admin",
 *			"modules": [
 *				{
 *					"name": "all",
 *					"grantPermission": "write",
 *					"on": "all"
 *				}
 *			]
 *		},
 *		"name": "suhail",
 *		"email": "suhail2@gmail.com",
 *		"address": "",
 *		"isActive": 1,
 *		"created": "2017-12-27 14:54:55.989",
 *		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiY3VzdG9tZXIiLCJ1c2VySWQiOiI1YTQzYjQzZjFmZDM1NTJiODA5OWUzZTEiLCJvd25lcklkIjoiNWE0M2I0M2YxZmQzNTUyYjgwOTllM2UxIiwidG9rZW5JZCI6IjVhNGE3ZDk2ZjA5MmU5MjZlY2E0MGViMCIsIm1vZHVsZXMiOlt7Im5hbWUiOiJhbGwiLCJncmFudFBlcm1pc3Npb24iOiJ3cml0ZSIsIm9uIjoiYWxsIn1dLCJpYXQiOjE1MTQ4MzEyNTR9.SslGslVkbNmh8CQ5sWyyuePsGZvWs3DVn5x8KRlBfg4"
 *	}
 */
customer.list = (req, res) => {
  let query = req.query;
  /* ---------------Expect---------------- */
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  let customers = {};
  let roleIds = [];
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  let project = ["role", "name", "email", "mobile", "address", "isActive"];
  let condition = { ownerId: req.uSession.ownerId, isDeleted: { $ne: 1 } };

  db.smartFind(req, CUSTOMER, condition, project)
    .then((c) => {
      customers = c;
      if (query.count == 1) {
        customers.count -= 1;
        return Promise.resolve();
      }
      customers.forEach((elm) => {
        roleIds.push(elm.role.roleId);
      });

      return db.find(ROLE, { _id: { $in: roleIds } }, { roleName: 1 });
    })
    .then((r) => {
      if (query.count == 1) {
        return Promise.resolve();
      }
      let temp = [];
      let l = customers.length;
      for (i = 0; i < l; i++) {
        r.forEach((elm) => {
          if (customers[i].role.roleId == elm._id) {
            customers[i].role.roleName = elm.roleName;
          }
        });
        if (customers[i].role.roleName != "Super Admin") {
          temp.push(customers[i]);
        }
      }

      customers = temp;
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then(() => {
      helper.success(res, customers);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {patch} customer/deviceToken Add Device Token
 * @apiName customer/deviceToken
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will update device token against user
 *
 * @apiParam deviceToken device token
 * @apiParam deviceType device type android/ios
 *
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'device token updated',
 *          'data': []
 *     }
 */
customer.deviceToken = function (req, res) {
  const body = req.body;
  const customerId = req.uSession.userId;
  /* ---------------Expect---------------- */
  const deviceToken = body.deviceToken || "";
  const deviceType = body.deviceType || "android";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  Promise.resolve()
    .then(() => {
      if (deviceToken == "" || !["ios", "android"].includes(deviceType)) {
        return Promise.resolve();
      }

      db.update(
        CUSTOMER,
        { _id: customerId },
        { deviceToken: deviceToken, deviceType: deviceType }
      );
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, "", 2505);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {post} customer/forgotPassword Forgot password
 * @apiName customer/forgotPassword
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will forgot password
 *
 * @apiParam email email id of customer
 *
 * @apiError 2002 email required
 * @apiError 2003 email invalid
 * @apiError 2021 time restriction error
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'reset link has been sent on your mail.',
 *          'data': []
 *     }
 */
customer.forgotPassword = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  const email = body.email || "";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    { code: 2002, val: !email },
    { code: 2003, val: !helper.isValidEmail(email) }
  );
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  let forgotPassword = {};
  let name = "";
  let afterResponse = 0;
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise = promise
    .then(() => {
      return db.findOne(
        CUSTOMER,
        { email: email },
        { name: 1, forgotPassword: 1 }
      );
    })
    .then((c) => {
      if (c.length == 0) {
        return Promise.resolve();
      }

      name = c[0].name || "user";

      if (c[0].forgotPassword && c[0].forgotPassword.ttl) {
        return helper
          .timeBetween(c[0].forgotPassword.created, c[0].forgotPassword.ttl)
          .then((t) => {
            if (t == 1) {
              return Promise.reject(2021);
            }
          });
      }
    })
    .then(() => {
      forgotPassword = {
        token: helper.md5(helper.dbDate()),
        ttl: 1000 * 60 * 15, // 15 min to valid
        created: helper.dbDate(),
      };

      return db.update(CUSTOMER, { email: email }, { forgotPassword });
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      afterResponse = 1;
      helper.success(res, "", 2506);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  //send mail with reset password mail
  promise
    .then(() => {
      if (afterResponse == 0) {
        return Promise.resolve();
      }

      mq.addTask({
        action: "resetPasswordCustomerMail",
        email: email,
        name: name,
        token: forgotPassword.token,
      });
    })
    .catch((e) => {});
  /* ------------------------------------- */
};

/**
 * @api {post} customer/changePasswordByResetToken Reset Password
 * @apiName customer/changePasswordByResetToken
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will change password by reset token
 *
 * @apiParam password new password
 * @apiParam token token sent on email
 *
 * @apiError 2019 new password required
 * @apiError 2022 token required
 * @apiError 2023 token expired or used
 * @apiUse ErrorResponse
 *
 * @apiSuccess {Integer} code                      Status of the response
 * @apiSuccess {String}  message                   Error or the success message
 * @apiSuccess {Array}  data                       blank array
 * @apiSuccessExample {json} Success-Response:
 *HTTP/1.1 200 OK
 *     {
 *          'code': 0,
 *          'message': 'password reset successfully. try login',
 *          'data': []
 *     }
 */
customer.changePasswordByResetToken = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  const password = body.password || "";
  const token = body.token || "";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    { code: 2019, val: !password },
    { code: 2022, val: !token }
  );
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise = promise
    .then(() => {
      return db.findOne(
        CUSTOMER,
        { "forgotPassword.token": token },
        { forgotPassword: 1 }
      );
    })
    .then((c) => {
      if (c.length == 0) {
        return Promise.reject(2023);
      }

      if (
        c[0].forgotPassword &&
        c[0].forgotPassword.token &&
        c[0].forgotPassword.token == token
      ) {
        return helper
          .timeBetween(c[0].forgotPassword.created, c[0].forgotPassword.ttl)
          .then((t) => {
            if (t == 1) {
              return Promise.resolve();
            }

            return Promise.reject(2023);
          });
      } else {
        return Promise.reject(2022);
      }
    })
    .then(() => {
      let forgotPassword = {};

      return db.update(
        CUSTOMER,
        { "forgotPassword.token": token },
        { forgotPassword, password: helper.md5(password) }
      );
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, "", 2507);
    })
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

/**
 * @api {post} customer/subscription Current Package
 * @apiName customer/subscription
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * @apiDescription This api will current subscription
 *
 *
 * @apiUse ErrorResponse
 *
 * @apiSuccess {String}  packageId              package id
 * @apiSuccess {Integer} price                  package purchased price
 * @apiSuccess {Integer} deviceCount            device count
 * @apiSuccess {String="normal","custom"} type  type of package
 * @apiSuccess {String}  tenure                 tenure
 * @apiSuccess {Date}  expiry                   date
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *    	 packageId: "",
 *    	 price: 350,
 *    	 deviceCount: 10,
 *    	 type:"normal",
 *    	 tenure: "monthly" ,
 *    	 packageName: "Starter" ,
 *    	 expiry: ""
 *    }
 */
customer.subscription = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  let package = {};

  console.log("req.uSession.ownerId ::" + req.uSession.ownerId);

  /* ------------------------------------- */

  /* ------------Before Response---------- */
  Promise.resolve()
    .then(() => {
      return db.findOne(
        CUSTOMER,
        { _id: req.uSession.ownerId, isPackagePurchased: 1 },
        { package: 1 }
      );
    })
    .then((r) => {
      console.log("============");
      console.log(r);
      console.log("==============");
      if (r.length == 0) {
        return Promise.reject({});
      }
      let packageId =
        r[0]["package"] && r[0]["package"]["packageId"]
          ? r[0]["package"]["packageId"]
          : null;

      console.log("packageId :: " + packageId);

      if (packageId == null) {
        return Promise.reject({});
      }
      return db.findOne(
        PACKAGEPURCHASED,
        {
          $and: [
            { customerId: req.uSession.ownerId },
            { isExpired: 0 },
            { packageId: packageId },
            { $or: [{ isDeleted: 0 }, { isDeleted: { $exists: false } }] },
          ],
        },
        {
          packageId: 1,
          price: 1,
          deviceCount: 1,
          type: 1,
          tenure: 1,
          expiry: 1,
        }
      );
    })
    .then((p) => {
      if (p.length == 0) {
        return Promise.resolve([]);
      }

      package = p[0];

      return db.findOne(PACKAGE, { _id: p[0].packageId }, { packageName: 1 });
    })
    .then((p) => {
      if (p.length == 0) {
        return Promise.resolve();
      }

      package.packageName = p[0].packageName;
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then((d) => {
      helper.success(res, package);
    })
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

customer.updateImage = function (req, res) {
  const files = req.files;
  const body = req.body;
  /* ---------------Expect---------------- */
  const customerId = req.uSession.userId;
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    { code: 2024, val: !files.avatar },
    { code: 2025, val: files.avatar.mimetype != "image/jpeg" }
  );
  /* ------------------------------------- */

  /* ------------Param Define------------- */
  let filePath = "";
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise
    .then(() => {
      return new Promise((resolve, reject) => {
        //Create a jimp instance for this image
        new Jimp(files.avatar.data, (err, image) => {
          //Resize this image
          image
            .resize(200, 200)
            //lower the quality by 90%
            .quality(80)
            .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
              files.avatar.data = buffer;
              //Resolve base94 string
              resolve();
            });
        });
      });
    })
    .then(() => {
      filePath = "profile/" + customerId + ".jpg";
      return upload.image(filePath, "user", files.avatar);
    })
    .then(() => {
      return db.update(
        CUSTOMER,
        { _id: customerId },
        { profileImage: filePath }
      );
    })
    /* ------------------------------------- */

    /* --------------Response--------------- */
    .then(() => {
      helper.success(res, "", 2508);
    })
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

customer.retrainData = async function (req, res) {
  /* ---------------Expect---------------- */
  /* ------------------------------------- */
  var customer = req.uSession.userId;
  /* ------------Before Response---------- */
  var result = await predictiveAnalysis.retrainCustomerData(customer);
  if (result == 1) {
    helper.success(res, "", 3232);
  } else {
    helper.error(res, "Something went wrong on server");
  }
  // .then(() => {
  //   helper.success(res, "", 3232);
  // })
  //   .catch(e => {
  //     helper.error(res, e);
  //   });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

customer.updateSeperatorSymbol = function (req, res) {
  const body = req.body;
  /* ---------------Expect---------------- */
  const customerId = req.uSession.ownerId;
  const thousandSeperator = body.thousandSymbol;
  const decimalSeperator = body.decimalSymbol;
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  promise = helper
    .paramValidate(
      { code: 2016, val: typeof customerId != "string" || customerId == "" },
      { code: 2017, val: !thousandSeperator && !decimalSeperator }
    )
    .then(() => {
      return db.update(
        SETTING,
        { customerId: customerId },
        { thousandSymbol: thousandSeperator, decimalSymbol: decimalSeperator }
      );
    })
    .then(() => {
      helper.success(res, "", 2503);
    })
    .catch((e) => helper.error(res, e));
  /* ------------------------------------- */
};

customer.GetCustomerIdByCreds = (req, res) => {
  const body = req.params;

  /* ---------------Expect---------------- */
  let username = body.username || "";
  let password = body.password || "";
  //const customerId = "5b7bb325161fa903f2f243c5";
  /* ------------------------------------- */

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    { code: 2010, val: !username },
    { code: 2010, val: !helper.isValidEmail(username) },
    { code: 2011, val: !password }
  );
  /* ------------Param Define------------- */
  let customer = {};
  /* ------------------------------------- */

  /* ------------Before Response---------- */
  promise
    .then(() => {
      //find user
      return db.findOne(
        CUSTOMER,
        {
          email: username,
          password: helper.md5(password),
          isDeleted: { $ne: 1 },
        },
        {
          ownerId: 1,
          name: 1,
        }
      );
    })
    .then((u) => {
      //check user is exist or not
      if (u.length == 1) {
        customer["customerId"] = u[0].ownerId;
        customer["Name"] = u[0].name;
        return Promise.resolve(customer);
      }
      return Promise.reject(2010);
    })
    .then(() => helper.success(res, customer))
    .catch((e) => {
      helper.error(res, e);
    });
  /* ------------------------------------- */

  /* ------------After Respons------------ */
  /* ------------------------------------- */
};

module.exports = function (app, uri) {
  customerRouter.post("/login", customer.login);
  customerRouter.get("/logout", customer.logout);
  customerRouter.post("/changePassword", customer.changePassword);
  customerRouter.patch("/deviceToken", customer.deviceToken);
  customerRouter.post("/forgotPassword", customer.forgotPassword);
  customerRouter.post("/retrainData", customer.retrainData);
  customerRouter.post(
    "/changePasswordByResetToken",
    customer.changePasswordByResetToken
  );
  customerRouter.post("/subscription", customer.subscription);
  customerRouter.post("/updateImage", customer.updateImage);

  customerRouter.get("/", customer.list);
  customerRouter.post("/", customer.create);
  customerRouter.patch("/", customer.update);
  customerRouter.patch("/updateSymbol", customer.updateSeperatorSymbol);
  customerRouter.delete("/:id", customer.delete);
  customerRouter.get(
    "/details/:username/:password",
    customer.GetCustomerIdByCreds
  );

  //for crud
  app.use(uri, customerRouter);
};
