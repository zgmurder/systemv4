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

package io.vertx.armysystem.microservice.dictionary.rxjava.service;

import java.util.Map;
import rx.Observable;
import rx.Single;
import java.util.List;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AsyncResult;
import io.vertx.armysystem.business.common.rxjava.CRUDService;
import io.vertx.core.Handler;

/**
 * A service interface manage entities.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * <p/>
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService original} non RX-ified interface using Vert.x codegen.
 */

@io.vertx.lang.rxjava.RxGen(io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService.class)
public class GroupTrainMethodService extends CRUDService {

  public static final io.vertx.lang.rxjava.TypeArg<GroupTrainMethodService> __TYPE_ARG = new io.vertx.lang.rxjava.TypeArg<>(
    obj -> new GroupTrainMethodService((io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService) obj),
    GroupTrainMethodService::getDelegate
  );

  private final io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService delegate;
  
  public GroupTrainMethodService(io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService delegate) {
    super(delegate);
    this.delegate = delegate;
  }

  public io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService getDelegate() {
    return delegate;
  }


  public static GroupTrainMethodService newInstance(io.vertx.armysystem.microservice.dictionary.service.GroupTrainMethodService arg) {
    return arg != null ? new GroupTrainMethodService(arg) : null;
  }
}
