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

package io.vertx.armysystem.microservice.account.rxjava;

import java.util.Map;
import rx.Observable;
import rx.Single;
import java.util.List;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AsyncResult;
import io.vertx.armysystem.business.common.rxjava.CRUDService;
import io.vertx.core.Handler;

/**
 * A service interface managing user accounts.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * <p/>
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.UserService original} non RX-ified interface using Vert.x codegen.
 */

@io.vertx.lang.rxjava.RxGen(io.vertx.armysystem.microservice.account.UserService.class)
public class UserService extends CRUDService {

  public static final io.vertx.lang.rxjava.TypeArg<UserService> __TYPE_ARG = new io.vertx.lang.rxjava.TypeArg<>(
    obj -> new UserService((io.vertx.armysystem.microservice.account.UserService) obj),
    UserService::getDelegate
  );

  private final io.vertx.armysystem.microservice.account.UserService delegate;
  
  public UserService(io.vertx.armysystem.microservice.account.UserService delegate) {
    super(delegate);
    this.delegate = delegate;
  }

  public io.vertx.armysystem.microservice.account.UserService getDelegate() {
    return delegate;
  }

  /**
   * Initialize the persistence.
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService initializePersistence(Handler<AsyncResult<Void>> resultHandler) { 
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
  public UserService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
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
  public UserService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
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
  public UserService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) { 
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
  public UserService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) { 
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
  public UserService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) { 
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
  public UserService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) { 
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
  public UserService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) { 
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
   * Login user with username and password
   * @param username username
   * @param password password
   * @param resultHandler the result handler will be called as soon as the user login. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService loginUser(String username, String password, Handler<AsyncResult<JsonObject>> resultHandler) { 
    delegate.loginUser(username, password, resultHandler);
    return this;
  }

  /**
   * Login user with username and password
   * @param username username
   * @param password password
   * @return 
   */
  public Single<JsonObject> rxLoginUser(String username, String password) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      loginUser(username, password, fut);
    }));
  }

  /**
   * Login user with username and password
   * @param username username
   * @param oldPassword the origin password need to be verified
   * @param newPassword the new password to be set
   * @param resultHandler the result handler will be called as soon as the new password is set. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService updatePassword(String username, String oldPassword, String newPassword, Handler<AsyncResult<JsonObject>> resultHandler) { 
    delegate.updatePassword(username, oldPassword, newPassword, resultHandler);
    return this;
  }

  /**
   * Login user with username and password
   * @param username username
   * @param oldPassword the origin password need to be verified
   * @param newPassword the new password to be set
   * @return 
   */
  public Single<JsonObject> rxUpdatePassword(String username, String oldPassword, String newPassword) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      updatePassword(username, oldPassword, newPassword, fut);
    }));
  }


  public static UserService newInstance(io.vertx.armysystem.microservice.account.UserService arg) {
    return arg != null ? new UserService(arg) : null;
  }
}
