package io.vertx.armysystem.microservice.standard.api;

import io.vertx.armysystem.business.common.CRUDRestAPIVerticle;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;

import java.util.List;

public class StandardRestAPIVerticle extends CRUDRestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(StandardRestAPIVerticle.class);
  private static final String SERVICE_NAME = "standard-rest-api";

  public StandardRestAPIVerticle(List<CRUDService> services) {
    super(services, SERVICE_NAME);
  }

  @Override
  public void routeApi(Router router) throws Exception {

  }
}
