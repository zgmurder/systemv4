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
import io.vertx.armysystem.microservice.account.User;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AsyncResult;
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
public class UserService {

  public static final io.vertx.lang.rxjava.TypeArg<UserService> __TYPE_ARG = new io.vertx.lang.rxjava.TypeArg<>(
    obj -> new UserService((io.vertx.armysystem.microservice.account.UserService) obj),
    UserService::getDelegate
  );

  private final io.vertx.armysystem.microservice.account.UserService delegate;
  
  public UserService(io.vertx.armysystem.microservice.account.UserService delegate) {
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
   * Add a account to the persistence.
   * @param user a account entity that we want to add
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the account has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService addUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler) { 
    delegate.addUser(user, principal, resultHandler);
    return this;
  }

  /**
   * Add a account to the persistence.
   * @param user a account entity that we want to add
   * @param principal 
   * @return 
   */
  public Single<User> rxAddUser(User user, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      addUser(user, principal, fut);
    }));
  }

  /**
   * Retrieve the user account with certain `id`.
   * @param id user account id
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the user has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService retrieveUser(String id, JsonObject principal, Handler<AsyncResult<User>> resultHandler) { 
    delegate.retrieveUser(id, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve the user account with certain `id`.
   * @param id user account id
   * @param principal 
   * @return 
   */
  public Single<User> rxRetrieveUser(String id, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveUser(id, principal, fut);
    }));
  }

  /**
   * Retrieve the user account with certain `username`.
   * @param username username
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the user has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService retrieveByUsername(String username, JsonObject principal, Handler<AsyncResult<User>> resultHandler) { 
    delegate.retrieveByUsername(username, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve the user account with certain `username`.
   * @param username username
   * @param principal 
   * @return 
   */
  public Single<User> rxRetrieveByUsername(String username, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveByUsername(username, principal, fut);
    }));
  }

  /**
   * Retrieve all user accounts.
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the users have been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService retrieveAllUsers(JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler) { 
    delegate.retrieveAllUsers(principal, resultHandler);
    return this;
  }

  /**
   * Retrieve all user accounts.
   * @param principal 
   * @return 
   */
  public Single<List<User>> rxRetrieveAllUsers(JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveAllUsers(principal, fut);
    }));
  }

  /**
   * Retrieve user count with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the user count has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) { 
    delegate.count(condition, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve user count with query conditions.
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
   * Retrieve the user accounts by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the users has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService retrieveUsersByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler) { 
    delegate.retrieveUsersByCondition(condition, principal, resultHandler);
    return this;
  }

  /**
   * Retrieve the user accounts by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param principal 
   * @return 
   */
  public Single<List<User>> rxRetrieveUsersByCondition(JsonObject condition, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveUsersByCondition(condition, principal, fut);
    }));
  }

  /**
   * Update user account info.
   * @param user a account entity that we want to update
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the account has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService updateUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler) { 
    delegate.updateUser(user, principal, resultHandler);
    return this;
  }

  /**
   * Update user account info.
   * @param user a account entity that we want to update
   * @param principal 
   * @return 
   */
  public Single<User> rxUpdateUser(User user, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      updateUser(user, principal, fut);
    }));
  }

  /**
   * Delete a user account from the persistence
   * @param id user account id
   * @param principal 
   * @param resultHandler the result handler will be called as soon as the user has been removed. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public UserService deleteUser(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) { 
    delegate.deleteUser(id, principal, resultHandler);
    return this;
  }

  /**
   * Delete a user account from the persistence
   * @param id user account id
   * @param principal 
   * @return 
   */
  public Single<Void> rxDeleteUser(String id, JsonObject principal) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      deleteUser(id, principal, fut);
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
  public UserService updatePassword(String username, String oldPassword, String newPassword, Handler<AsyncResult<User>> resultHandler) { 
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
  public Single<User> rxUpdatePassword(String username, String oldPassword, String newPassword) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      updatePassword(username, oldPassword, newPassword, fut);
    }));
  }


  public static UserService newInstance(io.vertx.armysystem.microservice.account.UserService arg) {
    return arg != null ? new UserService(arg) : null;
  }
}
