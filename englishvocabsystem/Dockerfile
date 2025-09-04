# Sử dụng OpenJDK 21 làm base image
FROM openjdk:21-jdk-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy Maven wrapper và pom.xml trước để tận dụng Docker layer caching
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Cấp quyền thực thi cho Maven wrapper
RUN chmod +x ./mvnw

# Download dependencies (sẽ được cache nếu pom.xml không thay đổi)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build ứng dụng
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Chạy ứng dụng với Railway database
CMD ["java", "-jar", "target/englishvocabsystem-0.0.1-SNAPSHOT.jar"]