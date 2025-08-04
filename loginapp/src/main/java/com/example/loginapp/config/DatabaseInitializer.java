package com.example.loginapp.config;

import com.example.loginapp.model.User;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking and updating database users for local development...");
        
        // Update existing admin user or create new one
        Optional<User> adminOpt = userRepository.findByEmail("admin@college.edu");
        User admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
            System.out.println("Found existing admin user, updating password...");
        } else {
            admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@college.edu");
            admin.setRole(User.Role.ADMIN);
            System.out.println("Creating new admin user...");
        }
        admin.setPassword("password");  // Reset to plain text for local development
        userRepository.save(admin);
        System.out.println("Admin user updated/created with plain text password");
        
        // Update existing student user or create new one
        Optional<User> studentOpt = userRepository.findByEmail("student@college.edu");
        User student;
        if (studentOpt.isPresent()) {
            student = studentOpt.get();
            System.out.println("Found existing student user, updating password...");
        } else {
            student = new User();
            student.setName("Student User");
            student.setEmail("student@college.edu");
            student.setRole(User.Role.STUDENT);
            System.out.println("Creating new student user...");
        }
        student.setPassword("password");  // Reset to plain text for local development
        userRepository.save(student);
        System.out.println("Student user updated/created with plain text password");
        
        // Update existing worker user or create new one
        Optional<User> workerOpt = userRepository.findByEmail("john.electrician@company.com");
        User worker;
        if (workerOpt.isPresent()) {
            worker = workerOpt.get();
            System.out.println("Found existing worker user, updating password...");
        } else {
            worker = new User();
            worker.setName("John Electrician");
            worker.setEmail("john.electrician@company.com");
            worker.setRole(User.Role.WORKER);
            worker.setWorkerType(User.WorkerType.ELECTRICIAN);
            System.out.println("Creating new worker user...");
        }
        worker.setPassword("password");  // Reset to plain text for local development
        userRepository.save(worker);
        System.out.println("Worker user updated/created with plain text password");
        
        System.out.println("All users now have plain text password 'password' for local development!");
    }
}
