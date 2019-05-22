package io.vertx.armysystem.microservice.account.impl;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.core.*;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.armysystem.business.common.ModelUtil;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.account.User;
import io.vertx.armysystem.microservice.account.UserService;
import io.vertx.armysystem.microservice.account.common.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.jwt.JWTOptions;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link UserService}. Use MongoDB as the persistence.
 */
public class UserServiceImpl extends MongoRepositoryWrapper implements UserService, ServiceBase {
  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  private static final String FILTER_COLUMN_NAME = "organization.parentIds";
  private JWTAuth authProvider;
  private final CRUDService roleService;
  private final Vertx vertx;

  public UserServiceImpl(Vertx vertx, JsonObject config, CRUDService roleService) {
    super(vertx, config);

    this.vertx = vertx;
    this.roleService = roleService;
    authProvider = JWTAuth.create(vertx, new JWTAuthOptions(config));
  }

  @Override
  public String getServiceName() {
    return "account-user-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.account.user";
  }

  @Override
  public String getPermission() {
    return "User";
  }

  @Override
  public String getCollectionName() {
    return "User";
  }

  @Override
  public UserService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    logger.info("init user collection...");

    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("username", 1), new JsonObject().put("unique", true)))
        .otherwise(err -> null)
        .compose(o -> initUserData())
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  // Read init user data from user.json config file
  private Future<Void> initUserData() {
    Future<Void> future = Future.future();

    vertx.fileSystem().readFile("user.json",
        ar -> {
          if (ar.succeeded()) {
            JsonObject userData = new JsonObject(ar.result().toString());
            logger.info("Read user data: " + userData);

            JsonArray users = userData.getJsonArray("users");
            if (users != null) {
              CompositeFuture.join(users.stream()
                  .filter(item -> item instanceof JsonObject)
                  .map(json -> this.insertOne(getCollectionName(), (JsonObject)json))
                  .collect(Collectors.toList()))
                  .setHandler(ar2 -> future.complete());
            } else {
              future.complete();
            }

          } else {
            logger.error("Init user data failed: " + ar.cause());
            future.fail(ar.cause());
          }
        });

    return future;
  }

  @Override
  public UserService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    User user = new User(item);
    logger.info("add user " + user.getUsername());

    user.setBuildIn(false);
    JsonObject query = new JsonObject().put("username", user.getUsername());

    ModelUtil.fillOrganization(this, item)
        .compose(u -> ModelUtil.validateOrganization(principal, u))
        .compose(r -> validatePermissions(principal, user.getRoleName()))
        .compose(r -> this.findOne(getCollectionName(), query, new JsonObject()))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              String failureMessage = "User already exists : " + user.getUsername();
              resultHandler.handle(Future.failedFuture(failureMessage));
            } else {
              fillRoleLevel(user, principal)
                  .compose(u -> this.insertOne(getCollectionName(), u.toJson()))
                  .compose(u -> ModelUtil.fillOrganization(this, u))
                  .map(json -> json.putNull("password"))
                  .setHandler(resultHandler);
            }
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public UserService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.orElse(null))
        .compose(u -> ModelUtil.fillOrganization(this, u))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.retrieveManyByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public UserService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    this.count(getCollectionName(), qCondition.getQuery())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("organization.orgCode", 1).put("roleLevel", 1));
    }

    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    logger.info("query condition: " + qCondition);
    JsonArray pipeline = new JsonArray()
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Organization")
            .put("localField", "organizationId")
            .put("foreignField", "_id")
            .put("as", "organization")))
        .add(new JsonObject().put("$match", qCondition.getQuery()));
    if (qCondition.getOption().containsKey("sort")) {
      pipeline.add(new JsonObject().put("$sort", qCondition.getOption().getJsonObject("sort")));
    }
    if (qCondition.getOption().containsKey("skip")) {
      pipeline.add(new JsonObject().put("$skip", qCondition.getOption().getInteger("skip")));
    }
    if (qCondition.getOption().containsKey("limit")) {
      pipeline.add(new JsonObject().put("$limit", qCondition.getOption().getInteger("limit")));
    }
    if (qCondition.getOption().containsKey("fields")) {
      JsonObject project = new JsonObject();
      qCondition.getOption().getJsonArray("fields").getList()
          .forEach(field -> project.put(field.toString(), 1));
      pipeline.add(new JsonObject().put("$project", project));
    }

    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    this.aggregateWithOptions(getCollectionName(), pipeline, new JsonObject())
        .handler(object -> results.add(object))
        .endHandler(v -> {
          logger.info("retrieve users: " + results);
          future.complete(results);
        })
        .exceptionHandler(ex -> {
          logger.error("retrieve users failed: " + ex);
          future.fail(ex);
        });
    future.map(list -> list.stream()
          .map(item -> {
            if (item.containsKey("organization") && item.getJsonArray("organization").size() > 0) {
              item.put("organization", item.getJsonArray("organization").getJsonObject(0));
            } else {
              item.remove("organization");
            }
            return item;
          }).collect(Collectors.toList())
    ).setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");
    item.remove("buildIn");
    item.remove("password");
    item.remove("organization");

    User user = new User(item);
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              List<Future<Void>> futures = new ArrayList<>();
              futures.add(validatePermissions(principal, ar.result().getRoleName()));
              if (user.getRoleName() != null && !user.getRoleName().equals(ar.result().getRoleName())) {
                System.out.println("modify role from " + ar.result().getRoleName() + " to " + user.getRoleName());
                futures.add(validatePermissions(principal, user.getRoleName()));
              }

              io.vertx.armysystem.microservice.common.functional.Functional.allOfFutures(futures)
                  .compose(r -> fillRoleLevel(user, principal))
                  .compose(r -> this.update(getCollectionName(), new JsonObject().put("_id", id), user.toJson()))
                  .setHandler(ar2 -> {
                    if (ar2.succeeded()) {
                      this.retrieveOne(user.getId(), principal, resultHandler);
                    } else {
                      resultHandler.handle(Future.failedFuture(ar2.cause()));
                    }
                  });
            } else {
              resultHandler.handle(Future.failedFuture("The user does not exist"));
            }
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public UserService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query = getCondition(id, principal).getQuery();
    this.findOne(getCollectionName(), query, new JsonObject())
        .map(option -> option.map(User::new).orElse(null))
        .compose(result -> {
          Future<User> future = Future.future();
          if (result == null) {
            future.fail("The user does not exist");
          } else if (result.isBuildIn()) {
            future.fail("The build-in user can't be deleted");
          } else {
            future.complete(result);
          }
          return future;
        })
        .compose(r -> validatePermissions(principal, r.getRoleName()))
        .compose(r -> this.remove(getCollectionName(), query))
        .setHandler(resultHandler);

    return this;
  }

  private Future<JsonObject> fillPermissionsInUser(User user) {
    if (user == null) {
      return Future.succeededFuture();
    }

    JsonObject userObj = user.toJson();

    return Functional.getPermissitions(user.getRoleName(), roleService)
        .map(permissions -> userObj.put("permissions", new JsonArray(permissions)));
  }

  private Future<User> fillRoleLevel(User user, JsonObject principal) {
    if (user.getRoleName() == null) {
      return Future.succeededFuture(user);
    }

    Future<JsonObject> future = Future.future();
    roleService.retrieveOne(user.getRoleName(), principal, future);

    return future.map(r -> {
      if (r != null && r.containsKey("level"))
        return user.setRoleLevel(r.getInteger("level"));
      else
        return user;
    });
  }

  @Override
  public UserService loginUser(String username, String password, Handler<AsyncResult<JsonObject>> resultHandler) {
    JsonObject query = new JsonObject()
        .put("username", username)
        .put("password", password);
    this.findOne(getCollectionName(), query, new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .compose(user -> this.fillPermissionsInUser(user))
        .compose(json -> ModelUtil.fillOrganization(this, json))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              JsonObject json = ar.result();
              if (json.containsKey("organization") &&
                  json.getJsonObject("organization").containsKey("deactivated") &&
                  json.getJsonObject("organization").getBoolean("deactivated")) {
                resultHandler.handle(Future.failedFuture("The user is deactivated."));
              } else {
                String token = generateAuthToken(json);
                resultHandler.handle(Future.succeededFuture(new JsonObject()
                    .put("user", json)
                    .put("token", token)));
              }
            } else {
              resultHandler.handle(Future.failedFuture("The username or password is invalid."));
            }

          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }

        });

    return this;
  }

  @Override
  public UserService updatePassword(String username, String oldPassword, String newPassword, Handler<AsyncResult<JsonObject>> resultHandler) {
    JsonObject query = new JsonObject()
        .put("username", username)
        .put("password", oldPassword);
    this.findOne(getCollectionName(), query, new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              User user = ar.result();
              this.update(getCollectionName(), new JsonObject().put("_id", user.getId()), new JsonObject().put("password", newPassword))
                  .setHandler(ar2 -> {
                    if (ar2.succeeded())
                      resultHandler.handle(Future.succeededFuture(user.toJson()));
                    else
                      resultHandler.handle(Future.failedFuture(ar2.cause()));
                  });
            } else {
              resultHandler.handle(Future.failedFuture("The password is invalid."));
            }
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  private String generateAuthToken(JsonObject user) {
    JsonObject tokenJson = new JsonObject().
        put("iss", "CYARMY").
        put("exp", System.currentTimeMillis() / 1000L + 24*3600L).
        put("iat", System.currentTimeMillis() / 1000L).
        put("username", user.getString("username")).
        put("roleName", user.getString("roleName"));
    if (user.getString("organizationId") != null) {
      tokenJson.put("organizationId", user.getString("organizationId"));
      tokenJson.put("parentOrgIds", user.getJsonArray("parentOrgIds"));
    }

    JWTOptions options = new JWTOptions().
        setExpiresInSeconds(24*3600).
        setAlgorithm("HS256");
    JsonArray permissions = user.getJsonArray("permissions");
    if (permissions != null) {
      options.setPermissions(permissions.getList());
    }

    return authProvider.generateToken(tokenJson, options);
  }


  private Future<Void> validatePermissions(JsonObject principal, String roleName) {
    Future<Void> future = Future.future();

    String currRole = principal.getString("roleName");
    List<String> currPermissions = principal.getJsonArray("permissions", new JsonArray()).getList();

    if (currRole == roleName) {
      future.complete();
    } else {
      Functional.getPermissitions(roleName, roleService)
          .map(permissions -> validatePermissions(currPermissions, permissions))
          .setHandler(ar -> {
            if (ar.succeeded()) {
              if (ar.result())
                future.complete();
              else
                future.fail("Unauthorized");
            } else {
              future.fail(ar.cause());
            }
          });
    }

    return future;
  }

  // 检查permissions中所有的权限是否都包含在currPermissions中
  private Boolean validatePermissions(List<String> currPermissions, List<String> permissions) {
    if (currPermissions == null || permissions == null) return false;

    return permissions.stream()
        .map(perm -> {
          if (currPermissions.contains(perm)) {
            return true;
          } else if (perm.startsWith("*") || perm.indexOf(':') < 0) {
            return false;
          } else {
            String newPerm = "*" + perm.substring(perm.indexOf(':'));
            return currPermissions.contains(newPerm);
          }
        }).filter(r -> !r).count() == 0;
  }

  private QueryCondition getCondition(String id, JsonObject principal) {
    JsonObject query = new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("username", id)));

    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    return condition;
  }
}
