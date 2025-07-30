package com.example.loginapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Value("${spring.datasource.url:unknown}")
    private String databaseUrl;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check database connection
            try (Connection connection = dataSource.getConnection()) {
                health.put("status", "UP");
                health.put("database", getDatabaseType());
                health.put("timestamp", System.currentTimeMillis());
                
                // Database-specific info
                Map<String, Object> dbInfo = new HashMap<>();
                dbInfo.put("url", maskDatabaseUrl(databaseUrl));
                dbInfo.put("connected", true);
                health.put("databaseInfo", dbInfo);
                
                return ResponseEntity.ok(health);
            }
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("database", "disconnected");
            health.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(503).body(health);
        }
    }

    private String getDatabaseType() {
        if (databaseUrl.contains("mysql")) {
            return "mysql";
        } else if (databaseUrl.contains("sqlite")) {
            return "sqlite";
        } else if (databaseUrl.contains("h2")) {
            return "h2";
        } else {
            return "unknown";
        }
    }

    private String maskDatabaseUrl(String url) {
        // Mask sensitive information in database URL
        if (url.contains("://")) {
            String[] parts = url.split("://");
            if (parts.length > 1) {
                String protocol = parts[0];
                String rest = parts[1];
                if (rest.contains("@")) {
                    String[] hostParts = rest.split("@");
                    if (hostParts.length > 1) {
                        return protocol + "://***:***@" + hostParts[1];
                    }
                }
                return protocol + "://" + rest;
            }
        }
        return url.replaceAll("password=[^&;]*", "password=***");
    }
}
