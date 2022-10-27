FROM openjdk:8-jdk

# ARG WORKSPACE=home/ubuntu/S07P31D207/back_file
# WORKDIR ${WORKSPACE}

COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

# ARG JAR_FILE=build/libs/back_file-0.0.1-SNAPSHOT.jar
ARG JAR_FILE=./docker-volume/jenkins/users/TeamGoldenCrow_738252207133088006/back_file-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]