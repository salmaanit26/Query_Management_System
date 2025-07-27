package com.example.loginapp.controller;

import com.example.loginapp.model.User;
import com.example.loginapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        boolean isValid = userService.validateLogin(email, password);
        Map<String, Object> response = new HashMap<>();
        
        if (isValid) {
            User user = userService.getUserByEmail(email);
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/auth/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> googleRequest) {
        String credential = googleRequest.get("credential");
        
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Received Google login request");
            
            if (credential == null || credential.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "No credential provided");
                return ResponseEntity.badRequest().body(response);
            }
            
            System.out.println("Credential received, validating...");
            
            // Decode Google JWT token and extract email
            String email = userService.validateGoogleToken(credential);
            
            if (email != null) {
                System.out.println("Valid email extracted: " + email);
                
                // Check if user exists, if not create a new student user
                User user = userService.getUserByEmail(email);
                if (user == null) {
                    System.out.println("Creating new user for email: " + email);
                    // Create new student user for Google sign-in
                    user = userService.createGoogleUser(email);
                } else {
                    System.out.println("Existing user found: " + user.getName());
                }
                
                response.put("success", true);
                response.put("message", "Google login successful");
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid Google token or email verification failed. Please try again.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.out.println("Google authentication error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Google authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User savedUser = userService.registerUser(user);
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


}
