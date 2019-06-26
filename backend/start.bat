@echo off
start cmd /k java -jar ./api-gateway/target/api-gateway-1.0-SNAPSHOT-fat.jar -conf ./api-gateway/src/config/local.json
start cmd /k java -jar ./account-microservice/target/account-microservice-1.0-SNAPSHOT-fat.jar  -conf ./account-microservice/src/config/local.json
start cmd /k java -jar ./dictionary-microservice/target/dictionary-microservice-1.0-SNAPSHOT-fat.jar  -conf ./dictionary-microservice/src/config/local.json
start cmd /k java -jar ./resource-microservice/target/resource-microservice-1.0-SNAPSHOT-fat.jar  -conf ./resource-microservice/src/config/local.json
start cmd /k java -jar ./standard-microservice/target/standard-microservice-1.0-SNAPSHOT-fat.jar  -conf ./standard-microservice/src/config/local.json
start cmd /k java -jar ./file-microservice/target/file-microservice-1.0-SNAPSHOT-fat.jar  -conf ./file-microservice/src/config/local.json