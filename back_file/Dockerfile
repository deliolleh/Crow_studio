FROM openjdk:8-jdk

ARG WORKSPACE=/home/ubuntu
ARG BUILD_TARGET=${WORKSPACE}/build/libs
WORKDIR ${WORKSPACE}

# copy code & build
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

ARG JAR_FILE=back_file/build/libs/back_file-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]