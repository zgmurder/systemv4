package io.vertx.armysystem.microservice.resource.api;

import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.core.Future;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;


public class ResourceRestAPIVerticle extends RestAPIVerticle {
  private static final String SERVICE_NAME = "resource-rest-api";

  private OrganizationRouter organizationRouter;

  public ResourceRestAPIVerticle(OrganizationService organizationService) {
    super();

    this.organizationRouter = new OrganizationRouter(this, context, organizationService);
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    System.out.println("Starting ResourceRestAPIVerticle...");

    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);

    organizationRouter.route(router);

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8082);

    System.out.println("port = " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(SERVICE_NAME, host, port))
        .setHandler(future.completer());
  }
}
