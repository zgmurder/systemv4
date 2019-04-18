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

/** @module account-microservice-js/role_service */
!function (factory) {
  if (typeof require === 'function' && typeof module !== 'undefined') {
    factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD loader
    define('account-microservice-js/role_service-proxy', [], factory);
  } else {
    // plain old include
    RoleService = factory();
  }
}(function () {

  /**
 A service interface managing user roles.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
  */
  var RoleService = function(eb, address) {

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

    /**
     Initialize the persistence.

     @public
     @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.initializePersistence = function(resultHandler) {
      var __args = arguments;
      if (__args.length === 1 && typeof __args[0] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {}, {"action":"initializePersistence"}, function(err, result) { __args[0](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Add a role to the persistence.

     @public
     @param role {Object} a role entity that we want to add 
     @param resultHandler {function} the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.addRole = function(role, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"role":__args[0]}, {"action":"addRole"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve the user role with certain `id`.

     @public
     @param id {string} user role id 
     @param resultHandler {function} the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.retrieveRole = function(id, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0]}, {"action":"retrieveRole"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve the user role with certain `username`.

     @public
     @param roleName {string} unique role name 
     @param resultHandler {function} the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.retrieveByRoleName = function(roleName, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"roleName":__args[0]}, {"action":"retrieveByRoleName"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve all user roles.

     @public
     @param resultHandler {function} the result handler will be called as soon as the roles have been retrieved. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.retrieveAllRoles = function(resultHandler) {
      var __args = arguments;
      if (__args.length === 1 && typeof __args[0] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {}, {"action":"retrieveAllRoles"}, function(err, result) { __args[0](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve role count with query conditions.

     @public
     @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
     @param resultHandler {function} the result handler will be called as soon as the role count has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.count = function(condition, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"condition":__args[0]}, {"action":"count"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Retrieve the user roles by page with query conditions.

     @public
     @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
     @param resultHandler {function} the result handler will be called as soon as the roles has been retrieved. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.retrieveRolesByCondition = function(condition, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"condition":__args[0]}, {"action":"retrieveRolesByCondition"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Update user role info.

     @public
     @param role {Object} a user role entity that we want to update 
     @param resultHandler {function} the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.updateRole = function(role, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"role":__args[0]}, {"action":"updateRole"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

    /**
     Delete a user role from the persistence

     @public
     @param id {string} user role id 
     @param resultHandler {function} the result handler will be called as soon as the role has been removed. The async result indicates whether the operation was successful or not. 
     @return {RoleService}
     */
    this.deleteRole = function(id, resultHandler) {
      var __args = arguments;
      if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0]}, {"action":"deleteRole"}, function(err, result) { __args[1](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = RoleService;
    } else {
      exports.RoleService = RoleService;
    }
  } else {
    return RoleService;
  }
});