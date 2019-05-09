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

package io.vertx.armysystem.microservice.resource.rxjava;

import java.util.Map;
import rx.Observable;
import rx.Single;
import java.util.List;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;

/**
 * A service interface manage entities.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * <p/>
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.resource.OrganizationService original} non RX-ified interface using Vert.x codegen.
 */

@io.vertx.lang.rxjava.RxGen(io.vertx.armysystem.microservice.resource.OrganizationService.class)
public class OrganizationService {

  public static final io.vertx.lang.rxjava.TypeArg<OrganizationService> __TYPE_ARG = new io.vertx.lang.rxjava.TypeArg<>(
    obj -> new OrganizationService((io.vertx.armysystem.microservice.resource.OrganizationService) obj),
    OrganizationService::getDelegate
  );

  private final io.vertx.armysystem.microservice.resource.OrganizationService delegate;
  
  public OrganizationService(io.vertx.armysystem.microservice.resource.OrganizationService delegate) {
    this.delegate = delegate;
  }

  public io.vertx.armysystem.microservice.resource.OrganizationService getDelegate() {
    return delegate;
  }

  /**
   * Initialize the persistence.
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService initializePersistence(Handler<AsyncResult<Void>> resultHandler) { 
    delegate.initializePersistence(resultHandler);
    return this;
  }

  /**
   * Initialize the persistence.
   * @return 
   */
  public Single<Void> rxInitializePersistence() { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      initializePersistence(fut);
    }));
  }

  /**
   * Add an item to the persistence.
   * @param item an entity that we want to add
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
    delegate.addOne(item, principal, resultHandler);
    return this;
  }

  /**
   * Add an item to the persistence.
   * @param item an entity that we want to add
   * @param principal 
   * @return 
   */
  public Single<JsonObject> rxAddOne(JsonObject item, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      addOne(item, principal, fut);
    }));
  }

  /**
   * Retrieve the item with certain `id`.
   * @param id item id
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the item has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
    delegate.retrieveOne(id, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve the item with certain `id`.
   * @param id item id
   * @param principal 
   * @return 
   */
  public Single<JsonObject> rxRetrieveOne(String id, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveOne(id, principal, fut);
    }));
  }

  /**
   * Retrieve all items.
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the items have been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) { 
    delegate.retrieveAll(principal, resultHandler);
    return this;
  }

  /**
   * Retrieve all items.
   * @param principal 
   * @return 
   */
  public Single<List<JsonObject>> rxRetrieveAll(JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveAll(principal, fut);
    }));
  }

  /**
   * Retrieve item count with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the device count has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) { 
    delegate.count(condition, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve item count with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @return 
   */
  public Single<Long> rxCount(JsonObject condition, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      count(condition, principal, fut);
    }));
  }

  /**
   * Retrieve items by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the devices has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) { 
    delegate.retrieveManyByCondition(condition, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve items by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @return 
   */
  public Single<List<JsonObject>> rxRetrieveManyByCondition(JsonObject condition, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveManyByCondition(condition, principal, fut);
    }));
  }

  /**
   * Update an item info.
   * @param id the item id
   * @param item an entity that we want to update
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the item has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
    delegate.updateOne(id, item, principal, resultHandler);
    return this;
  }

  /**
   * Update an item info.
   * @param id the item id
   * @param item an entity that we want to update
   * @param principal 
   * @return 
   */
  public Single<JsonObject> rxUpdateOne(String id, JsonObject item, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      updateOne(id, item, principal, fut);
    }));
  }

  /**
   * Delete an item from the persistence
   * @param id the item id
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) { 
    delegate.deleteOne(id, principal, resultHandler);
    return this;
  }

  /**
   * Delete an item from the persistence
   * @param id the item id
   * @param principal 
   * @return 
   */
  public Single<Void> rxDeleteOne(String id, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      deleteOne(id, principal, fut);
    }));
  }

  /**
   * swap the position of two organizations
   * @param id the item id
   * @param otherId the other item id
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the item has been removed. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public OrganizationService swapPosition(String id, String otherId, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) { 
    delegate.swapPosition(id, otherId, principal, resultHandler);
    return this;
  }

  /**
   * swap the position of two organizations
   * @param id the item id
   * @param otherId the other item id
   * @param principal 
   * @return 
   */
  public Single<Void> rxSwapPosition(String id, String otherId, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      swapPosition(id, otherId, principal, fut);
    }));
  }


  public static OrganizationService newInstance(io.vertx.armysystem.microservice.resource.OrganizationService arg) {
    return arg != null ? new OrganizationService(arg) : null;
  }
}
