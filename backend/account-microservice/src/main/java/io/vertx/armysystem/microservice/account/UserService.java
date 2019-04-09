package io.vertx.armysystem.microservice.account;

import io.vertx.codegen.annotations.Fluent;
import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * A service interface managing user accounts.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * @author Derek Zheng
 */
@VertxGen
@ProxyGen
public interface UserService {
  /**
   * The name of the event bus service.
   */
  String SERVICE_NAME = "account-user-eb-service";

  /**
   * The address on which the service is published.
   */
  String SERVICE_ADDRESS = "service.account.user";

  /**
   * The permission name which is checked.
   */
  String PERMISSION_NAME = "user";

  /**
   * Initialize the persistence.
   *
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService initializePersistence(Handler<AsyncResult<Void>> resultHandler);

  /**
   * Add a account to the persistence.
   *
   * @param user       a account entity that we want to add
   * @param resultHandler the result handler will be called as soon as the account has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService addUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler);

  /**
   * Retrieve the user account with certain `id`.
   *
   * @param id            user account id
   * @param resultHandler the result handler will be called as soon as the user has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService retrieveUser(String id, JsonObject principal, Handler<AsyncResult<User>> resultHandler);

  /**
   * Retrieve the user account with certain `username`.
   *
   * @param username      username
   * @param resultHandler the result handler will be called as soon as the user has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService retrieveByUsername(String username, JsonObject principal, Handler<AsyncResult<User>> resultHandler);

  /**
   * Retrieve all user accounts.
   *
   * @param resultHandler the result handler will be called as soon as the users have been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService retrieveAllUsers(JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler);

  /**
   * Retrieve user count with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the user count has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler);

  /**
   * Retrieve the user accounts by page with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the users has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService retrieveUsersByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler);

  /**
   * Update user account info.
   *
   * @param user       a account entity that we want to update
   * @param resultHandler the result handler will be called as soon as the account has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService updateUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler);

  /**
   * Delete a user account from the persistence
   *
   * @param id            user account id
   * @param resultHandler the result handler will be called as soon as the user has been removed. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService deleteUser(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler);

  /**
   * Login user with username and password
   *
   * @param username      username
   * @param password      password
   * @param resultHandler the result handler will be called as soon as the user login. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService loginUser(String username, String password, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Login user with username and password
   *
   * @param username      username
   * @param oldPassword   the origin password need to be verified
   * @param newPassword   the new password to be set
   * @param resultHandler the result handler will be called as soon as the new password is set. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  UserService updatePassword(String username, String oldPassword, String newPassword, Handler<AsyncResult<User>> resultHandler);
}
