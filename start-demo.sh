#!/bin/bash
# Start with SQLite (Demo Mode)

echo "🎨 Starting Query Management System in Demo Mode (SQLite)"

# Start Spring Boot with default profile (SQLite)
echo "🔗 Starting backend with SQLite connection..."
cd loginapp
mvn spring-boot:run

echo "✅ Demo mode started!"
echo "🌐 Backend: http://localhost:8080"
echo "🎯 Health Check: http://localhost:8080/api/health"
