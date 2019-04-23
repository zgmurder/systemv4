package io.vertx.armysystem.microservice.dictionary.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

import javax.swing.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class DictionaryRestAPIVerticle extends RestAPIVerticle {
  private static final String SERVICE_NAME = "account-rest-api";
  private static final String PREFIX = "/dictionary/";

  private List<CRUDService> services;

  public DictionaryRestAPIVerticle(List<CRUDService> services) {
    super();

    this.services = services;
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    System.out.println("Starting DictionaryRestAPIVerticle...");

    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);

    services.forEach(service -> {
      router.post(PREFIX+service.getCollectionName())
          .handler(context -> requireAuth(context, service.getPermission(), Action.Create.toString(), this::apiAddItem));
      router.get(PREFIX+service.getCollectionName()+"/:id")
          .handler(context -> requireAuth(context, service.getPermission(), Action.Read.toString(), this::apiFetchItem));
      router.post(PREFIX+service.getCollectionName()+"s")
          .handler(context -> requireAuth(context, service.getPermission(), Action.Read.toString(), this::apiQueryItems));
      router.post(PREFIX+service.getCollectionName()+"s/count")
          .handler(context -> requireAuth(context, service.getPermission(), Action.Read.toString(), this::apiCountItems));
      router.patch(PREFIX+service.getCollectionName()+"/:id")
          .handler(context -> requireAuth(context, service.getPermission(), Action.Update.toString(), this::apiUpdateItem));
      router.delete(PREFIX+service.getCollectionName()+"/:id")
          .handler(context -> requireAuth(context, service.getPermission(), Action.Delete.toString(), this::apiDeleteItem));
    });

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8082);

    System.out.println("port = " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(SERVICE_NAME, host, port))
        .setHandler(future.completer());
  }

  private void apiAddItem(RoutingContext context, JsonObject principal) {
    JsonObject object = context.getBodyAsJson();

    if (object == null || object.getString("name") == null || object.getInteger("order") == null) {
      badRequest(context, new IllegalArgumentException("The parameters are not valid"));
    } else {
      getService(context).addOne(object, principal, resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    getService(context).retrieveOne(id, principal, resultHandlerNonEmpty(context));
  }

  private void apiQueryItems(RoutingContext context, JsonObject principal) {
    System.out.println("apiQueryItems " + context.getBodyAsJson());

    Future<List<JsonObject>> future = Future.future();

    getService(context).retrieveManyByCondition(context.getBodyAsJson(), principal, future.completer());

    future.setHandler(resultHandler(context, Json::encodePrettily));
  }

  private void apiCountItems(RoutingContext context, JsonObject principal) {
    System.out.println("apiCountItems " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    getService(context).count(context.getBodyAsJson(), principal, future.completer());

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(resultHandlerNonEmpty(context));
  }

  private void apiUpdateItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    getService(context).updateOne(id, context.getBodyAsJson(), principal, resultHandlerNonEmpty(context));
  }

  private void apiDeleteItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    getService(context).deleteOne(id, principal, deleteResultHandler(context));
  }

  private CRUDService getService(RoutingContext context) {
    String path = context.request().path();
    Optional<CRUDService> service = services.stream()
        .filter(item -> path.toLowerCase().indexOf(item.getCollectionName().toLowerCase()) > 0)
        .findAny();

    return service.orElse(null);
  }
}
