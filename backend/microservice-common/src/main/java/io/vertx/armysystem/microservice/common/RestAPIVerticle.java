package io.vertx.armysystem.microservice.common;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.CookieHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.ClusteredSessionStore;
import io.vertx.ext.web.sstore.LocalSessionStore;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * An abstract base verticle that provides several helper methods for REST API.
 *
 * @author Derek Zheng
 */
public abstract class RestAPIVerticle extends BaseMicroserviceVerticle {
  private static final Logger logger = LoggerFactory.getLogger(RestAPIVerticle.class);
  protected JWTAuth authProvider;

  /**
   * Create http server for the REST service.
   *
   * @param router router instance
   * @param host   http host
   * @param port   http port
   * @return async result of the procedure
   */
  protected Future<Void> createHttpServer(Router router, String host, int port) {
    Future<HttpServer> httpServerFuture = Future.future();
    vertx.createHttpServer()
      .requestHandler(router::handle)
      .listen(port, host, httpServerFuture);
    return httpServerFuture.map(r -> null);
  }

  /**
   * Enable jwt token auth support.
   *
   */
  protected void enableJWTAuth() {
    authProvider = JWTAuth.create(vertx, new JWTAuthOptions(config()));
  }

  /**
   * Enable CORS support.
   *
   * @param router router instance
   */
  protected void enableCorsSupport(Router router) {
    Set<String> allowHeaders = new HashSet<>();
    allowHeaders.add("x-requested-with");
    allowHeaders.add("Access-Control-Allow-Origin");
    allowHeaders.add("origin");
    allowHeaders.add("Content-Type");
    allowHeaders.add("accept");
    allowHeaders.add("Authorization");
    Set<HttpMethod> allowMethods = new HashSet<>();
    allowMethods.add(HttpMethod.GET);
    allowMethods.add(HttpMethod.PUT);
    allowMethods.add(HttpMethod.OPTIONS);
    allowMethods.add(HttpMethod.POST);
    allowMethods.add(HttpMethod.DELETE);
    allowMethods.add(HttpMethod.PATCH);

    router.route().handler(CorsHandler.create("*")
      .allowedHeaders(allowHeaders)
      .allowedMethods(allowMethods));
  }

  /**
   * Enable local session storage in requests.
   *
   * @param router router instance
   */
  protected void enableLocalSession(Router router) {
    router.route().handler(CookieHandler.create());
    router.route().handler(SessionHandler.create(
      LocalSessionStore.create(vertx, "shopping.user.session")));
  }

  /**
   * Enable clustered session storage in requests.
   *
   * @param router router instance
   */
  protected void enableClusteredSession(Router router) {
    router.route().handler(CookieHandler.create());
    router.route().handler(SessionHandler.create(
      ClusteredSessionStore.create(vertx, "shopping.user.session")));
  }

  // Auth helper method
  /**
   * Validate if the user token is valid.
   *
   * @param context   route context
   * @param biHandler the handler to be processed after authorization
   */
  public void requireLogin(RoutingContext context, BiConsumer<RoutingContext, JsonObject> biHandler) {
    if (authProvider == null) {
      biHandler.accept(context, new JsonObject());
    } else {
      Optional<String> token = Optional.ofNullable(context.request().getHeader("Authorization"));
      if (token.isPresent()) {
        String jwt = token.get();
        if (jwt.toLowerCase().startsWith("bearer ")) jwt = jwt.substring("bearer ".length());
        // Auth
        logger.info("Received JWT=" + jwt);
        authProvider.authenticate(new JsonObject().put("jwt", jwt),
            ar ->{
              if (ar.succeeded() && ar.result() != null) {
                JsonObject principal = ar.result().principal();
                logger.info("Authenticated principal=" + principal);

                biHandler.accept(context, new JsonObject().put("principal", principal));
              } else {
                unauthorized(context, "Unauthorized: " + ar.cause());
              }
            });
      } else {
        unauthorized(context, "Unauthorized: Need to login first");
      }
    }
  }

