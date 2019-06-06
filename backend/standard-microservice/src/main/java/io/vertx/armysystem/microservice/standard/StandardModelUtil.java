package io.vertx.armysystem.microservice.standard;

import io.vertx.armysystem.business.common.AggregateBuilder;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class StandardModelUtil {
  public static Future<Long> countWithStandard(MongoRepositoryWrapper mongo, String collection, QueryCondition qCondition) {
    AggregateBuilder builder = new AggregateBuilder()
        .addLookupStandard()
        .addQuery(qCondition.getQuery())
        .addCount();

    return mongo.aggregateQuery(collection, builder.getPipeline(), new JsonObject())
        .map(list -> builder.getCount(list));
  }

  public static Future<List<JsonObject>> queryWithStandard(MongoRepositoryWrapper mongo, String collection, QueryCondition qCondition) {
    AggregateBuilder builder = new AggregateBuilder()
        .addLookupStandard()
        .addQuery(qCondition.getQuery())
        .addOption(qCondition.getOption());

    return mongo.aggregateQuery(collection, builder.getPipeline(), new JsonObject())
        .map(list -> builder.fixLookupResults(list));
  }
}
