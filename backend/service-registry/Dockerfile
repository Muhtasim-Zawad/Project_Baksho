# Use a base image with Java and Maven for building
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /app

# Copy the POM file and download dependencies to leverage Docker cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, creating the executable JAR
RUN mvn clean package -DskipTests

# --- Second Stage: Create the final, smaller image ---

# Use a smaller base image for the final container
FROM openjdk:17-jdk

# Set the working directory
WORKDIR /app

# Copy the JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on (as defined in application.properties)
EXPOSE 8761

# Command to run the application
CMD ["java","-XX:+IgnoreContainerSupport", "-jar", "app.jar"]



#### ----- ALTERNATIVE: Single-Stage Build for Development ----- ####

# # Use a single-stage build with a Maven and JDK image
# FROM maven:3.8.4-openjdk-17

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the POM file first to leverage Docker's build cache
# # This layer is only rebuilt if pom.xml changes
# COPY pom.xml .

# # Download all dependencies into a cached layer
# RUN mvn dependency:go-offline

# # Copy the rest of your application's source code
# COPY src ./src

# # Expose the port that the application will run on
# EXPOSE 8761

# # Command to run the application using the Maven Spring Boot plugin
# # This is typically used for development environments
# CMD ["mvn", "spring-boot:run"]