  /**
   * Validate if the user token is valid and do authorization.
   *
   * @param context   route context
   * @param resource  the resource to be authorized
   * @param action    the action(Create, Read, Update, Delete) to be authorized
   * @param biHandler the handler to be processed after authorization
   */
  public void requireAuth(RoutingContext context, String resource, String action, BiConsumer<RoutingContext, JsonObject> biHandler) {
    if (authProvider == null) {
      biHandler.accept(context, new JsonObject());
    } else {
      Optional<String> token = Optional.ofNullable(context.request().getHeader("Authorization"));
      if (token.isPresent()) {
        String jwt = token.get();
        if (jwt.toLowerCase().startsWith("bearer ")) jwt = jwt.substring("bearer ".length());
        // Auth
        logger.info("Received JWT=" + jwt);
        authProvider.authenticate(new JsonObject().put("jwt", jwt),
            ar ->{
              if (ar.succeeded() && ar.result() != null) {
                JsonObject principal = ar.result().principal();
                logger.info("Authenticated principal=" + principal);

                if (this.isAuthorized(principal, resource, action) || this.isAuthorized(principal, "*", action)) {
                  biHandler.accept(context, principal);
                } else {
                  forbidden(context, "Forbidden to " + action + " on schema " + resource);
                }
              } else {
                unauthorized(context, "Unauthorized: " + ar.cause());
              }
            });
      } else {
        unauthorized(context, "Unauthorized: Need to login first");
      }
    }
  }

  public Boolean isAuthorized(JsonObject principal, String schema, String action) {
    Boolean authorized = false;

    String perm = schema + ":" + action;
    JsonArray permissions = principal.getJsonArray("permissions");
    if (permissions != null) {
      long count = permissions.stream()
          .filter(item -> perm.equalsIgnoreCase((String) item))
          .count();
      if (count > 0) {
        authorized = true;
      }
    }

    return authorized;
  }

  public JsonObject getFindCondition(RoutingContext context) {
    JsonObject condition = context.getBodyAsJson();
    if (condition == null) condition = new JsonObject();
    logger.info("get query condition " + condition);

    JsonObject where = condition.getJsonObject("where");
    JsonObject option = condition.getJsonObject("option");
    if (where == null) where = new JsonObject();
    if (option == null) option = new JsonObject();

    return new JsonObject()
        .put("where", where)
        .put("option", option);
  }

  // helper result handler within a request context

  /**
   * This method generates handler for async methods in REST APIs.
   */
  public <T> Handler<AsyncResult<T>> resultHandler(RoutingContext context, Handler<T> handler) {
    return res -> {
      if (res.succeeded()) {
        logger.info("get result: " + res.result());
        handler.handle(res.result());
      } else {
        internalError(context, res.cause());
        res.cause().printStackTrace();
      }
    };
  }

