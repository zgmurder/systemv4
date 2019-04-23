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

/** @module dictionary-microservice-js/group_train_method_service */
var utils = require('vertx-js/util/utils');
var CRUDService = require('business-common-js/crud_service');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JGroupTrainMethodService = Java.type('io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService');

/**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var GroupTrainMethodService = function(j_val) {

  var j_groupTrainMethodService = j_val;
  var that = this;
  CRUDService.call(this, j_val);

  /**

   @public
   @param arg0 {function} 
   @return {CRUDService}
   */
  this.initializePersistence = function(arg0) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_groupTrainMethodService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
      if (ar.succeeded()) {
        arg0(null, null);
      } else {
        arg0(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {Object} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.addOne = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["addOne(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(arg0), utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(utils.convReturnJson(ar.result()), null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {string} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.retrieveOne = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["retrieveOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](arg0, utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(utils.convReturnJson(ar.result()), null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {Object} 
   @param arg1 {function} 
   @return {CRUDService}
   */
  this.retrieveAll = function(arg0, arg1) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_groupTrainMethodService["retrieveAll(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(arg0), function(ar) {
      if (ar.succeeded()) {
        arg1(utils.convReturnListSetJson(ar.result()), null);
      } else {
        arg1(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {Object} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.count = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["count(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(arg0), utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(utils.convReturnLong(ar.result()), null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {Object} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.retrieveManyByCondition = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["retrieveManyByCondition(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(arg0), utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(utils.convReturnListSetJson(ar.result()), null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {Object} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.updateOne = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["updateOne(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(arg0), utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(utils.convReturnJson(ar.result()), null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  /**

   @public
   @param arg0 {string} 
   @param arg1 {Object} 
   @param arg2 {function} 
   @return {CRUDService}
   */
  this.deleteOne = function(arg0, arg1, arg2) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_groupTrainMethodService["deleteOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](arg0, utils.convParamJsonObject(arg1), function(ar) {
      if (ar.succeeded()) {
        arg2(null, null);
      } else {
        arg2(null, ar.cause());
      }
    });
      return that;
    } else throw new TypeError('function invoked with invalid arguments');
  };

  // A reference to the underlying Java delegate
  // NOTE! This is an internal API and must not be used in user code.
  // If you rely on this property your code is likely to break if we change it / remove it without warning.
  this._jdel = j_groupTrainMethodService;
};

GroupTrainMethodService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService");
GroupTrainMethodService._jtype = {
  accept: function(obj) {
    return GroupTrainMethodService._jclass.isInstance(obj._jdel);
  },
  wrap: function(jdel) {
    var obj = Object.create(GroupTrainMethodService.prototype, {});
    GroupTrainMethodService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
GroupTrainMethodService._create = function(jdel) {
  var obj = Object.create(GroupTrainMethodService.prototype, {});
  GroupTrainMethodService.apply(obj, arguments);
  return obj;
}
module.exports = GroupTrainMethodService;