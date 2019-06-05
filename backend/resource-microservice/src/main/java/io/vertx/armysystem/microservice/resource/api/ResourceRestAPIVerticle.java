package io.vertx.armysystem.microservice.resource.api;

import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.core.Future;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;


public class ResourceRestAPIVerticle extends RestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ResourceRestAPIVerticle.class);
  private static final String SERVICE_NAME = "resource-rest-api";

  private OrganizationRouter organizationRouter;
  private SoldierRouter soldierRouter;

  public ResourceRestAPIVerticle(OrganizationService organizationService,
                                 SoldierService soldierService) {
    super();

    this.organizationRouter = new OrganizationRouter(this, context, organizationService);
    this.soldierRouter = new SoldierRouter(this, context, soldierService);
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);

    organizationRouter.route(router);
    soldierRouter.route(router);

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8084);

    logger.info("Start resource api on port " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(SERVICE_NAME, host, port))
        .setHandler(future);
  }
}
