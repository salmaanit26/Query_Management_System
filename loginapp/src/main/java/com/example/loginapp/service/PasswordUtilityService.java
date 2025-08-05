package com.example.loginapp.service;

import com.example.loginapp.model.User;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PasswordUtilityService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void convertAllPasswordsToPlainText() {
        System.out.println("=== PASSWORD CONVERSION UTILITY ===");
        List<User> allUsers = userRepository.findAll();
        
        System.out.println("Found " + allUsers.size() + " users in database:");
        
        for (User user : allUsers) {
            System.out.println("\n--- User: " + user.getEmail() + " ---");
            System.out.println("Role: " + user.getRole());
            System.out.println("Current password: " + user.getPassword());
            
            // Check if password is hashed (BCrypt starts with $2a$, $2b$, etc.)
            if (user.getPassword().startsWith("$2a$") || 
                user.getPassword().startsWith("$2b$") || 
                user.getPassword().startsWith("$2y$")) {
                
                System.out.println("Status: HASHED - Converting to plain text");
                user.setPassword("password"); // Set to simple plain text
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                System.out.println("✓ Updated to plain text: password");
                
            } else if (user.getPassword().equals("password")) {
                System.out.println("Status: Already plain text (password)");
                
            } else {
                System.out.println("Status: Plain text with custom value: " + user.getPassword());
                // Keep existing plain text password, but let's standardize to "password"
                user.setPassword("password");
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                System.out.println("✓ Standardized to: password");
            }
        }
        
        System.out.println("\n=== FINAL USER LIST ===");
        List<User> updatedUsers = userRepository.findAll();
        for (User user : updatedUsers) {
            System.out.println("Email: " + user.getEmail() + 
                             " | Role: " + user.getRole() + 
                             " | Password: " + user.getPassword() +
                             (user.getWorkerType() != null ? " | Worker Type: " + user.getWorkerType() : ""));
        }
        
        System.out.println("\n✓ All passwords converted to plain text: 'password'");
    }
}
