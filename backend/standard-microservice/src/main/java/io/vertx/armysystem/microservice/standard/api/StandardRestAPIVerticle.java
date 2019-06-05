package io.vertx.armysystem.microservice.standard.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.CRUDRestAPIVerticle;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.microservice.standard.StandardService;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.List;

public class StandardRestAPIVerticle extends CRUDRestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(StandardRestAPIVerticle.class);
  private static final String SERVICE_NAME = "standard-rest-api";
  private StandardService standardService;

  public StandardRestAPIVerticle(List<CRUDService> services, StandardService standardService) {
    super(services, SERVICE_NAME);

    this.standardService = standardService;
  }

  @Override
  public void routeApi(Router router) {
    router.post("/trainstandard/activate/:id")
        .handler(context -> requireAuth(context, "standard", Action.Update.toString(), this::apiActivateStandard));
  }

  private void apiActivateStandard(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");

    logger.info("apiActivateStandard: id=" + id + " body=" + context.getBodyAsJson());

    standardService.activateStandard(id, context.getBodyAsJson(), principal, resultHandlerNonEmpty(context));
  }
}
