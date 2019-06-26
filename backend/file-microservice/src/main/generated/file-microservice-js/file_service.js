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

/** @module file-microservice-js/file_service */
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JFileService = Java.type('io.vertx.armysystem.microservice.file.FileService');

/**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var FileService = function(j_val) {

  var j_fileService = j_val;
  var that = this;

  var __super_initializePersistence = this.initializePersistence;
  var __super_addOne = this.addOne;
  var __super_retrieveOne = this.retrieveOne;
  var __super_deleteOne = this.deleteOne;
  /**
   Initialize the persistence.

   @public
   @param resultHandler {function} the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not. 
   @return {FileService}
   */
  this.initializePersistence =  function(resultHandler) {
    var __args = arguments;
    if (__args.length === 1 && typeof __args[0] === 'function') {
      j_fileService["initializePersistence(io.vertx.core.Handler)"](function(ar) {
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
   @return {FileService}
   */
  this.addOne =  function(item, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_fileService["addOne(io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](utils.convParamJsonObject(__args[0]), utils.convParamJsonObject(__args[1]), function(ar) {
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
   @return {FileService}
   */
  this.retrieveOne =  function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_fileService["retrieveOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), function(ar) {
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
   Delete an item from the persistence

   @public
   @param id {string} the item id 
   @param principal {Object} 
   @param resultHandler {function} the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not. 
   @return {FileService}
   */
  this.deleteOne =  function(id, principal, resultHandler) {
    var __args = arguments;
    if (__args.length === 3 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
      j_fileService["deleteOne(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](__args[0], utils.convParamJsonObject(__args[1]), function(ar) {
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

  // A reference to the underlying Java delegate
  // NOTE! This is an internal API and must not be used in user code.
  // If you rely on this property your code is likely to break if we change it / remove it without warning.
  this._jdel = j_fileService;
};

FileService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.file.FileService");
FileService._jtype = {accept: function(obj) {
    return FileService._jclass.isInstance(obj._jdel);
  },wrap: function(jdel) {
    var obj = Object.create(FileService.prototype, {});
    FileService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
FileService._create = function(jdel) {var obj = Object.create(FileService.prototype, {});
  FileService.apply(obj, arguments);
  return obj;
}
module.exports = FileService;