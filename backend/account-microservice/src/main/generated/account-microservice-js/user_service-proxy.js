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

/// <reference path="./user_service-proxy.d.ts" />

/** @module account-microservice-js/user_service */
!function (factory) {
  if (typeof require === 'function' && typeof module !== 'undefined') {
    factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD loader
    define('account-microservice-js/user_service-proxy', [], factory);
  } else {
    // plain old include
    UserService = factory();
  }
}(function () {
  var CRUDService = require('business-common-js/crud_service-proxy');

  /**
   A service interface managing user accounts.
   <p>
   This service is an event bus service (aka. service proxy).
   </p>

   @class
  */
  var UserService = function(eb, address) {
    var j_eb = eb;
    var j_address = address;
    var closed = false;
    var that = this;
    var convCharCollection = function(coll) {
      var ret = [];
      for (var i = 0;i < coll.length;i++) {
        ret.push(String.fromCharCode(coll[i]));
      }
      return ret;
    };
    CRUDService.call(this, j_val);

    /**
     Initialize the persistence.

     @public
     @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.initializePersistence =  function(resultHandler) {
      var __args = arguments;
      if (__args.length === 1 && typeof __args[0] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {}, {"action":"initializePersistence"}, function(err, result) { __args[0](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Add an item to the persistence.

     @public
     @param item {Object} an entity that we want to add 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.addOne =  function(item, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"item":__args[0], "principal":__args[1]}, {"action":"addOne"}, function(err, result) { __args[2](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve the item with certain `id`.

     @public
     @param id {string} item id 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the item has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.retrieveOne =  function(id, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0], "principal":__args[1]}, {"action":"retrieveOne"}, function(err, result) { __args[2](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve all items.

     @public
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the items have been retrieved. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.retrieveAll =  function(principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"principal":__args[0]}, {"action":"retrieveAll"}, function(err, result) { __args[1](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve item count with query conditions.

     @public
     @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the device count has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.count =  function(condition, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"condition":__args[0], "principal":__args[1]}, {"action":"count"}, function(err, result) { __args[2](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve items by page with query conditions.

     @public
     @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the devices has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.retrieveManyByCondition =  function(condition, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"condition":__args[0], "principal":__args[1]}, {"action":"retrieveManyByCondition"}, function(err, result) { __args[2](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Update an item info.

     @public
     @param id {string} the item id 
     @param item {Object} an entity that we want to update 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.updateOne =  function(id, item, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 4 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0], "item":__args[1], "principal":__args[2]}, {"action":"updateOne"}, function(err, result) { __args[3](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Delete an item from the persistence

     @public
     @param id {string} the item id 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not. 
     @return {UserService}
     */
    this.deleteOne =  function(id, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0], "principal":__args[1]}, {"action":"deleteOne"}, function(err, result) { __args[2](err, result && result.body); });
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
    this.loginUser =  function(username, password, resultHandler) {
      var __args = arguments;
      if (__args.length === 3 && typeof __args[0] === 'string' && typeof __args[1] === 'string' && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"username":__args[0], "password":__args[1]}, {"action":"loginUser"}, function(err, result) { __args[2](err, result && result.body); });
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
    this.updatePassword =  function(username, oldPassword, newPassword, resultHandler) {
      var __args = arguments;
      if (__args.length === 4 && typeof __args[0] === 'string' && typeof __args[1] === 'string' && typeof __args[2] === 'string' && typeof __args[3] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"username":__args[0], "oldPassword":__args[1], "newPassword":__args[2]}, {"action":"updatePassword"}, function(err, result) { __args[3](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = UserService;
    } else {
      exports.UserService = UserService;
    }
  } else {
    return UserService;
  }
});