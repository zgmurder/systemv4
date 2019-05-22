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

/** @module resource-microservice-js/soldier_service */
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JSoldierService = Java.type('io.vertx.armysystem.microservice.resource.SoldierService');

/**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var SoldierService = function(j_val) {

  var j_soldierService = j_val;
  var that = this;

  var __super_initializePersistence = this.initializePersistence;
  var __super_addOne = this.addOne;
  var __super_retrieveOne = this.retrieveOne;
  var __super_retrieveAll = this.retrieveAll;
  var __super_count = this.count;
  var __super_retrieveManyByCondition = this.retrieveManyByCondition;
  var __super_updateOne = this.updateOne;
  var __super_deleteOne = this.deleteOne;
  var __super_change = this.change;
  var __super_retrieveArchives = this.retrieveArchives;
  /**
   Initialize the persistence.

   @public
   @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.initializePersistence =  function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_soldierService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
        if (ar.succeeded()) {
          __args[0](null, null);
        } else {
          __args[0](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_initializePersistence != 'undefined') {
      return __super_initializePersistence.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Add an item to the persistence.

   @public
   @param item {Object} an entity that we want to add 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.addOne =  function(item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["addOne(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(__args[0]), utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](utils.convReturnJson(ar.result()), null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_addOne != 'undefined') {
      return __super_addOne.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve the item with certain `id`.

   @public
   @param id {string} item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.retrieveOne =  function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["retrieveOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](utils.convReturnJson(ar.result()), null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_retrieveOne != 'undefined') {
      return __super_retrieveOne.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve all items.

   @public
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the items have been retrieved. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.retrieveAll =  function(principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 2 && (typeof __args[0] === 'object' && __args[0] != null) && typeof __args[1] === 'function') {
      j_soldierService["retrieveAll(io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(__args[0]), function(ar) {
        if (ar.succeeded()) {
          __args[1](utils.convReturnListSetJson(ar.result()), null);
        } else {
          __args[1](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_retrieveAll != 'undefined') {
      return __super_retrieveAll.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve item count with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the device count has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.count =  function(condition, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["count(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(__args[0]), utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](utils.convReturnLong(ar.result()), null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_count != 'undefined') {
      return __super_count.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Retrieve items by page with query conditions.

   @public
   @param condition {Object} query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the devices has been retrieved. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.retrieveManyByCondition =  function(condition, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["retrieveManyByCondition(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(__args[0]), utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](utils.convReturnListSetJson(ar.result()), null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_retrieveManyByCondition != 'undefined') {
      return __super_retrieveManyByCondition.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Update an item info.

   @public
   @param id {string} the item id 
   @param item {Object} an entity that we want to update 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.updateOne =  function(id, item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
      j_soldierService["updateOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), utils.convParamJsonObject(__args[2]), function(ar) {
        if (ar.succeeded()) {
          __args[3](utils.convReturnJson(ar.result()), null);
        } else {
          __args[3](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_updateOne != 'undefined') {
      return __super_updateOne.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   Delete an item from the persistence

   @public
   @param id {string} the item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.deleteOne =  function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["deleteOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](null, null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_deleteOne != 'undefined') {
      return __super_deleteOne.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   change the soldier's position or rank or organization, etc.

   @public
   @param id {string} the item id 
   @param item {Object} change object 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as change completed. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.change =  function(id, item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 4 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
      j_soldierService["change(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), utils.convParamJsonObject(__args[2]), function(ar) {
        if (ar.succeeded()) {
          __args[3](utils.convReturnJson(ar.result()), null);
        } else {
          __args[3](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_change != 'undefined') {
      return __super_change.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  /**
   retrieve soldier's change archives.

   @public
   @param cardId {string} the soldier's cardId 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as archives are queried. The async result indicates whether the operation was successful or not. 
   @return {SoldierService}
   */
  this.retrieveArchives =  function(cardId, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_soldierService["retrieveArchives(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), function(ar) {
        if (ar.succeeded()) {
          __args[2](utils.convReturnListSetJson(ar.result()), null);
        } else {
          __args[2](null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_retrieveArchives != 'undefined') {
      return __super_retrieveArchives.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  // A reference to the underlying Java delegate
  // NOTE! This is an internal API and must not be used in user code.
  // If you rely on this property your code is likely to break if we change it / remove it without warning.
  this._jdel = j_soldierService;
};

SoldierService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.resource.SoldierService");
SoldierService._jtype = {accept: function(obj) {
    return SoldierService._jclass.isInstance(obj._jdel);
  },wrap: function(jdel) {
    var obj = Object.create(SoldierService.prototype, {});
    SoldierService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
SoldierService._create = function(jdel) {var obj = Object.create(SoldierService.prototype, {});
  SoldierService.apply(obj, arguments);
  return obj;
}
module.exports = SoldierService;