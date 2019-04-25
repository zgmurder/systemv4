package io.vertx.armysystem.microservice.account.impl;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.core.*;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.account.Role;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;

import java.util.List;
import java.util.stream.Collectors;

public class RoleServiceImpl extends MongoRepositoryWrapper implements CRUDService, ServiceBase {
  private final Vertx vertx;

  public RoleServiceImpl(Vertx vertx, JsonObject config) {

    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "account-role-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.account.role";
  }

  @Override
  public String getPermission() {
    return "Role";
  }

  @Override
  public String getCollectionName() {
    return "Role";
  }

  @Override
  public CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    System.out.println("init role collection...");

    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("roleName", 1), new JsonObject().put("unique", true)))
        .otherwise(err -> null)
        .compose(o -> initRoleData())
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  // Read init role data from user.json config file
  private Future<Void> initRoleData() {
    Future<Void> future = Future.future();

    vertx.fileSystem().readFile("role.json",
        ar -> {
          if (ar.succeeded()) {
            JsonObject roleData = new JsonObject(ar.result().toString());
            System.out.println("Read role data: " + roleData);

            JsonArray roles = roleData.getJsonArray("roles");
            if (roles != null) {
              CompositeFuture.join(roles.stream()
                  .filter(item -> item instanceof JsonObject)
                  .map(json -> this.insertOne(getCollectionName(), (JsonObject)json))
                  .collect(Collectors.toList()))
                  .setHandler(ar2 -> future.complete());
            } else {
              future.complete();
            }

          } else {
            System.out.println("Init role data failed: " + ar.cause());
            future.fail(ar.cause());
          }
        });

    return future;
  }

  @Override
  public CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.insertOne(getCollectionName(), new Role(item).toJson())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getIdQuery(id), new JsonObject())
        .map(option -> option.orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.retrieveManyByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public CRUDService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    this.count(getCollectionName(), qCondition.getQuery()).setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("level", 1));
    }

    this.findWithOptions(getCollectionName(), qCondition.getQuery(), qCondition.getOption())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");
    item.remove("buildIn");

    this.update(getCollectionName(), getIdQuery(id), new Role(item).toJson())
        .setHandler(ar -> {
          if (ar.succeeded()) {
            this.retrieveOne(id, principal, resultHandler);
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public CRUDService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    this.remove(getCollectionName(), getIdQuery(id))
        .setHandler(resultHandler);

    return this;
  }

  private JsonObject getIdQuery(String id) {
    return new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("roleName", id)));
  }
}
