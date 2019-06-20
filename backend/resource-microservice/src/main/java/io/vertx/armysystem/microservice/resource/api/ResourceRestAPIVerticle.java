package io.vertx.armysystem.microservice.resource.api;

import io.vertx.armysystem.business.common.Action;
import io.vertx.armysystem.business.common.CRUDRestAPIVerticle;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.core.Future;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;

import java.util.List;


public class ResourceRestAPIVerticle extends CRUDRestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ResourceRestAPIVerticle.class);
  private static final String SERVICE_NAME = "resource-rest-api";

  private OrganizationRouter organizationRouter;
  private SoldierRouter soldierRouter;

  public ResourceRestAPIVerticle(OrganizationService organizationService,
                                 SoldierService soldierService, List<CRUDService> services) {
    super(services, SERVICE_NAME);

    this.organizationRouter = new OrganizationRouter(this, context, organizationService);
    this.soldierRouter = new SoldierRouter(this, context, soldierService);
  }

  @Override
  public void routeApi(Router router) {
    organizationRouter.route(router);
    soldierRouter.route(router);
  }
}
