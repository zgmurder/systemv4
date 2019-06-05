package io.vertx.armysystem.microservice.standard;

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
public interface StandardService {
  /**
   * activate or deactivate the train standard.
   *
   * @param id            the item id
   * @param item          change object
   * @param resultHandler the result handler will be called as soon as activating completed. The async result indicates
   *                      whether the operation was successful or not.
   */
  @Fluent
  StandardService activateStandard(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler);
}
