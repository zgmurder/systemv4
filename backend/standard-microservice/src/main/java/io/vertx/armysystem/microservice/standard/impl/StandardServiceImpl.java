package io.vertx.armysystem.microservice.standard.impl;

import io.vertx.armysystem.business.common.enums.StandardState;
import io.vertx.armysystem.business.common.standard.TrainStandard;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.standard.StandardService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.Date;

public class StandardServiceImpl extends MongoRepositoryWrapper implements StandardService {
  private static final Logger logger = LoggerFactory.getLogger(StandardServiceImpl.class);
  private final Vertx vertx;

  public StandardServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public StandardService activateStandard(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    if (!item.containsKey("activate")) {
      resultHandler.handle(Future.failedFuture("Invalid params"));
    } else {
      Boolean activate = item.getBoolean("activate");
      this.findOne("TrainStandard", getIdQuery(id), new JsonObject())
          .map(option -> option.map(TrainStandard::new))
          .compose(option -> {
            if (option.isPresent()) {
              if (activate && option.get().getState() == StandardState.Initial.getValue()) {
                return deactivateAll()
                    .compose(o -> activate(option.get().getId()));
              } else if (!activate && option.get().getState() == StandardState.Activated.getValue()) {
                return deactivate(option.get().getId());
              } else {
                return Future.succeededFuture(option.get().toJson());
              }
            } else {
              return Future.failedFuture("Not found");
            }
          })
          .setHandler(resultHandler);
    }

    return this;
  }

  private Future<JsonObject> activate(String id) {
    logger.info("activate standard: " + id);
    return this.update("TrainStandard",
        new JsonObject().put("_id", id),
        new JsonObject().put("state", StandardState.Activated.getValue())
            .put("startTime", new Date().getTime()))
        .compose(o -> this.findOne("TrainStandard",
            new JsonObject().put("_id", id), new JsonObject()))
        .map(o -> o.orElse(null));
  }

  private Future<JsonObject> deactivate(String id) {
    logger.info("deactivate standard: " + id);
    return this.update("TrainStandard",
        new JsonObject().put("_id", id),
        new JsonObject().put("state", StandardState.Stopped.getValue())
            .put("endTime", new Date().getTime()))
        .compose(o -> this.findOne("TrainStandard",
            new JsonObject().put("_id", id), new JsonObject()))
        .map(o -> o.orElse(null));
  }

  private Future<Void> deactivateAll() {
    return this.update("TrainStandard",
        new JsonObject().put("state", StandardState.Activated.getValue()),
        new JsonObject().put("state", StandardState.Stopped.getValue())
            .put("endTime", new Date().getTime())).otherwiseEmpty();
  }

  private JsonObject getIdQuery(String id) {
    return new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("name", id)));
  }
}
