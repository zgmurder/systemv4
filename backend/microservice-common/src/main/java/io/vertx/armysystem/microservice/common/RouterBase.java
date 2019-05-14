package io.vertx.armysystem.microservice.common;

import io.vertx.core.Context;
import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;

public abstract class RouterBase {
  protected static final String PREFIX = "/";

  protected RestAPIVerticle verticle;
  protected Context context;

  public RouterBase(RestAPIVerticle verticle, Context context) {
    this.verticle = verticle;
    this.context = context;
  }

  public void route(Router router) {

  }
}
