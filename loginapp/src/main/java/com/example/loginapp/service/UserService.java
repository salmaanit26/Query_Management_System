package com.example.loginapp.service;

import com.example.loginapp.model.User;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean validateLogin(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // For backward compatibility, check both plain text and encrypted passwords
            return user.getPassword().equals(password) || 
                   passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getWorkersByType(User.WorkerType workerType) {
        return userRepository.findWorkersByType(workerType);
    }

    public User saveUser(User user) {
        // Encrypt password if it's not already encrypted
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return saveUser(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }

    public User updateUser(User user) {
        Optional<User> existingUserOpt = userRepository.findById(user.getId());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            
            // Update fields
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());
            existingUser.setWorkerType(user.getWorkerType());
            
            // Only update password if provided
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            
            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public String validateGoogleToken(String credential) {
        try {
            System.out.println("Validating Google token...");
            
            // Use Google's official library to verify the token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList("791771900325-5ijss13doodjul67iun04cofqqtjn37s.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                
                System.out.println("Token verified. Email: " + email + ", Verified: " + emailVerified);
                
                if (emailVerified && email != null) {
                    // Allow any valid Google email address
                    System.out.println("Valid Google email: " + email);
                    return email;
                } else {
                    System.out.println("Email not verified or null");
                    return null;
                }
            } else {
                System.out.println("Invalid ID token - verification failed");
                return null;
            }
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public User createGoogleUser(String email) {
        // Extract name from email (before @ symbol)
        String name = email.substring(0, email.indexOf("@"));
        
        User user = User.builder()
                .name(name)
                .email(email)
                .phone("") // Will be updated later
                .password("") // No password for Google users
                .role(User.Role.STUDENT)
                .workerType(null) // Students don't have worker type
                .build();
                
        return userRepository.save(user);
    }

    public List<User> getWorkers() {
        return userRepository.findByRole(User.Role.WORKER);
    }
}
