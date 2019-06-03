package io.vertx.armysystem.microservice.gateway;

import io.vertx.core.Future;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.armysystem.microservice.common.RestAPIVerticle;
import io.vertx.servicediscovery.Record;
import io.vertx.servicediscovery.ServiceDiscovery;
import io.vertx.servicediscovery.types.HttpEndpoint;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public class APIGatewayVerticle extends RestAPIVerticle {
  private static final int DEFAULT_PORT = 8080;

  private static final Logger logger = LoggerFactory.getLogger(APIGatewayVerticle.class);

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    // get HTTP host and port from configuration, or use default value
    String host = config().getString("api.gateway.http.address", "localhost");
    int port = config().getInteger("api.gateway.http.port", DEFAULT_PORT);

    Router router = Router.router(vertx);

    // body handler
    router.route().handler(BodyHandler.create());

    // version handler
    router.get("/api/v").handler(this::apiVersion);

    // time handler
    router.get("/api/time").handler(this::apiTime);

    // api dispatcher
    router.route("/api/*").handler(this::dispatchRequests);

    // static content
    router.route("/*").handler(StaticHandler.create());

    // enable HTTPS
    HttpServerOptions httpServerOptions = new HttpServerOptions();
//        .setSsl(true)
//        .setKeyStoreOptions(new JksOptions().setPath("server.jks").setPassword("123456"));

    // create http server
    vertx.createHttpServer(httpServerOptions)
        .requestHandler(router::handle)
        .listen(port, host, ar -> {
          if (ar.succeeded()) {
            publishApiGateway(host, port);
            future.complete();
            logger.info("API Gateway is running on port " + port);
            // publish log
            publishGatewayLog("api_gateway_init_success:" + port);
          } else {
            future.fail(ar.cause());
          }
        });
  }

  private void dispatchRequests(RoutingContext context) {
    int initialOffset = 5; // length of `/api/`
    // run with circuit breaker in order to deal with failure
    circuitBreaker.execute(future -> {
      getAllEndpoints().setHandler(ar -> {
        if (ar.succeeded()) {
          List<Record> recordList = ar.result();
          // get relative path and retrieve prefix to dispatch client
          String path = context.request().uri();

          if (path.length() <= initialOffset) {
            notFound(context);
            future.complete();
            return;
          }
          String prefix = (path.substring(initialOffset)
              .split("/"))[0];
          // generate new relative path
          String newPath = path.substring(initialOffset + prefix.length());
          // get one relevant HTTP client, may not exist
          Optional<Record> client = recordList.stream()
              .filter(record -> record.getMetadata().getString("api.name") != null)
              .filter(record -> record.getMetadata().getString("api.name").equals(prefix))
              .findAny(); // simple load balance

          if (client.isPresent()) {
            doDispatch(context, newPath, discovery.getReference(client.get()).get(), future);
          } else {
            notFound(context);
            future.complete();
          }
        } else {
          future.fail(ar.cause());
        }
      });
    }).setHandler(ar -> {
      if (ar.failed()) {
        badGateway(ar.cause(), context);
      }
    });
  }

  /**
   * Dispatch the request to the downstream REST layers.
   *
   * @param context routing context instance
   * @param path    relative path
   * @param client  relevant HTTP client
   */
  private void doDispatch(RoutingContext context, String path, HttpClient client, Future<Object> cbFuture) {
    logger.info("dispatch path is " + path);

    HttpClientRequest toReq = client
        .request(context.request().method(), path, response -> {
          response.bodyHandler(body -> {
//            if (response.statusCode() >= 500) { // api endpoint server error, circuit breaker should fail
//              cbFuture.fail(response.statusCode() + ": " + body.toString());
//            } else
            {
              HttpServerResponse toRsp = context.response()
                  .setStatusCode(response.statusCode());
              response.headers().forEach(header -> {
                toRsp.putHeader(header.getKey(), header.getValue());
              });
              // send response
              toRsp.end(body);
              cbFuture.complete();
            }
            ServiceDiscovery.releaseServiceObject(discovery, client);
          });
        });
    // set headers
    context.request().headers().forEach(header -> {
      toReq.putHeader(header.getKey(), header.getValue());
    });
    // send request
    if (context.getBody() == null) {
      toReq.end();
    } else {
      toReq.end(context.getBody());
    }
  }

  private void apiVersion(RoutingContext context) {
    context.response()
        .end(new JsonObject().put("version", "v1").encodePrettily());
  }

  private void apiTime(RoutingContext context) {
    context.response()
        .end(new JsonObject().put("time", new Date().getTime()).encodePrettily());
  }

  /**
   * Get all REST endpoints from the service discovery infrastructure.
   *
   * @return async result
   */
  private Future<List<Record>> getAllEndpoints() {
    Future<List<Record>> future = Future.future();
    discovery.getRecords(record -> record.getType().equals(HttpEndpoint.TYPE),
        future);
    return future;
  }

  // log methods

  private void publishGatewayLog(String info) {
    JsonObject message = new JsonObject()
        .put("info", info)
        .put("time", System.currentTimeMillis());
    publishLogEvent("gateway", message);
  }

  private void publishGatewayLog(JsonObject msg) {
    JsonObject message = msg.copy()
        .put("time", System.currentTimeMillis());
    publishLogEvent("gateway", message);
  }
}
