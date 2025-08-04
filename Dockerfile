# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY loginapp/mvnw .
COPY loginapp/mvnw.cmd .
COPY loginapp/.mvn .mvn
COPY loginapp/pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies (this will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY loginapp/src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/*.jar"]
