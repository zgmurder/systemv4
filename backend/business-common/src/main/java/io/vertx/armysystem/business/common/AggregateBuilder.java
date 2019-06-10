package io.vertx.armysystem.business.common;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AggregateBuilder {
  private JsonArray pipeline;
  private List<String> lookupKeys;

  public AggregateBuilder() {
    pipeline = new JsonArray();
    lookupKeys = new ArrayList<>();
  }

  public JsonArray getPipeline() {
    return pipeline;
  }

  public AggregateBuilder addQuery(JsonObject query) {
    pipeline.add(new JsonObject().put("$match", query));

    return this;
  }

  public AggregateBuilder addOption(JsonObject option) {
    if (option.containsKey("sort")) {
      pipeline.add(new JsonObject().put("$sort", option.getJsonObject("sort")));
    }
    if (option.containsKey("skip")) {
      pipeline.add(new JsonObject().put("$skip", option.getInteger("skip")));
    }
    if (option.containsKey("limit")) {
      pipeline.add(new JsonObject().put("$limit", option.getInteger("limit")));
    }
    if (option.containsKey("fields")) {
      JsonObject project = new JsonObject();
      option.getJsonArray("fields").getList()
          .forEach(field -> project.put(field.toString(), 1));
      pipeline.add(new JsonObject().put("$project", project));
    }

    return this;
  }

  public AggregateBuilder addCount() {
    pipeline.add(new JsonObject().put("$count", "count"));

    return this;
  }

  public Long getCount(List<JsonObject> results) {
    if (results.isEmpty()) {
      return 0L;
    } else {
      return results.get(0).getLong("count");
    }
  }

  public List<JsonObject> fixLookupResults(List<JsonObject> results) {
    return results.stream()
        .map(item -> {
          lookupKeys.forEach(key -> {
            if (item.containsKey(key) && item.getJsonArray(key).size() > 0) {
              item.put(key, item.getJsonArray(key).getJsonObject(0));
            } else {
              item.remove(key);
            }
          });

          return item;
        }).collect(Collectors.toList());
  }

  public AggregateBuilder addLookupOrganization() {
    lookupKeys.add("organization");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Organization")
        .put("localField", "organizationId")
        .put("foreignField", "_id")
        .put("as", "organization")));

    return this;
  }

  public AggregateBuilder addLookupPosition() {
    lookupKeys.add("position");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Position")
        .put("localField", "positionId")
        .put("foreignField", "_id")
        .put("as", "position")));

    return this;
  }

  public AggregateBuilder addLookupRank() {
    lookupKeys.add("rank");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "MilitaryRank")
        .put("localField", "rankId")
        .put("foreignField", "_id")
        .put("as", "rank")));

    return this;
  }

  public AggregateBuilder addLookupStandard() {
    lookupKeys.add("standard");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainStandard")
        .put("localField", "standardId")
        .put("foreignField", "_id")
        .put("as", "standard")));

    return this;
  }

  public AggregateBuilder addLookupSection() {
    lookupKeys.add("section");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainSection")
        .put("localField", "sectionId")
        .put("foreignField", "_id")
        .put("as", "section")));

    return this;
  }

  public AggregateBuilder addLookupCourse() {
    lookupKeys.add("course");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Course")
        .put("localField", "courseId")
        .put("foreignField", "_id")
        .put("as", "course")));

    return this;
  }

  public AggregateBuilder addLookupCourses() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Course")
        .put("localField", "courseIds")
        .put("foreignField", "_id")
        .put("as", "courses")));

    return this;
  }

  public AggregateBuilder addLookupTrainStep() {
    lookupKeys.add("trainStep");
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainStep")
        .put("localField", "trainStepName")
        .put("foreignField", "name")
        .put("as", "trainStep")));

    return this;
  }
}