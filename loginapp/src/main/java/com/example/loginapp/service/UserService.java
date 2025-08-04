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
            System.out.println("Login attempt - Email: " + email + ", Password: " + password);
            System.out.println("User found - Stored password: " + user.getPassword());
            
            // For local development, use simple text comparison first
            if (user.getPassword().equals(password)) {
                System.out.println("Plain text password match!");
                return true;
            }
            
            // Check if stored password is hashed and try BCrypt validation
            if (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$")) {
                boolean matches = passwordEncoder.matches(password, user.getPassword());
                System.out.println("BCrypt password match: " + matches);
                return matches;
            }
            
            System.out.println("No password match found");
        } else {
            System.out.println("User not found for email: " + email);
        }
        return false;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public Optional<User> getUserByIdOptional(Long id) {
        return userRepository.findById(id);
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

    public List<User> getUsersByWorkerType(User.WorkerType workerType) {
        return userRepository.findWorkersByType(workerType);
    }

    public User updateUserRole(Long id, User.Role role) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(role);
            return userRepository.save(user);
        }
        return null;
    }

    public Object getUserStats() {
        List<User> allUsers = userRepository.findAll();
        long totalUsersCount = allUsers.size();
        long adminsCount = allUsers.stream().filter(u -> u.getRole() == User.Role.ADMIN).count();
        long workersCount = allUsers.stream().filter(u -> u.getRole() == User.Role.WORKER).count();
        long studentsCount = allUsers.stream().filter(u -> u.getRole() == User.Role.STUDENT).count();
        
        return new Object() {
            public final long totalUsers = totalUsersCount;
            public final long admins = adminsCount;
            public final long workers = workersCount;
            public final long students = studentsCount;
        };
    }

    public User saveUser(User user) {
        // Validate that password is not null or empty for new users
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        
        // For local development, keep passwords as plain text
        // Don't encrypt passwords to make login easier
        System.out.println("Saving user with plain text password for local development");
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        System.out.println("Registering user: " + user.getName() + " with email: " + user.getEmail());
        System.out.println("Password provided: " + (user.getPassword() != null && !user.getPassword().trim().isEmpty() ? "Yes" : "No"));
        
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
        System.out.println("Updating user with ID: " + user.getId());
        System.out.println("Password provided: " + (user.getPassword() != null ? "Yes (length: " + user.getPassword().length() + ")" : "No"));
        
        Optional<User> existingUserOpt = userRepository.findById(user.getId());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            System.out.println("Found existing user: " + existingUser.getName());
            
            // Update fields
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());
            existingUser.setWorkerType(user.getWorkerType());
            
            // Only update password if provided
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                System.out.println("Updating password for user: " + existingUser.getName());
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                System.out.println("Password not provided or empty, keeping existing password");
            }
            
            User savedUser = userRepository.save(existingUser);
            System.out.println("User updated successfully: " + savedUser.getName());
            return savedUser;
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

    public void addSampleUsers() {
        // Add sample students
        if (!userRepository.existsByEmail("student1@college.edu")) {
            User student1 = User.builder()
                    .name("Alice Johnson")
                    .email("student1@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.STUDENT)
                    .phone("9876543211")
                    .build();
            userRepository.save(student1);
        }

        if (!userRepository.existsByEmail("student2@college.edu")) {
            User student2 = User.builder()
                    .name("Bob Smith")
                    .email("student2@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.STUDENT)
                    .phone("9876543212")
                    .build();
            userRepository.save(student2);
        }

        // Add sample workers
        if (!userRepository.existsByEmail("electrician2@college.edu")) {
            User electrician = User.builder()
                    .name("David Electrician")
                    .email("electrician2@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.WORKER)
                    .workerType(User.WorkerType.ELECTRICIAN)
                    .phone("9876543213")
                    .build();
            userRepository.save(electrician);
        }

        if (!userRepository.existsByEmail("plumber2@college.edu")) {
            User plumber = User.builder()
                    .name("Sarah Plumber")
                    .email("plumber2@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.WORKER)
                    .workerType(User.WorkerType.PLUMBER)
                    .phone("9876543214")
                    .build();
            userRepository.save(plumber);
        }

        if (!userRepository.existsByEmail("carpenter2@college.edu")) {
            User carpenter = User.builder()
                    .name("Mike Carpenter")
                    .email("carpenter2@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.WORKER)
                    .workerType(User.WorkerType.CARPENTER)
                    .phone("9876543215")
                    .build();
            userRepository.save(carpenter);
        }

        // Add sample admin
        if (!userRepository.existsByEmail("admin2@college.edu")) {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin2@college.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.ADMIN)
                    .phone("9876543216")
                    .build();
            userRepository.save(admin);
        }
    }
}
