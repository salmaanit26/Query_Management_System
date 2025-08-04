#!/bin/bash
# Simple build script for Render deployment

echo "==> Current working directory:"
pwd

echo "==> Listing current directory contents:"
ls -la

echo "==> Checking if we're in the right directory..."
if [ ! -f "pom.xml" ]; then
    echo "==> pom.xml not found, this might be wrong directory"
    echo "==> Looking for pom.xml in subdirectories..."
    find . -name "pom.xml" -type f
fi

echo "==> Checking for Maven wrapper..."
if [ -f "mvnw" ]; then
    echo "==> Found mvnw, making it executable..."
    chmod +x mvnw
    echo "==> Building with Maven wrapper..."
    ./mvnw clean package -DskipTests
elif [ -f "./mvnw" ]; then
    echo "==> Found ./mvnw, making it executable..."
    chmod +x ./mvnw
    echo "==> Building with Maven wrapper..."
    ./mvnw clean package -DskipTests
else
    echo "==> Maven wrapper not found, trying system maven..."
    if command -v mvn >/dev/null 2>&1; then
        echo "==> Using system Maven..."
        mvn clean package -DskipTests
    else
        echo "==> ERROR: Neither mvnw nor mvn found!"
        echo "==> Available commands:"
        which java || echo "Java not found"
        which javac || echo "Javac not found"
        which mvn || echo "Maven not found"
        exit 1
    fi
fi

echo "==> Build completed!"
echo "==> Checking target directory:"
ls -la target/ 2>/dev/null || echo "Target directory not found"
