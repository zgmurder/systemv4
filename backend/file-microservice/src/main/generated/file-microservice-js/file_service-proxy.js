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

/// <reference path="./file_service-proxy.d.ts" />

/** @module file-microservice-js/file_service */
!function (factory) {
  if (typeof require === 'function' && typeof module !== 'undefined') {
    factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD loader
    define('file-microservice-js/file_service-proxy', [], factory);
  } else {
    // plain old include
    FileService = factory();
  }
}(function () {

  /**
   A service interface manage entities.
   <p>
   This service is an event bus service (aka. service proxy).
   </p>

   @class
  */
  var FileService = function(eb, address) {
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
     @return {FileService}
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
     @return {FileService}
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
     @return {FileService}
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0], "principal":__args[1]}, {"action":"deleteOne"}, function(err, result) { __args[2](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = FileService;
    } else {
      exports.FileService = FileService;
    }
  } else {
    return FileService;
  }
});