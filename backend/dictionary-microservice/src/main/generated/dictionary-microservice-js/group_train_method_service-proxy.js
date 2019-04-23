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
!function (factory) {
  if (typeof require === 'function' && typeof module !== 'undefined') {
    factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD loader
    define('dictionary-microservice-js/group_train_method_service-proxy', [], factory);
  } else {
    // plain old include
    GroupTrainMethodService = factory();
  }
}(function () {
  var CRUDService = require('business-common-js/crud_service-proxy');

  /**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
  */
  var GroupTrainMethodService = function(eb, address) {

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

     @public
     @param arg0 {function} 
     @return {CRUDService}
     */
    this.initializePersistence = function(arg0) {
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

     @public
     @param arg0 {Object} 
     @param arg1 {Object} 
     @param arg2 {function} 
     @return {CRUDService}
     */
    this.addOne = function(arg0, arg1, arg2) {
      var __args = arguments;
      if (__args.length === 3 && (typeof __args[0] === 'object' && __args[0] != null) && (typeof __args[1] === 'object' && __args[1] != null) && typeof __args[2] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"addOne"}, function(err, result) { __args[2](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"retrieveOne"}, function(err, result) { __args[2](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0]}, {"action":"retrieveAll"}, function(err, result) { __args[1](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"count"}, function(err, result) { __args[2](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"retrieveManyByCondition"}, function(err, result) { __args[2](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"updateOne"}, function(err, result) { __args[2](err, result &&result.body); });
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
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"arg0":__args[0], "arg1":__args[1]}, {"action":"deleteOne"}, function(err, result) { __args[2](err, result &&result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = GroupTrainMethodService;
    } else {
      exports.GroupTrainMethodService = GroupTrainMethodService;
    }
  } else {
    return GroupTrainMethodService;
  }
});