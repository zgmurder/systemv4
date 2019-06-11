package io.vertx.armysystem.business.common;

import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

import java.util.List;
import java.util.Optional;

public abstract class CRUDRestAPIVerticle extends RestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(CRUDRestAPIVerticle.class);
  private static final String PREFIX = "/";

  private List<CRUDService> services;
  private String serviceName;

  public CRUDRestAPIVerticle(List<CRUDService> services, String serviceName) {
    super();

    this.services = services;
    this.serviceName = serviceName;
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);
    routeCRUDApi(router);

    routeApi(router);

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8083);

    logger.info("Start " + serviceName + " on port " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(serviceName, host, port))
        .setHandler(future);
  }

  /**
   * Add new api router to this verticle
   * @param router  the router object.
   */
  public void routeApi(Router router) {

  }

  private void routeCRUDApi(Router router) {
    services.forEach(service -> {
      ServiceBase serviceBase = (ServiceBase)service;
      router.post(PREFIX+serviceBase.getCollectionName().toLowerCase())
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Create.toString(), this::apiAddItem));
      router.get(PREFIX+serviceBase.getCollectionName().toLowerCase()+"/:id")
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Read.toString(), this::apiFetchItem));
      router.post(PREFIX+serviceBase.getCollectionName().toLowerCase()+"s")
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Read.toString(), this::apiQueryItems));
      router.post(PREFIX+serviceBase.getCollectionName().toLowerCase()+"s/count")
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Read.toString(), this::apiCountItems));
      router.patch(PREFIX+serviceBase.getCollectionName().toLowerCase()+"/:id")
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Update.toString(), this::apiUpdateItem));
      router.delete(PREFIX+serviceBase.getCollectionName().toLowerCase()+"/:id")
          .handler(context -> requireAuth(context, serviceBase.getPermission(), Action.Delete.toString(), this::apiDeleteItem));
    });
  }

  private void apiAddItem(RoutingContext context, JsonObject principal) {
    JsonObject object = context.getBodyAsJson();

    logger.info("apiAddItem " + object);

    if (object == null) {
      badRequest(context, new IllegalArgumentException("Invalid parameters"));
    } else {
      getService(context).addOne(object, principal, resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("path=" + context.request().path() + " route to table " + ((ServiceBase)getService(context)).getCollectionName());
    logger.info("apiFetchItem " + id);

    getService(context).retrieveOne(id, principal, resultHandlerNonEmpty(context));
  }

  private void apiQueryItems(RoutingContext context, JsonObject principal) {
    logger.info("path=" + context.request().path() + " route to table " + ((ServiceBase)getService(context)).getCollectionName());
    logger.info("apiQueryItems " + context.getBodyAsJson());

    Future<List<JsonObject>> future = Future.future();

    getService(context).retrieveManyByCondition(context.getBodyAsJson(), principal, future);

    future.setHandler(resultHandler(context, Json::encodePrettily));
  }

  private void apiCountItems(RoutingContext context, JsonObject principal) {
    logger.info("path=" + context.request().path() + " route to table " + ((ServiceBase)getService(context)).getCollectionName());
    logger.info("apiCountItems " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    getService(context).count(context.getBodyAsJson(), principal, future);

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(resultHandlerNonEmpty(context));
  }

  private void apiUpdateItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("path=" + context.request().path() + " route to table " + ((ServiceBase)getService(context)).getCollectionName());
    logger.info("apiUpdateItem: id=" + id + " body=" + context.getBodyAsJson());

    getService(context).updateOne(id, context.getBodyAsJson(), principal, resultHandlerNonEmpty(context));
  }

  private void apiDeleteItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("path=" + context.request().path() + " route to table " + ((ServiceBase)getService(context)).getCollectionName());
    logger.info("apiDeleteItem " + id);

    getService(context).deleteOne(id, principal, deleteResultHandler(context));
  }

  private CRUDService getService(RoutingContext context) {
    String path = context.request().path();
    String collectionName = path.substring(1).split("/")[0];
    Optional<CRUDService> service = services.stream()
        .filter(item -> ((ServiceBase)item).getCollectionName().equalsIgnoreCase(collectionName) ||
            ((ServiceBase)item).getCollectionName().equalsIgnoreCase(collectionName+"s"))
        .findFirst();

    return service.orElse(null);
  }
}
