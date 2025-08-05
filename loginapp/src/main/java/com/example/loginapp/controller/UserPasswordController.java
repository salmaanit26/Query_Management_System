package com.example.loginapp.controller;

import com.example.loginapp.model.User;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class UserPasswordController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user-passwords")
    public ResponseEntity<?> getAllUserPasswords() {
        try {
            List<User> users = userRepository.findAll();
            
            // Create a summary of users with their password status
            List<Object> userSummary = users.stream().map(user -> {
                final String passwordInfo;
                if (user.getPassword().startsWith("$2a$") || 
                    user.getPassword().startsWith("$2b$") || 
                    user.getPassword().startsWith("$2y$")) {
                    passwordInfo = "HASHED (BCrypt)";
                } else {
                    passwordInfo = "PLAIN TEXT: " + user.getPassword();
                }
                
                return new Object() {
                    public final Long id = user.getId();
                    public final String name = user.getName();
                    public final String email = user.getEmail();
                    public final String role = user.getRole().toString();
                    public final String workerType = user.getWorkerType() != null ? user.getWorkerType().toString() : "N/A";
                    public final String passwordStatus = passwordInfo;
                };
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(userSummary);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error retrieving user passwords: " + e.getMessage());
        }
    }
}
