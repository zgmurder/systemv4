package io.vertx.armysystem.microservice.account;


import io.vertx.codegen.annotations.Fluent;
import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * A service interface managing user roles.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * @author Derek Zheng
 */
@VertxGen
@ProxyGen
public interface RoleService {
  /**
   * The name of the event bus service.
   */
  String SERVICE_NAME = "account-role-eb-service";

  /**
   * The address on which the service is published.
   */
  String SERVICE_ADDRESS = "service.account.role";

  /**
   * The permission name which is checked.
   */
  String PERMISSION_NAME = "role";

  /**
   * Initialize the persistence.
   *
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService initializePersistence(Handler<AsyncResult<Void>> resultHandler);

  /**
   * Add a role to the persistence.
   *
   * @param role          a role entity that we want to add
   * @param resultHandler the result handler will be called as soon as the role has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService addRole(Role role, Handler<AsyncResult<Role>> resultHandler);

  /**
   * Retrieve the user role with certain `id`.
   *
   * @param id            user role id
   * @param resultHandler the result handler will be called as soon as the role has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService retrieveRole(String id, Handler<AsyncResult<Role>> resultHandler);

  /**
   * Retrieve the user role with certain `username`.
   *
   * @param roleName      unique role name
   * @param resultHandler the result handler will be called as soon as the role has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService retrieveByRoleName(String roleName, Handler<AsyncResult<Role>> resultHandler);

  /**
   * Retrieve all user roles.
   *
   * @param resultHandler the result handler will be called as soon as the roles have been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService retrieveAllRoles(Handler<AsyncResult<List<Role>>> resultHandler);

  /**
   * Retrieve role count with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the role count has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService count(JsonObject condition, Handler<AsyncResult<Long>> resultHandler);

  /**
   * Retrieve the user roles by page with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the roles has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService retrieveRolesByCondition(JsonObject condition, Handler<AsyncResult<List<Role>>> resultHandler);

  /**
   * Update user role info.
   *
   * @param role       a user role entity that we want to update
   * @param resultHandler the result handler will be called as soon as the role has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService updateRole(Role role, Handler<AsyncResult<Role>> resultHandler);

  /**
   * Delete a user role from the persistence
   *
   * @param id            user role id
   * @param resultHandler the result handler will be called as soon as the role has been removed. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  RoleService deleteRole(String id, Handler<AsyncResult<Void>> resultHandler);
}
