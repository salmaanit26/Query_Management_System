package com.example.loginapp.controller;

import com.example.loginapp.model.User;
import com.example.loginapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/workers/{workerType}")
    public ResponseEntity<List<User>> getWorkersByType(@PathVariable String workerType) {
        try {
            User.WorkerType type = User.WorkerType.valueOf(workerType.toUpperCase());
            List<User> workers = userService.getWorkersByType(type);
            return ResponseEntity.ok(workers);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        List<User> users = userService.searchUsers(keyword);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/workers")
    public ResponseEntity<List<User>> getWorkers() {
        List<User> workers = userService.getWorkers();
        return ResponseEntity.ok(workers);
    }
}
