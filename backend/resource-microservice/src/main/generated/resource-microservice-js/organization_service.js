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

/** @module resource-microservice-js/organization_service */
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JOrganizationService = Java.type('io.vertx.armysystem.microservice.resource.OrganizationService');

/**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var OrganizationService = function(j_val) {

  var j_organizationService = j_val;
  var that = this;

  /**
   Initialize the persistence.

   @public
   @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.initializePersistence = function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_organizationService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
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
   Add an item to the persistence.

   @public
   @param item {Object} an entity that we want to add 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.addOne = function(item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_organizationService["addOne(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(item), utils.convParamJsonObject(principal), function(ar) {
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
   Retrieve the item with certain `id`.

   @public
   @param id {string} item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.retrieveOne = function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_organizationService["retrieveOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(principal), function(ar) {
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
   Retrieve all items.

   @public
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the items have been retrieved. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.retrieveAll = function(principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_organizationService["retrieveAll(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnListSetJson(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve item count with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the device count has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.count = function(condition, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_organizationService["count(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(condition), utils.convParamJsonObject(principal), function(ar) {
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
   Retrieve items by page with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the devices has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.retrieveManyByCondition = function(condition, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_organizationService["retrieveManyByCondition(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(condition), utils.convParamJsonObject(principal), function(ar) {
      if (ar.succeeded()) {
        resultHandler(utils.convReturnListSetJson(ar.result()), null);
      } else {
        resultHandler(null, ar.cause());
      }
    });
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
   @return {OrganizationService}
   */
  this.updateOne = function(id, item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
      j_organizationService["updateOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(item), utils.convParamJsonObject(principal), function(ar) {
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
   Delete an item from the persistence

   @public
   @param id {string} the item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.deleteOne = function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_organizationService["deleteOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(principal), function(ar) {
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
   swap the position of two organizations

   @public
   @param id {string} the item id 
   @param otherId {string} the other item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not. 
   @return {OrganizationService}
   */
  this.swapPosition = function(id, otherId, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && typeof __args[0] === 'string' && typeof __args[1] === 'string' && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
      j_organizationService["swapPosition(java.lang.String,java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, otherId, utils.convParamJsonObject(principal), function(ar) {
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
  this._jdel = j_organizationService;
};

OrganizationService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.resource.OrganizationService");
OrganizationService._jtype = {
  accept: function(obj) {
    return OrganizationService._jclass.isInstance(obj._jdel);
  },
  wrap: function(jdel) {
    var obj = Object.create(OrganizationService.prototype, {});
    OrganizationService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
OrganizationService._create = function(jdel) {
  var obj = Object.create(OrganizationService.prototype, {});
  OrganizationService.apply(obj, arguments);
  return obj;
}
module.exports = OrganizationService;