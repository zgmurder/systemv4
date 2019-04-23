package io.vertx.armysystem.business.common;

/**
 * Action enum object
 *
 * @author Derek Zheng
 */
public enum Action {
  Read("Read"),
  Create("Create"),
  Update("Update"),
  Delete("Delete");

  private final String name;

  Action(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return name;
  }
}
