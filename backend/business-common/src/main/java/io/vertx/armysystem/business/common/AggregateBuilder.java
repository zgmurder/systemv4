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

            // 进一步处理soldier里的position和rank字段
            if (item.containsKey("soldier")) {
              JsonObject soldier = item.getJsonObject("soldier");
              if (soldier.containsKey("position") && soldier.getJsonArray("position").size() > 0) {
                soldier.put("position", item.getJsonArray("position").getJsonObject(0));
              } else {
                soldier.remove("position");
              }
              if (soldier.containsKey("rank") && soldier.getJsonArray("rank").size() > 0) {
                soldier.put("rank", soldier.getJsonArray("rank").getJsonObject(0));
              } else {
                soldier.remove("rank");
              }
            }
          });

          item.put("id", item.getString("_id"));
          item.remove("_id");
          return item;
        }).collect(Collectors.toList());
  }

  public AggregateBuilder addLookupOrganization() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Organization")
        .put("localField", "organizationId")
        .put("foreignField", "_id")
        .put("as", "organization")))
        .add(new JsonObject().put("$unwind", "$organization"));

    return this;
  }

  public AggregateBuilder addLookupSoldier() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Soldier")
            .put("localField", "soldierId")
            .put("foreignField", "_id")
            .put("as", "soldier")))
        .add(new JsonObject().put("$unwind", "soldier"))
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Position")
            .put("localField", "soldier.positionId")
            .put("foreignField", "_id")
            .put("as", "position")))
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "MilitaryRank")
            .put("localField", "soldier.rankId")
            .put("foreignField", "_id")
            .put("as", "rank")));

    return this;
  }

  public AggregateBuilder addLookupPosition() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Position")
        .put("localField", "positionId")
        .put("foreignField", "_id")
        .put("as", "position")))
        .add(new JsonObject().put("$unwind", "$position"));

    return this;
  }

  public AggregateBuilder addLookupRank() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "MilitaryRank")
        .put("localField", "rankId")
        .put("foreignField", "_id")
        .put("as", "rank")))
        .add(new JsonObject().put("$unwind", "$rank"));

    return this;
  }

  public AggregateBuilder addLookupStandard() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainStandard")
        .put("localField", "standardId")
        .put("foreignField", "_id")
        .put("as", "standard")))
        .add(new JsonObject().put("$unwind", "$standard"));

    return this;
  }

  public AggregateBuilder addLookupSection() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainSection")
        .put("localField", "sectionId")
        .put("foreignField", "_id")
        .put("as", "section")))
        .add(new JsonObject().put("$unwind", "$section"));

    return this;
  }

  public AggregateBuilder addLookupCourse() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Course")
        .put("localField", "courseId")
        .put("foreignField", "_id")
        .put("as", "course")))
        .add(new JsonObject().put("$unwind", "$course"));

    return this;
  }

  public AggregateBuilder addLookupCourses(String localField, String asField) {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "Course")
        .put("localField", localField)
        .put("foreignField", "_id")
        .put("as", asField)));

    return this;
  }

  public AggregateBuilder addLookupTrainStep() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "TrainStep")
        .put("localField", "trainStepName")
        .put("foreignField", "name")
        .put("as", "trainStep")))
        .add(new JsonObject().put("$unwind", "$trainStep"));

    return this;
  }

  public AggregateBuilder addLookupOrgCategory() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "OrgCategory")
        .put("localField", "orgCategory")
        .put("foreignField", "name")
        .put("as", "orgCategoryObj")))
        .add(new JsonObject().put("$unwind", "$orgCategoryObj"));

    return this;
  }

  public AggregateBuilder addLookupOrdnanceType() {
    pipeline.add(new JsonObject().put("$lookup", new JsonObject()
        .put("from", "OrdnanceType")
        .put("localField", "ordnanceType")
        .put("foreignField", "name")
        .put("as", "ordnanceTypeObj")))
        .add(new JsonObject().put("$unwind", "$ordnanceTypeObj"));

    return this;
  }
}
