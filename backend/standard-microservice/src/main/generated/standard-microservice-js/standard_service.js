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

/** @module standard-microservice-js/standard_service */
var utils = require('vertx-js/util/utils');

var io = Packages.io;
var JsonObject = io.vertx.core.json.JsonObject;
var JStandardService = Java.type('io.vertx.armysystem.microservice.standard.StandardService');

/**
 A service interface manage entities.
 <p>
 This service is an event bus service (aka. service proxy).
 </p>

 @class
*/
var StandardService = function(j_val) {

  var j_standardService = j_val;
  var that = this;

  var __super_activateStandard = this.activateStandard;
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
      j_standardService["activateStandard(java.lang.String,io.vertx.core.json.JsonObject,io.vertx.core.json.JsonObject,io.vertx.core.Handler)"](id, utils.convParamJsonObject(item), utils.convParamJsonObject(principal), function(ar) {
        if (ar.succeeded()) {
          resultHandler(utils.convReturnJson(ar.result()), null);
        } else {
          resultHandler(null, ar.cause());
        }
      }) ;
      return that;
    } else if (typeof __super_activateStandard != 'undefined') {
      return __super_activateStandard.apply(this, __args);
    }
    else throw new TypeError('function invoked with invalid arguments');
  };

  // A reference to the underlying Java delegate
  // NOTE! This is an internal API and must not be used in user code.
  // If you rely on this property your code is likely to break if we change it / remove it without warning.
  this._jdel = j_standardService;
};

StandardService._jclass = utils.getJavaClass("io.vertx.armysystem.microservice.standard.StandardService");
StandardService._jtype = {accept: function(obj) {
    return StandardService._jclass.isInstance(obj._jdel);
  },wrap: function(jdel) {
    var obj = Object.create(StandardService.prototype, {});
    StandardService.apply(obj, arguments);
    return obj;
  },
  unwrap: function(obj) {
    return obj._jdel;
  }
};
StandardService._create = function(jdel) {var obj = Object.create(StandardService.prototype, {});
  StandardService.apply(obj, arguments);
  return obj;
}
module.exports = StandardService;