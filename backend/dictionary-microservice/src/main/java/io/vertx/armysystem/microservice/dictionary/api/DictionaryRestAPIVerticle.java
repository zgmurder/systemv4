package io.vertx.armysystem.microservice.dictionary.api;

import io.vertx.armysystem.business.common.CRUDRestAPIVerticle;
import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;

import java.util.List;

public class DictionaryRestAPIVerticle extends CRUDRestAPIVerticle {
  private static final Logger logger = LoggerFactory.getLogger(DictionaryRestAPIVerticle.class);
  private static final String SERVICE_NAME = "dictionary-rest-api";

  public DictionaryRestAPIVerticle(List<CRUDService> services) {
    super(services, SERVICE_NAME);
  }

  @Override
  public void routeApi(Router router) {

  }
}
