#!/bin/bash
# Start with MySQL (Full Features)

echo "🚀 Starting Query Management System with MySQL (Full Features)"

# Check if MySQL container is running
if ! docker ps | grep -q "query_management_mysql"; then
    echo "📦 Starting MySQL container..."
    cd "$(dirname "$0")"
    docker-compose up -d mysql
    echo "⏳ Waiting for MySQL to be ready..."
    sleep 10
fi

# Start Spring Boot with MySQL profile
echo "🔗 Starting backend with MySQL connection..."
cd loginapp
mvn spring-boot:run -Dspring.profiles.active=mysql

echo "✅ MySQL mode started!"
echo "🌐 Backend: http://localhost:8080"
echo "🎯 Health Check: http://localhost:8080/api/health"
