package io.vertx.armysystem.microservice.account.impl;

import io.vertx.core.*;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTOptions;
import io.vertx.armysystem.business.common.ModelUtil;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.account.RoleService;
import io.vertx.armysystem.microservice.account.User;
import io.vertx.armysystem.microservice.account.UserService;
import io.vertx.armysystem.microservice.account.common.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link UserService}. Use MongoDB as the persistence.
 */
public class UserServiceImpl extends MongoRepositoryWrapper implements UserService {
  private static final String COLLECTION = "users";
  private static final String FILTER_COLUMN_NAME = "parentOrgIds";
  private JWTAuth authProvider;
  private final RoleService roleService;
  private final Vertx vertx;

  public UserServiceImpl(Vertx vertx, JsonObject config, RoleService roleService) {
    super(vertx, config);

    this.vertx = vertx;
    this.roleService = roleService;
    authProvider = JWTAuth.create(vertx, config);
  }

  @Override
  public UserService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    System.out.println("init user collection...");

    this.createCollection(COLLECTION)
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(COLLECTION,
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
            System.out.println("Read user data: " + userData);

            JsonArray users = userData.getJsonArray("users");
            if (users != null) {
              CompositeFuture.join(users.stream()
                  .filter(item -> item instanceof JsonObject)
                  .map(json -> this.insertOne(COLLECTION, (JsonObject)json))
                  .collect(Collectors.toList()))
                  .setHandler(ar2 -> future.complete());
            } else {
              future.complete();
            }

          } else {
            System.out.println("Init user data failed: " + ar.cause());
            future.fail(ar.cause());
          }
        });

    return future;
  }

  @Override
  public UserService addUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler) {
    System.out.println("Entered addUser " + user.getUsername());
    user.setBuildIn(false);
    JsonObject query = new JsonObject().put("username", user.getUsername());

    ModelUtil.validateOrganization(principal, user.toJson())
        .compose(r -> validatePermissions(principal, user.getRoleName()))
        .compose(r -> this.findOne(COLLECTION, query, new JsonObject()))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              String failureMessage = "User already exists : " + user.getUsername();
              resultHandler.handle(Future.failedFuture(failureMessage));
            } else {
              this.insertOne(COLLECTION, user.toJson())
                  .map(json -> json.putNull("password"))
                  .map(User::new)
                  .setHandler(resultHandler);
            }
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public UserService retrieveUser(String id, JsonObject principal, Handler<AsyncResult<User>> resultHandler) {
    JsonObject query = new JsonObject().put("_id", id);
    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    this.findOne(COLLECTION, condition.getQuery(), new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService retrieveByUsername(String username, JsonObject principal, Handler<AsyncResult<User>> resultHandler) {
    JsonObject query = new JsonObject().put("username", username);
    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    this.findOne(COLLECTION, condition.getQuery(), new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService retrieveAllUsers(JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler) {

    this.retrieveUsersByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public UserService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    this.count(COLLECTION, qCondition.getQuery())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService retrieveUsersByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<User>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    this.findWithOptions(COLLECTION, qCondition.getQuery(), qCondition.getOption())
        .map(list -> list.stream()
            .map(json -> json.putNull("password"))
            .map(User::new)
            .collect(Collectors.toList()))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public UserService updateUser(User user, JsonObject principal, Handler<AsyncResult<User>> resultHandler) {
    JsonObject updateObj = user.toJson();
    updateObj.remove("id");
    updateObj.remove("buildIn");
    updateObj.remove("password");

    JsonObject query = new JsonObject().put("_id", user.getId());
    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    this.findOne(COLLECTION, condition.getQuery(), new JsonObject())
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
                  .compose(r -> this.update(COLLECTION, new JsonObject().put("_id", user.getId()), updateObj))
                  .setHandler(ar2 -> {
                    if (ar2.succeeded()) {
                      this.retrieveUser(user.getId(), principal, resultHandler);
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
  public UserService deleteUser(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query = new JsonObject().put("_id", id);
    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    this.findOne(COLLECTION, condition.getQuery(), new JsonObject())
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
        .compose(r -> this.removeById(COLLECTION, id))
        .setHandler(resultHandler);

    return this;
  }

  private Future<JsonObject> fillPermissionsInUser(User user) {
    JsonObject userObj = user.toJson();

    return Functional.getPermissitions(user.getRoleName(), roleService)
        .map(permissions -> userObj.put("permissions", new JsonArray(permissions)));
  }

  @Override
  public UserService loginUser(String username, String password, Handler<AsyncResult<JsonObject>> resultHandler) {
    JsonObject query = new JsonObject()
        .put("username", username)
        .put("password", password);
    this.findOne(COLLECTION, query, new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .compose(user -> this.fillPermissionsInUser(user))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              JsonObject json = ar.result();
              String token = generateAuthToken(json);
              resultHandler.handle(Future.succeededFuture(new JsonObject()
                  .put("user", json)
                  .put("token", token)));
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
  public UserService updatePassword(String username, String oldPassword, String newPassword, Handler<AsyncResult<User>> resultHandler) {
    JsonObject query = new JsonObject()
        .put("username", username)
        .put("password", oldPassword);
    this.findOne(COLLECTION, query, new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.map(User::new).orElse(null))
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              User user = ar.result();
              this.update(COLLECTION, new JsonObject().put("_id", user.getId()), new JsonObject().put("password", newPassword))
                  .setHandler(ar2 -> {
                    if (ar2.succeeded())
                      resultHandler.handle(Future.succeededFuture(user));
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
        setExpiresInSeconds(24*3600L).
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
}
