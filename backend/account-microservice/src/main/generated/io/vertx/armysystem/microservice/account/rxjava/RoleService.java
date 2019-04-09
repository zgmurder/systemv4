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
import io.vertx.armysystem.microservice.account.Role;
import java.util.List;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;

/**
 * A service interface managing user roles.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * <p/>
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.RoleService original} non RX-ified interface using Vert.x codegen.
 */

@io.vertx.lang.rxjava.RxGen(io.vertx.armysystem.microservice.account.RoleService.class)
public class RoleService {

  public static final io.vertx.lang.rxjava.TypeArg<RoleService> __TYPE_ARG = new io.vertx.lang.rxjava.TypeArg<>(
    obj -> new RoleService((io.vertx.armysystem.microservice.account.RoleService) obj),
    RoleService::getDelegate
  );

  private final io.vertx.armysystem.microservice.account.RoleService delegate;
  
  public RoleService(io.vertx.armysystem.microservice.account.RoleService delegate) {
    this.delegate = delegate;
  }

  public io.vertx.armysystem.microservice.account.RoleService getDelegate() {
    return delegate;
  }

  /**
   * Initialize the persistence.
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService initializePersistence(Handler<AsyncResult<Void>> resultHandler) { 
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
   * Add a role to the persistence.
   * @param role a role entity that we want to add
   * @param resultHandler the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService addRole(Role role, Handler<AsyncResult<Role>> resultHandler) { 
    delegate.addRole(role, resultHandler);
    return this;
  }

  /**
   * Add a role to the persistence.
   * @param role a role entity that we want to add
   * @return 
   */
  public Single<Role> rxAddRole(Role role) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      addRole(role, fut);
    }));
  }

  /**
   * Retrieve the user role with certain `id`.
   * @param id user role id
   * @param resultHandler the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService retrieveRole(String id, Handler<AsyncResult<Role>> resultHandler) { 
    delegate.retrieveRole(id, resultHandler);
    return this;
  }

  /**
   * Retrieve the user role with certain `id`.
   * @param id user role id
   * @return 
   */
  public Single<Role> rxRetrieveRole(String id) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveRole(id, fut);
    }));
  }

  /**
   * Retrieve the user role with certain `username`.
   * @param roleName unique role name
   * @param resultHandler the result handler will be called as soon as the role has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService retrieveByRoleName(String roleName, Handler<AsyncResult<Role>> resultHandler) { 
    delegate.retrieveByRoleName(roleName, resultHandler);
    return this;
  }

  /**
   * Retrieve the user role with certain `username`.
   * @param roleName unique role name
   * @return 
   */
  public Single<Role> rxRetrieveByRoleName(String roleName) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveByRoleName(roleName, fut);
    }));
  }

  /**
   * Retrieve all user roles.
   * @param resultHandler the result handler will be called as soon as the roles have been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService retrieveAllRoles(Handler<AsyncResult<List<Role>>> resultHandler) { 
    delegate.retrieveAllRoles(resultHandler);
    return this;
  }

  /**
   * Retrieve all user roles.
   * @return 
   */
  public Single<List<Role>> rxRetrieveAllRoles() { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveAllRoles(fut);
    }));
  }

  /**
   * Retrieve role count with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the role count has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService count(JsonObject condition, Handler<AsyncResult<Long>> resultHandler) { 
    delegate.count(condition, resultHandler);
    return this;
  }

  /**
   * Retrieve role count with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @return 
   */
  public Single<Long> rxCount(JsonObject condition) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      count(condition, fut);
    }));
  }

  /**
   * Retrieve the user roles by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the roles has been retrieved. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService retrieveRolesByCondition(JsonObject condition, Handler<AsyncResult<List<Role>>> resultHandler) { 
    delegate.retrieveRolesByCondition(condition, resultHandler);
    return this;
  }

  /**
   * Retrieve the user roles by page with query conditions.
   * @param condition query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @return 
   */
  public Single<List<Role>> rxRetrieveRolesByCondition(JsonObject condition) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      retrieveRolesByCondition(condition, fut);
    }));
  }

  /**
   * Update user role info.
   * @param role a user role entity that we want to update
   * @param resultHandler the result handler will be called as soon as the role has been added. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService updateRole(Role role, Handler<AsyncResult<Role>> resultHandler) { 
    delegate.updateRole(role, resultHandler);
    return this;
  }

  /**
   * Update user role info.
   * @param role a user role entity that we want to update
   * @return 
   */
  public Single<Role> rxUpdateRole(Role role) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      updateRole(role, fut);
    }));
  }

  /**
   * Delete a user role from the persistence
   * @param id user role id
   * @param resultHandler the result handler will be called as soon as the role has been removed. The async result indicates whether the operation was successful or not.
   * @return 
   */
  public RoleService deleteRole(String id, Handler<AsyncResult<Void>> resultHandler) { 
    delegate.deleteRole(id, resultHandler);
    return this;
  }

  /**
   * Delete a user role from the persistence
   * @param id user role id
   * @return 
   */
  public Single<Void> rxDeleteRole(String id) { 
    return Single.create(new io.vertx.rx.java.SingleOnSubscribeAdapter<>(fut -> {
      deleteRole(id, fut);
    }));
  }


  public static RoleService newInstance(io.vertx.armysystem.microservice.account.RoleService arg) {
    return arg != null ? new RoleService(arg) : null;
  }
}
