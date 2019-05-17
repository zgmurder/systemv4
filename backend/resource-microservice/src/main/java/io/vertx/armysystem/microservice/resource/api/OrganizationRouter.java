package io.vertx.armysystem.microservice.resource.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.common.RouterBase;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.core.Context;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.List;

public class OrganizationRouter extends RouterBase {
  private static final Logger logger = LoggerFactory.getLogger(OrganizationRouter.class);
  private OrganizationService organizationService;

  public OrganizationRouter(RestAPIVerticle verticle, Context context, OrganizationService organizationService) {
    super(verticle, context);

    this.organizationService = organizationService;
  }

  @Override
  public void route(Router router) {
    super.route(router);

    ServiceBase base = (ServiceBase)organizationService;
    router.post(PREFIX+base.getCollectionName().toLowerCase())
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Create.toString(), this::apiAddItem));
    router.get(PREFIX+base.getCollectionName().toLowerCase()+"/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Read.toString(), this::apiFetchItem));
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"s")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Read.toString(), this::apiQueryItems));
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"s/count")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Read.toString(), this::apiCountItems));
    router.patch(PREFIX+base.getCollectionName().toLowerCase()+"/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Update.toString(), this::apiUpdateItem));
    router.delete(PREFIX+base.getCollectionName().toLowerCase()+"/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Delete.toString(), this::apiDeleteItem));
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"/swap/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Delete.toString(), this::apiSwap));
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"/deactivate/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Delete.toString(), this::apiDeactivate));
  }

  private void apiAddItem(RoutingContext context, JsonObject principal) {
    JsonObject object = context.getBodyAsJson();

    logger.info("apiAddItem " + object);

    if (object == null || !object.containsKey("name") || !object.containsKey("nodeCode") || object.getInteger("nodeCode") == 0) {
      verticle.badRequest(context, new IllegalArgumentException("Invalid parameters"));
    } else {
      organizationService.addOne(object, principal, verticle.resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiFetchItem " + id);

    organizationService.retrieveOne(id, principal, verticle.resultHandlerNonEmpty(context));
  }

  private void apiQueryItems(RoutingContext context, JsonObject principal) {
    logger.info("apiQueryItems " + context.getBodyAsJson());

    Future<List<JsonObject>> future = Future.future();

    organizationService.retrieveManyByCondition(context.getBodyAsJson(), principal, future.completer());

    future.setHandler(verticle.resultHandler(context, Json::encodePrettily));
  }

  private void apiCountItems(RoutingContext context, JsonObject principal) {
    logger.info("apiCountItems " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    organizationService.count(context.getBodyAsJson(), principal, future.completer());

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(verticle.resultHandlerNonEmpty(context));
  }

  private void apiUpdateItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiUpdateItem: id=" + id + " body=" + context.getBodyAsJson());

    organizationService.updateOne(id, context.getBodyAsJson(), principal, verticle.resultHandlerNonEmpty(context));
  }

  private void apiDeleteItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiDeleteItem " + id);

    organizationService.deleteOne(id, principal, verticle.deleteResultHandler(context));
  }

  private void apiSwap(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    JsonObject object = context.getBodyAsJson();

    logger.info("apiSwap " + id + " " + object);

    if (object == null || !object.containsKey("id")) {
      verticle.badRequest(context, new IllegalArgumentException("Invalid parameters"));
    } else {
      organizationService.swapPosition(id, object.getString("id"), principal, verticle.resultHandler(context));
    }
  }

  private void apiDeactivate(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    JsonObject object = context.getBodyAsJson();

    logger.info("apiDeactivate " + id + " " + object);

    if (object == null || !object.containsKey("deactivated")) {
      verticle.badRequest(context, new IllegalArgumentException("Invalid parameters"));
    } else {
      organizationService.deactivate(id, object.getBoolean("deactivated"), principal, verticle.resultHandler(context));
    }
  }
}
