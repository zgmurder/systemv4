package io.vertx.armysystem.business.common;

import java.util.List;

public class BaseUtil {
  public static Boolean isEmpty(String value) {
    return value == null || value.isEmpty();
  }
  public static <T> Boolean isEmpty(List<T> value) {
    return value == null || value.isEmpty();
  }
}
