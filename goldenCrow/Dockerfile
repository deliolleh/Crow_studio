FROM openjdk:8-jdk AS builder
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN apt-get update -y
RUN apt-get install -y python3-pip
RUN pip install django
RUN chmod +x ./gradlew
RUN ./gradlew bootjar

FROM openjdk:8-jdk
COPY --from=builder build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]