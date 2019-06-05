package io.vertx.armysystem.microservice.account.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.account.*;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This verticle exposes a HTTP endpoint to process user data via REST API.
 *
 * @author Derek Zheng
 */
public class AccountRestAPIVerticle extends RestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(AccountRestAPIVerticle.class);
  private static final String SERVICE_NAME = "account-rest-api";

  private final UserService userService;
  private final CRUDService roleService;

  private static final String API_USER_ADD = "/user";
  private static final String API_USER_FETCH = "/user/:id";
  private static final String API_USER_QUERY = "/users";
  private static final String API_USER_COUNT = "/users/count";
  private static final String API_USER_UPDATE = "/user/:id";
  private static final String API_USER_DELETE = "/user/:id";

  private static final String API_USER_LOGIN = "/user/login";
  private static final String API_USER_UPDATEPWD = "/user/updatepwd";

  private static final String API_ROLE_ADD = "/role";
  private static final String API_ROLE_FETCH = "/role/:id";
  private static final String API_ROLE_QUERY = "/roles";
  private static final String API_ROLE_COUNT = "/roles/count";
  private static final String API_ROLE_UPDATE = "/role/:id";
  private static final String API_ROLE_DELETE = "/role/:id";

  public AccountRestAPIVerticle(UserService userService, CRUDService roleService) {
    super();

    this.userService = userService;
    this.roleService = roleService;
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);

    // user api route handler
    router.post(API_USER_ADD).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Create.toString(), this::apiAddUser));
    router.get(API_USER_FETCH).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Read.toString(), this::apiFetchUser));
    router.post(API_USER_QUERY).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Read.toString(), this::apiQueryUsers));
    router.post(API_USER_COUNT).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Read.toString(), this::apiCountUsers));
    router.patch(API_USER_UPDATE).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Update.toString(), this::apiUpdateUser));
    router.delete(API_USER_DELETE).handler(context -> requireAuth(context, ((ServiceBase)userService).getPermission(), Action.Delete.toString(), this::apiDeleteUser));
    router.post(API_USER_LOGIN).handler(this::apiLogin);
    router.post(API_USER_UPDATEPWD).handler(context -> requireLogin(context, this::apiUpdatePwd));

    // role api route handler
    router.post(API_ROLE_ADD).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Create.toString(), this::apiAddRole));
    router.get(API_ROLE_FETCH).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Read.toString(), this::apiFetchRole));
    router.post(API_ROLE_QUERY).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Read.toString(), this::apiQueryRoles));
    router.post(API_ROLE_COUNT).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Read.toString(), this::apiCountRoles));
    router.patch(API_ROLE_UPDATE).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Update.toString(), this::apiUpdateRole));
    router.delete(API_ROLE_DELETE).handler(context -> requireAuth(context, ((ServiceBase)roleService).getPermission(), Action.Delete.toString(), this::apiDeleteRole));

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8081);

    logger.info("Start account api on port " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(SERVICE_NAME, host, port))
        .setHandler(future);
  }

  private void apiAddUser(RoutingContext context, JsonObject principal) {
    User user = new User(context.getBodyAsJson());

    if (user.getUsername() == null || user.getPassword() == null) {
      badRequest(context, new IllegalArgumentException("Username or password is not valid"));
    } else {
      userService.addOne(user.toJson(), principal, resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchUser(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    userService.retrieveOne(id, principal, resultHandlerNonEmpty(context));
  }

  private void apiQueryUsers(RoutingContext context, JsonObject principal) {
    System.out.println("apiQueryUsers " + context.getBodyAsJson());

    Future<List<JsonObject>> future = Future.future();

    userService.retrieveManyByCondition(context.getBodyAsJson(), principal, future.completer());

    future.setHandler(resultHandler(context, Json::encodePrettily));
  }

  private void apiCountUsers(RoutingContext context, JsonObject principal) {
    System.out.println("apiCountUsers " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    userService.count(context.getBodyAsJson(), principal, future.completer());

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(resultHandlerNonEmpty(context));
  }

  private void apiUpdateUser(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    User user = new User(context.getBodyAsJson());

    userService.updateOne(id, user.toJson(), principal, resultHandlerNonEmpty(context));
  }

  private void apiDeleteUser(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    userService.deleteOne(id, principal, deleteResultHandler(context));
  }

  private void apiLogin(RoutingContext context) {
    JsonObject user = context.getBodyAsJson();
    String username = user.getString("username");
    String password = user.getString("password");
    if (username == null || password == null) {
      badRequest(context, new IllegalArgumentException("Username or password is not valid"));
    } else {
      userService.loginUser(username, password, resultHandlerNonEmpty(context));
    }
  }

  private void apiUpdatePwd(RoutingContext context, JsonObject principal) {
    JsonObject json = context.getBodyAsJson();
    String username = json.getString("username");
    String oldPassword = json.getString("oldPassword");
    String newPassword = json.getString("newPassword");

    if (username == null || oldPassword == null || newPassword == null) {
      badRequest(context, new IllegalArgumentException("Username or password is not valid"));
    } else {
      // Only allowed to update user's own password
      if (username.equals(principal.getString("username"))) {
        userService.updatePassword(username, oldPassword, newPassword, resultHandlerNonEmpty(context));
      } else {
        unauthorized(context, "It isn't allowed to update other's password.");
      }
    }
  }

  private void apiAddRole(RoutingContext context, JsonObject principal) {
    Role role = new Role(context.getBodyAsJson());

    if (role.getRoleName() == null || role.getPermissions() == null) {
      badRequest(context, new IllegalArgumentException("The parameters are not valid"));
    } else {
      roleService.addOne(role.toJson(), principal, resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchRole(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    roleService.retrieveOne(id, principal, resultHandlerNonEmpty(context));
  }

  private void apiQueryRoles(RoutingContext context, JsonObject principal) {
    System.out.println("apiQueryRoles " + context.getBodyAsJson());

    Future<List<JsonObject>> future = Future.future();

    roleService.retrieveManyByCondition(context.getBodyAsJson(), principal, future.completer());

    future.setHandler(resultHandler(context, Json::encodePrettily));
  }

  private void apiCountRoles(RoutingContext context, JsonObject principal) {
    System.out.println("apiCountRoles " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    roleService.count(context.getBodyAsJson(), principal, future.completer());

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(resultHandlerNonEmpty(context));
  }

  private void apiUpdateRole(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    Role role = new Role(context.getBodyAsJson());

    roleService.updateOne(id, role.toJson(), principal, resultHandlerNonEmpty(context));
  }

  private void apiDeleteRole(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    roleService.deleteOne(id, principal, deleteResultHandler(context));
  }
}
