FROM openjdk:8-jdk

ARG JAR_FILE=build/libs/(프로젝트명)-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]