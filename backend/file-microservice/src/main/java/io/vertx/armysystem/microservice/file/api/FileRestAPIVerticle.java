package io.vertx.armysystem.microservice.file.api;

import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.armysystem.microservice.file.FileService;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

public class FileRestAPIVerticle extends RestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(FileRestAPIVerticle.class);
  private static final String SERVICE_NAME = "file-rest-api";
  private static final String PREFIX = "/";
  private FileService fileService;

  public FileRestAPIVerticle(FileService fileService) {
    super();

    this.fileService = fileService;
  }

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();
    final Router router = Router.router(vertx);
    // body handler
    router.route().handler(BodyHandler.create());
    enableJWTAuth();
    enableCorsSupport(router);

    router.post("/image/:fileName")
        .handler(context -> requireLogin(context, this::apiUploadImage));
    router.get("/image/:id")
        .handler(context -> requireLogin(context, this::apiDownloadImage));
    router.delete("/image/:id")
        .handler(context -> requireLogin(context, this::apiDeleteImage));

    String host = config().getString("http.address", "0.0.0.0");
    int port = config().getInteger("http.port", 8083);

    logger.info("Start " + SERVICE_NAME + " on port " + port);

    // create HTTP server and publish REST service
    createHttpServer(router, host, port)
        .compose(serverCreated -> publishHttpEndpoint(SERVICE_NAME, host, port))
        .setHandler(future);
  }

  private void apiUploadImage(RoutingContext context, JsonObject principal) {
    logger.info("apiUploadImage: fileUploads=" + context.fileUploads());
    context.fileUploads().forEach(item -> {
      logger.info(item);
    });
    logger.info("apiUploadImage: getBody=" + context.getBody());
  }

  private void apiDownloadImage(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    logger.info("apiDownloadImage: file=" + id);
  }

  private void apiDeleteImage(RoutingContext context, JsonObject principal) {
    String id = context.request().getParam("id");
    logger.info("apiDeleteImage: file=" + id);
  }
}
