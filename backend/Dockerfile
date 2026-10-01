# ===================================================================
# Stage 1: Build & Package Spring Boot Application
# ===================================================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy Maven POM and pre-fetch dependencies for efficient Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy application source code and compile production executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ===================================================================
# Stage 2: Minimal Production JRE Runtime
# ===================================================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-privileged user and group for container security
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app appuser

# Copy executable jar from builder stage
COPY --from=builder /build/target/*.jar /app/app.jar
RUN chown appuser:appgroup /app/app.jar

# Run as non-root user
USER appuser

# Expose default port (Render dynamically overrides this via the $PORT env var)
EXPOSE 8080

# Production defaults:
# - Bind to 0.0.0.0 to accept external container traffic
# - Activate production profile (application-prod.yml)
# - Default port 8080 (overridden by Render's $PORT at runtime)
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_ADDRESS=0.0.0.0

# Execute Spring Boot using exec so Java runs as PID 1
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar /app/app.jar"]