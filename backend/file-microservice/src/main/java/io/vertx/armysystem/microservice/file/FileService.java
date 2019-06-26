package io.vertx.armysystem.microservice.file;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.codegen.annotations.Fluent;
import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

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
public interface FileService {
  /**
   * Initialize the persistence.
   *
   * @param resultHandler the result handler will be called as soon as the initialization has been accomplished. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  FileService initializePersistence(Handler<AsyncResult<Void>> resultHandler);

  /**
   * Add an item to the persistence.
   *
   * @param item          an entity that we want to add
   * @param resultHandler the result handler will be called as soon as the item has been added. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  FileService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Retrieve the item with certain `id`.
   *
   * @param id            item id
   * @param resultHandler the result handler will be called as soon as the item has been retrieved. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  FileService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);

  /**
   * Delete an item from the persistence
   *
   * @param id            the item id
   * @param resultHandler the result handler will be called as soon as the item has been removed. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  FileService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler);
}
