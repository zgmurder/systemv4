package io.vertx.armysystem.microservice.resource.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.common.RouterBase;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.core.Context;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.List;

public class SoldierRouter extends RouterBase {
  private static final Logger logger = LoggerFactory.getLogger(OrganizationRouter.class);
  private SoldierService soldierService;

  public SoldierRouter(RestAPIVerticle verticle, Context context, SoldierService soldierService) {
    super(verticle, context);

    this.soldierService = soldierService;
  }

  @Override
  public void route(Router router) {
    super.route(router);

    ServiceBase base = (ServiceBase)soldierService;
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
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"/change/:id")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Update.toString(), this::apiChange));
    router.post(PREFIX+base.getCollectionName().toLowerCase()+"/:id/archives")
        .handler(context -> verticle.requireAuth(context, base.getPermission(), Action.Read.toString(), this::apiRetrieveArchives));
  }

  private void apiAddItem(RoutingContext context, JsonObject principal) {
    JsonObject object = context.getBodyAsJson();

    logger.info("apiAddItem " + object);

    if (object == null || !object.containsKey("name") || !object.containsKey("organizationId")) {
      verticle.badRequest(context, new IllegalArgumentException("Invalid parameters"));
    } else {
      soldierService.addOne(object, principal, verticle.resultHandlerNonEmpty(context));
    }
  }

  private void apiFetchItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiFetchItem " + id);

    soldierService.retrieveOne(id, principal, verticle.resultHandlerNonEmpty(context));
  }

  private void apiQueryItems(RoutingContext context, JsonObject principal) {
    logger.info("apiQueryItems " + context.getBodyAsJson());

    soldierService.retrieveManyByCondition(context.getBodyAsJson(), principal, verticle.resultHandler(context, Json::encodePrettily));
  }

  private void apiCountItems(RoutingContext context, JsonObject principal) {
    logger.info("apiCountItems " + context.getBodyAsJson());

    Future<Long> future = Future.future();

    soldierService.count(context.getBodyAsJson(), principal, future.completer());

    future.map(c -> new JsonObject().put("count", c))
        .setHandler(verticle.resultHandlerNonEmpty(context));
  }

  private void apiUpdateItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiUpdateItem: id=" + id + " body=" + context.getBodyAsJson());

    soldierService.updateOne(id, context.getBodyAsJson(), principal, verticle.resultHandlerNonEmpty(context));
  }

  private void apiDeleteItem(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiDeleteItem " + id);

    soldierService.deleteOne(id, principal, verticle.deleteResultHandler(context));
  }

  private void apiChange(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiChange: id=" + id + " body=" + context.getBodyAsJson());

    soldierService.change(id, context.getBodyAsJson(), principal, verticle.resultHandlerNonEmpty(context));
  }

  private void apiRetrieveArchives(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiRetrieveArchives cardId " + id);

    soldierService.retrieveArchives(id, principal, verticle.resultHandler(context, Json::encodePrettily));
  }
}
