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
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JRoleService = Java.type('io.vertx.armysystem.microservice.account.RoleService');
var Role = Java.type('io.vertx.armysystem.microservice.account.Role');

/**
 A service interface managing user roles.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var RoleService = function(j_val) {

  var j_roleService = j_val;
  var that = this;

  /**
   Initialize the persistence.

   @public
   @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.initializePersistence = function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_roleService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
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
   Add a role to the persistence.

   @public
   @param role {Object} a role entity that we want to add 
   @param resultHandler {function} the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.addRole = function(role, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_roleService["addRole(io.vertx.armysystem.microservice.account.Role,io.vertx.core.Handler)"](role != null ? new Role(new JsonObject(Java.asJSONCompatible(role))) : null, function(ar) {
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
   Retrieve the user role with certain `id`.

   @public
   @param id {string} user role id 
   @param resultHandler {function} the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.retrieveRole = function(id, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
      j_roleService["retrieveRole(java.lang.String,io.vertx.core.Handler)"](id, function(ar) {
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
   Retrieve the user role with certain `username`.

   @public
   @param roleName {string} unique role name 
   @param resultHandler {function} the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.retrieveByRoleName = function(roleName, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
      j_roleService["retrieveByRoleName(java.lang.String,io.vertx.core.Handler)"](roleName, function(ar) {
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
   Retrieve all user roles.

   @public
   @param resultHandler {function} the result handler will be called as soon as the roles have been retrieved. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.retrieveAllRoles = function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_roleService["retrieveAllRoles(io.vertx.core.Handler)"](function(ar) {
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
   Retrieve role count with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param resultHandler {function} the result handler will be called as soon as the role count has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.count = function(condition, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_roleService["count(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(condition), function(ar) {
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
   Retrieve the user roles by page with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param resultHandler {function} the result handler will be called as soon as the roles has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.retrieveRolesByCondition = function(condition, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_roleService["retrieveRolesByCondition(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(condition), function(ar) {
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
   Update user role info.

   @public
   @param role {Object} a user role entity that we want to update 
   @param resultHandler {function} the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.updateRole = function(role, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_roleService["updateRole(io.vertx.armysystem.microservice.account.Role,io.vertx.core.Handler)"](role != null ? new Role(new JsonObject(Java.asJSONCompatible(role))) : null, function(ar) {
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
   Delete a user role from the persistence

   @public
   @param id {string} user role id 
   @param resultHandler {function} the result handler will be called as soon as the role has been removed. The async result indicates whether the operation was successful or not. 
   @return {RoleService}
   */
  this.deleteRole = function(id, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && typeof __args[0] === 'string' && typeof __args[1] === 'function') {
      j_roleService["deleteRole(java.lang.String,io.vertx.core.Handler)"](id, function(ar) {
      if (ar.succeeded()) {
        resultHandler(null, null);
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
  this._jdel = j_roleService;
};

RoleService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.account.RoleService");
RoleService._jtype = {
  accept: function(obj) {
    return RoleService._jclass.isInstance(obj._jdel);
  },
  wrap: function(jdel) {
    var obj = Object.create(RoleService.prototype, {});
    RoleService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
RoleService._create = function(jdel) {
  var obj = Object.create(RoleService.prototype, {});
  RoleService.apply(obj, arguments);
  return obj;
}
module.exports = RoleService;