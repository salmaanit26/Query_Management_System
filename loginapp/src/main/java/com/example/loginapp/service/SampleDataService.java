package com.example.loginapp.service;

import com.example.loginapp.model.User;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class SampleDataService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void initializeSampleData() {
        // Only create sample data if no workers exist
        long workerCount = userRepository.countByRole(User.Role.WORKER);
        if (workerCount == 0) {
            createSampleWorkers();
        }
    }

    private void createSampleWorkers() {
        try {
            // Create sample workers for each type
            createWorker("John Electrician", "john.electrician@company.com", User.WorkerType.ELECTRICIAN);
            createWorker("Mike Plumber", "mike.plumber@company.com", User.WorkerType.PLUMBER);
            createWorker("David Carpenter", "david.carpenter@company.com", User.WorkerType.CARPENTER);
            createWorker("Alex Network", "alex.network@company.com", User.WorkerType.NETWORK);
            createWorker("Sarah General", "sarah.general@company.com", User.WorkerType.GENERAL);
            
            // Create additional workers for better coverage
            createWorker("Robert Electrician", "robert.electrician@company.com", User.WorkerType.ELECTRICIAN);
            createWorker("James Plumber", "james.plumber@company.com", User.WorkerType.PLUMBER);
            createWorker("William Carpenter", "william.carpenter@company.com", User.WorkerType.CARPENTER);
            
            System.out.println("Sample workers initialized successfully!");
        } catch (Exception e) {
            System.err.println("Error creating sample workers: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createWorker(String name, String email, User.WorkerType workerType) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return;
            }

            User worker = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("worker123")) // Default password
                    .role(User.Role.WORKER)
                    .workerType(workerType)
                    .build();

            userRepository.save(worker);
            System.out.println("Created worker: " + name + " (" + workerType + ")");
        } catch (Exception e) {
            System.err.println("Error creating worker " + name + ": " + e.getMessage());
        }
    }
}
