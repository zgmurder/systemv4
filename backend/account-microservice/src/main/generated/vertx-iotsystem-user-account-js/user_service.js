/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/** @module vertx-iotsystem-user-account-js/user_service */
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JUserService = Java.type('io.vertx.iotsystem.microservice.account.UserService');
var User = Java.type('io.vertx.iotsystem.microservice.account.User');

/**
 A service interface managing user accounts.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var UserService = function(j_val) {

  var j_userService = j_val;
  var that = this;

  /**
   Initialize the persistence.

   @public
   @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.initializePersistence = function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_userService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
      if (ar.succeeded()) {
        resultHandler(null, null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Add a account to the persistence.

   @public
   @param user {Object} a account entity that we want to add 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the account has been added. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.addUser = function(user, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["addUser(io.vertx.iotsystem.microservice.account.User,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](user != null ? new User(new JsonObject(Java.asJSONCompatible(user))) : null, utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve the user account with certain `id`.

   @public
   @param id {string} user account id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the user has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.retrieveUser = function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["retrieveUser(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve the user account with certain `username`.

   @public
   @param username {string} username 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the user has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.retrieveByUsername = function(username, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["retrieveByUsername(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](username, utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve all user accounts.

   @public
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the users have been retrieved. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.retrieveAllUsers = function(principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_userService["retrieveAllUsers(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnListSetDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve user count with query conditions.

   @public
   @param query {Object} query conditions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the user count has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.count = function(query, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["count(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(query), utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnLong(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve the user accounts by page with query conditions.

   @public
   @param query {Object} query conditions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param findOptions {Object} find options. (includes fields, sort, limit, skip) 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the users has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.retrieveUsersByCondition = function(query, findOptions, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
      j_userService["retrieveUsersByCondition(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(query), utils.convParamJsonObject(findOptions), utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnListSetDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Update user account info.

   @public
   @param user {Object} a account entity that we want to update 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the account has been added. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.updateUser = function(user, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["updateUser(io.vertx.iotsystem.microservice.account.User,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](user != null ? new User(new JsonObject(Java.asJSONCompatible(user))) : null, utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Delete a user account from the persistence

   @public
   @param id {string} user account id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the user has been removed. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.deleteUser = function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_userService["deleteUser(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(null, null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Login user with username and password

   @public
   @param username {string} username 
   @param password {string} password 
   @param resultHandler {function} the result handler will be called as soon as the user login. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.loginUser = function(username, password, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && typeof __args[1] === 'string' && typeof __args[2] === 'function') {
      j_userService["loginUser(java.lang.String,java.lang.String,io.vertx.core.Handler)"](username, password, function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnJson(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Login user with username and password

   @public
   @param username {string} username 
   @param oldPassword {string} the origin password need to be verified 
   @param newPassword {string} the new password to be set 
   @param resultHandler {function} the result handler will be called as soon as the new password is set. The async result indicates whether the operation was successful or not. 
   @return {UserService}
   */
  this.updatePassword = function(username, oldPassword, newPassword, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && typeof __args[0] === 'string' && typeof __args[1] === 'string' && typeof __args[2] === 'string' && typeof __args[3] === 'function') {
      j_userService["updatePassword(java.lang.String,java.lang.String,java.lang.String,io.vertx.core.Handler)"](username, oldPassword, newPassword, function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnDataObject(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  // A reference to the underlying Java delegate
  // NOTE! This is an internal API and must not be used in user code.
  // If you rely on this property your code is likely to break if we change it / remove it without warning.
  this._jdel = j_userService;
};

UserService._jclass = utils.getJavaClass("io.vertx.iotsystem.microservice.account.UserService");
UserService._jtype = {
  accept: function(obj) {
    return UserService._jclass.isInstance(obj._jdel);
  },
  wrap: function(jdel) {
    var obj = Object.create(UserService.prototype, {});
    UserService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
UserService._create = function(jdel) {
  var obj = Object.create(UserService.prototype, {});
  UserService.apply(obj, arguments);
  return obj;
}
module.exports = UserService;