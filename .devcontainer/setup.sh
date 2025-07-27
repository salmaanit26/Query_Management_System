#!/bin/bash

# Query Management System Setup Script
echo "🚀 Setting up Query Management System Development Environment..."

# Update system packages
sudo apt-get update

# Install MySQL Server
echo "📦 Installing MySQL Server..."
sudo apt-get install -y mysql-server

# Start MySQL service
sudo service mysql start

# Configure MySQL
echo "🔧 Configuring MySQL..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS loginapp;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'loginuser'@'localhost' IDENTIFIED BY 'loginpass';"
sudo mysql -e "GRANT ALL PRIVILEGES ON loginapp.* TO 'loginuser'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Install Node.js dependencies for frontend
echo "📦 Installing Frontend Dependencies..."
cd login-frontend
npm install
cd ..

# Install Maven dependencies for backend
echo "📦 Installing Backend Dependencies..."
cd loginapp
./mvnw dependency:resolve
cd ..

# Create startup scripts
echo "📝 Creating startup scripts..."

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting React Frontend..."
cd login-frontend
PORT=3000 npm start
EOF

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "⚡ Starting Spring Boot Backend..."
cd loginapp
./mvnw spring-boot:run
EOF

# Combined startup script
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Query Management System..."

# Start MySQL
sudo service mysql start

# Start backend in background
echo "⚡ Starting Backend..."
cd loginapp
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
sleep 30

# Start frontend
echo "🌐 Starting Frontend..."
cd ../login-frontend
npm start &
FRONTEND_PID=$!

# Keep both running
echo "✅ Both services are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo "Press Ctrl+C to stop both services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

# Make scripts executable
chmod +x start-frontend.sh
chmod +x start-backend.sh
chmod +x start-all.sh

echo "✅ Setup complete!"
echo ""
echo "🎯 Quick Start Commands:"
echo "  ./start-all.sh     - Start both frontend and backend"
echo "  ./start-frontend.sh - Start only frontend"
echo "  ./start-backend.sh  - Start only backend"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo ""
echo "📊 Database:"
echo "  Host: localhost:3306"
echo "  Database: loginapp"
echo "  Username: loginuser"
echo "  Password: loginpass"
