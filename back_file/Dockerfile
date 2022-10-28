
# FROM openjdk:8-jdk

# # ARG WORKSPACE=home/ubuntu/S07P31D207/back_file
# # WORKDIR ${WORKSPACE}

# COPY . .
# RUN chmod +x gradlew

# RUN ./gradlew clean bootJar
# RUN find -name 'back_file-0.0.1-SNAPSHOT.jar'
# RUN ls

# RUN ls ./build/libs

# # ARG JAR_FILE=./build/libs/back_file-0.0.1-SNAPSHOT.jar
# # ARG JAR_FILE=./docker-volume/jenkins/users/TeamGoldenCrow_738252207133088006/back_file-0.0.1-SNAPSHOT.jar
# # COPY ${JAR_FILE} app.jar

# COPY back_file/build/libs/back_file-0.0.1-SNAPSHOT.jar app.jar
FROM openjdk:8-jdk AS builder
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

RUN chmod +x ./gradlew
RUN ./gradlew bootjar

# COPY --from=builder build/libs/*.jar app.jar
COPY build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]