  /**
   * This method generates handler for async methods in REST APIs.
   * Use the result directly and invoke `toString` as the response. The content type is JSON.
   */
  public <T> Handler<AsyncResult<T>> resultHandler(RoutingContext context) {
    return ar -> {
      if (ar.succeeded()) {
        logger.info("get result: " + ar.result());

        T res = ar.result();
        context.response()
          .putHeader("content-type", "application/json")
          .end(res == null ? "{}" : res.toString());
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  /**
   * This method generates handler for async methods in REST APIs.
   * Use the result directly and use given {@code converter} to convert result to string
   * as the response. The content type is JSON.
   *
   * @param context   routing context instance
   * @param converter a converter that converts result to a string
   * @param <T>       result type
   * @return generated handler
   */
  public <T> Handler<AsyncResult<T>> resultHandler(RoutingContext context, Function<T, String> converter) {
    return ar -> {
      if (ar.succeeded()) {
        T res = ar.result();
        logger.info("get result: " + ar.result());

        if (res == null) {
          serviceUnavailable(context, "Invalid result");
        } else {
          context.response()
            .putHeader("content-type", "application/json")
            .end(converter.apply(res));
        }
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  /**
   * This method generates handler for async methods in REST APIs.
   * The result requires non-empty. If empty, return <em>404 Not Found</em> status.
   * The content type is JSON.
   *
   * @param context routing context instance
   * @param <T>     result type
   * @return generated handler
   */
  public <T> Handler<AsyncResult<T>> resultHandlerNonEmpty(RoutingContext context) {
    return ar -> {
      if (ar.succeeded()) {
        T res = ar.result();
        logger.info("get result: " + ar.result());

        if (res == null) {
          notFound(context);
        } else {
          context.response()
            .putHeader("content-type", "application/json")
            .end(res.toString());
        }
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  /**
   * This method generates handler for async methods in REST APIs.
   * The content type is originally raw text.
   *
   * @param context routing context instance
   * @param <T>     result type
   * @return generated handler
   */
  public <T> Handler<AsyncResult<T>> rawResultHandler(RoutingContext context) {
    return ar -> {
      if (ar.succeeded()) {
        T res = ar.result();
        logger.info("get result: " + ar.result());

        context.response()
          .end(res == null ? "" : res.toString());
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  public Handler<AsyncResult<Void>> resultVoidHandler(RoutingContext context, JsonObject result) {
    logger.info("get result: " + result);

    return resultVoidHandler(context, result, 200);
  }

  /**
   * This method generates handler for async methods in REST APIs.
   * The result is not needed. Only the state of the async result is required.
   *
   * @param context routing context instance
   * @param result  result content
   * @param status  status code
   * @return generated handler
   */
  public Handler<AsyncResult<Void>> resultVoidHandler(RoutingContext context, JsonObject result, int status) {
    return ar -> {
      if (ar.succeeded()) {
        logger.info("get result: " + result + " with status " + status);

        context.response()
          .setStatusCode(status == 0 ? 200 : status)
          .putHeader("content-type", "application/json")
          .end(result.encodePrettily());
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  public Handler<AsyncResult<Void>> resultVoidHandler(RoutingContext context, int status) {
    return ar -> {
      if (ar.succeeded()) {
        logger.info("get status: " + status);

        context.response()
          .setStatusCode(status == 0 ? 200 : status)
          .putHeader("content-type", "application/json")
          .end();
      } else {
        internalError(context, ar.cause());
        ar.cause().printStackTrace();
      }
    };
  }

  /**
   * This method generates handler for async methods in REST DELETE APIs.
   * Return format in JSON (successful status = 204):
   * <code>
   * {"message": "delete_success"}
   * </code>
   *
   * @param context routing context instance
   * @return generated handler
   */
  public Handler<AsyncResult<Void>> deleteResultHandler(RoutingContext context) {
    return res -> {
      if (res.succeeded()) {
        logger.info("delete successfully");

        context.response().setStatusCode(204)
          .putHeader("content-type", "application/json")
          .end(new JsonObject().put("message", "delete_success").encodePrettily());
      } else {
        internalError(context, res.cause());
        res.cause().printStackTrace();
      }
    };
  }

  // helper method dealing with failure

  public void badRequest(RoutingContext context, Throwable ex) {
    logger.error("badRequest: " + ex);

    context.response().setStatusCode(400)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", ex.getMessage()).encodePrettily());
  }

  public void notFound(RoutingContext context) {
    logger.error("notFound");

    context.response().setStatusCode(404)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", "not found").encodePrettily());
  }

  public void internalError(RoutingContext context, Throwable ex) {
    logger.error("badRequest: " + ex);

    context.response().setStatusCode(500)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", ex.getMessage()).encodePrettily());
  }

  public void notImplemented(RoutingContext context) {
    logger.error("notImplemented");

    context.response().setStatusCode(501)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", "not implemented").encodePrettily());
  }

  public void badGateway(Throwable ex, RoutingContext context) {
    logger.error("badGateway: " + ex);

    ex.printStackTrace();
    context.response()
      .setStatusCode(502)
      .putHeader("content-type", "application/json")
      .end(new JsonObject()
//          .put("message", "bad gateway")
          .put("message", ex.getMessage())
          .encodePrettily());
  }

  public void serviceUnavailable(RoutingContext context) {
    logger.error("serviceUnavailable");

    context.fail(503);
  }

  public void serviceUnavailable(RoutingContext context, Throwable ex) {
    logger.error("serviceUnavailable: " + ex);

    context.response().setStatusCode(503)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", ex.getMessage()).encodePrettily());
  }

  public void serviceUnavailable(RoutingContext context, String cause) {
    logger.error("serviceUnavailable: " + cause);

    context.response().setStatusCode(503)
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("message", cause).encodePrettily());
  }

  public void unauthorized(RoutingContext context, String cause) {
    logger.error("unauthorized: " + cause);

    context.response().setStatusCode(401)
        .putHeader("content-type", "application/json")
        .end(new JsonObject().put("message", cause).encodePrettily());
  }

  public void forbidden(RoutingContext context, String cause) {
    logger.error("forbidden: " + cause);

    context.response().setStatusCode(403)
        .putHeader("content-type", "application/json")
        .end(new JsonObject().put("message", cause).encodePrettily());
  }
}
