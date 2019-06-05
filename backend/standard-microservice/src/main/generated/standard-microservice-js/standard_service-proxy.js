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

/// <reference path="./standard_service-proxy.d.ts" />

/** @module standard-microservice-js/standard_service */
!function (factory) {
  if (typeof require === 'function' && typeof module !== 'undefined') {
    factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD loader
    define('standard-microservice-js/standard_service-proxy', [], factory);
  } else {
    // plain old include
    StandardService = factory();
  }
}(function () {

  /**
   A service interface manage entities.
   <p>
   This service is an event bus service (aka. service proxy).
   </p>

   @class
  */
  var StandardService = function(eb, address) {
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
     activate or deactivate the train standard.

     @public
     @param id {string} the item id 
     @param item {Object} change object 
     @param principal {Object} 
     @param resultHandler {function} the result handler will be called as soon as activating completed. The async result indicates whether the operation was successful or not. 
     @return {StandardService}
     */
    this.activateStandard =  function(id, item, principal, resultHandler) {
      var __args = arguments;
      if (__args.length === 4 && typeof __args[0] === 'string' && (typeof __args[1] === 'object' && __args[1] != null) && (typeof __args[2] === 'object' && __args[2] != null) && typeof __args[3] === 'function') {
        if (closed) {
          throw new Error('Proxy is closed');
        }
        j_eb.send(j_address, {"id":__args[0], "item":__args[1], "principal":__args[2]}, {"action":"activateStandard"}, function(err, result) { __args[3](err, result && result.body); });
        return that;
      } else throw new TypeError('function invoked with invalid arguments');
    };

  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = StandardService;
    } else {
      exports.StandardService = StandardService;
    }
  } else {
    return StandardService;
  }
});