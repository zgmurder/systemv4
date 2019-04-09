package io.vertx.armysystem.microservice.account.impl;

import io.vertx.core.*;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.account.Role;
import io.vertx.armysystem.microservice.account.RoleService;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;

import java.util.List;
import java.util.stream.Collectors;

public class RoleServiceImpl extends MongoRepositoryWrapper implements RoleService {
  private static final String COLLECTION = "roles";
  private final Vertx vertx;

  public RoleServiceImpl(Vertx vertx, JsonObject config) {

    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public RoleService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    System.out.println("init role collection...");

    this.createCollection(COLLECTION)
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(COLLECTION,
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
                  .map(json -> this.insertOne(COLLECTION, (JsonObject)json))
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
  public RoleService addRole(Role role, Handler<AsyncResult<Role>> resultHandler) {
    this.insertOne(COLLECTION, role.toJson())
        .map(Role::new)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public RoleService retrieveRole(String id, Handler<AsyncResult<Role>> resultHandler) {
    JsonObject query = new JsonObject().put("_id", id);
    this.findOne(COLLECTION, query, new JsonObject())
        .map(option -> option.map(Role::new).orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public RoleService retrieveByRoleName(String roleName, Handler<AsyncResult<Role>> resultHandler) {
    JsonObject query = new JsonObject().put("roleName", roleName);
    this.findOne(COLLECTION, query, new JsonObject())
        .map(option -> option.map(Role::new).orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public RoleService retrieveAllRoles(Handler<AsyncResult<List<Role>>> resultHandler) {
    this.retrieveRolesByCondition(new JsonObject(), resultHandler);

    return this;
  }

  @Override
  public RoleService count(JsonObject condition, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    this.count(COLLECTION, qCondition.getQuery()).setHandler(resultHandler);

    return this;
  }

  @Override
  public RoleService retrieveRolesByCondition(JsonObject condition, Handler<AsyncResult<List<Role>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    this.findWithOptions(COLLECTION, qCondition.getQuery(), qCondition.getOption())
        .map(list -> list.stream()
            .map(Role::new)
            .collect(Collectors.toList()))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public RoleService updateRole(Role role, Handler<AsyncResult<Role>> resultHandler) {
    JsonObject updateObj = role.toJson();
    updateObj.remove("id");
    updateObj.remove("buildIn");

    this.update(COLLECTION, new JsonObject().put("_id", role.getId()), updateObj)
        .setHandler(ar -> {
          if (ar.succeeded()) {
            this.retrieveRole(role.getId(), resultHandler);
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public RoleService deleteRole(String id, Handler<AsyncResult<Void>> resultHandler) {
    this.removeById(COLLECTION, id).setHandler(resultHandler);

    return this;
  }
}
