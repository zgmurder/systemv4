package io.vertx.armysystem.microservice.standard;

import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class StandardModelUtil {
  public static Future<Long> countWithStandard(MongoRepositoryWrapper mongo, String collection, QueryCondition qCondition) {
    JsonArray pipeline = new JsonArray()
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "TrainStandard")
            .put("localField", "standardId")
            .put("foreignField", "_id")
            .put("as", "standard")))
        .add(new JsonObject().put("$match", qCondition.getQuery()))
        .add(new JsonObject().put("$count", "count"));

    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    mongo.aggregateWithOptions(collection, pipeline, new JsonObject())
        .handler(object -> results.add(object))
        .endHandler(v -> future.complete(results))
        .exceptionHandler(ex -> future.fail(ex));
    return future.map(list -> {
      if (list.isEmpty()) {
        return 0L;
      } else {
        return list.get(0).getLong("count");
      }
    });
  }

  public static Future<List<JsonObject>> queryWithStandard(MongoRepositoryWrapper mongo, String collection, QueryCondition qCondition) {
    JsonArray pipeline = new JsonArray()
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "TrainStandard")
            .put("localField", "standardId")
            .put("foreignField", "_id")
            .put("as", "standard")))
        .add(new JsonObject().put("$match", qCondition.getQuery()));
    if (qCondition.getOption().containsKey("sort")) {
      pipeline.add(new JsonObject().put("$sort", qCondition.getOption().getJsonObject("sort")));
    }
    if (qCondition.getOption().containsKey("skip")) {
      pipeline.add(new JsonObject().put("$skip", qCondition.getOption().getInteger("skip")));
    }
    if (qCondition.getOption().containsKey("limit")) {
      pipeline.add(new JsonObject().put("$limit", qCondition.getOption().getInteger("limit")));
    }
    if (qCondition.getOption().containsKey("fields")) {
      JsonObject project = new JsonObject();
      qCondition.getOption().getJsonArray("fields").getList()
          .forEach(field -> project.put(field.toString(), 1));
      pipeline.add(new JsonObject().put("$project", project));
    }

    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    mongo.aggregateWithOptions(collection, pipeline, new JsonObject())
        .handler(object -> results.add(object))
        .endHandler(v -> future.complete(results))
        .exceptionHandler(ex -> future.fail(ex));

    return future.map(list -> list.stream()
        .map(item -> {
          if (item.containsKey("standard") && item.getJsonArray("standard").size() > 0) {
            item.put("standard", item.getJsonArray("standard").getJsonObject(0));
          } else {
            item.remove("standard");
          }

          return item;
        }).collect(Collectors.toList()));
  }
}
