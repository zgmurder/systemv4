package io.vertx.armysystem.business.common;

import io.vertx.codegen.annotations.Fluent;
import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * A service interface manage entities.
 * <p>
 * This service is an event bus service (aka. service proxy).
 * </p>
 *
 * @author Derek Zheng
 */
@VertxGen
@ProxyGen
public interface CRUDService {

  /**
   * Initialize the persistence.
   *
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler);

  /**
   * Add an item to the persistence.
   *
   * @param item          an entity that we want to add
   * @param resultHandler the result handler will be called as soon as the item has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Retrieve the item with certain `id`.
   *
   * @param id            item id
   * @param resultHandler the result handler will be called as soon as the item has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Retrieve all items.
   *
   * @param resultHandler the result handler will be called as soon as the items have been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler);

  /**
   * Retrieve item count with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the device count has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler);

  /**
   * Retrieve items by page with query conditions.
   *
   * @param condition         query conditions, include where and findOptions. Refer to https://vertx.io/docs/vertx-mongo-client/java/#_finding_documents
   * @param resultHandler the result handler will be called as soon as the devices has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler);

  /**
   * Update an item info.
   *
   * @param id            the item id
   * @param item          an entity that we want to update
   * @param resultHandler the result handler will be called as soon as the item has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Delete an item from the persistence
   *
   * @param id            the item id
   * @param resultHandler the result handler will be called as soon as the item has been removed. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  CRUDService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler);
}
