#!/bin/bash
set -e

echo "==> Starting build process..."
echo "==> Current directory: $(pwd)"
echo "==> Listing files:"
ls -la

echo "==> Checking for Maven wrapper..."
if [ -f "./mvnw" ]; then
    echo "==> Found mvnw, making it executable..."
    chmod +x ./mvnw
    echo "==> Building with Maven wrapper..."
    ./mvnw clean package -DskipTests
elif command -v mvn &> /dev/null; then
    echo "==> Using system Maven..."
    mvn clean package -DskipTests
else
    echo "==> ERROR: Neither mvnw nor mvn found!"
    exit 1
fi

echo "==> Build completed successfully!"
echo "==> Listing target directory:"
ls -la target/
