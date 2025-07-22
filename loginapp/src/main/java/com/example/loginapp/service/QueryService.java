package com.example.loginapp.service;

import com.example.loginapp.model.Query;
import com.example.loginapp.model.QueryStatusHistory;
import com.example.loginapp.model.User;
import com.example.loginapp.repository.QueryRepository;
import com.example.loginapp.repository.QueryStatusHistoryRepository;
import com.example.loginapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QueryService {

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private QueryStatusHistoryRepository queryStatusHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    public List<Query> getAllQueries() {
        return queryRepository.findAll();
    }

    public Optional<Query> getQueryById(Long id) {
        return queryRepository.findById(id);
    }

    public List<Query> getQueriesByUser(User user) {
        return queryRepository.findByRaisedByUser(user);
    }

    public List<Query> getQueriesByWorker(User worker) {
        return queryRepository.findByAssignedToWorker(worker);
    }

    public List<Query> getQueriesByStatus(Query.Status status) {
        return queryRepository.findByStatus(status);
    }

    public List<Query> getQueriesByVenue(Long venueId) {
        return queryRepository.findByVenueId(venueId);
    }

    public List<Query> searchQueries(Query.Status status, Query.Category category, 
                                   Long venueId, String keyword) {
        return queryRepository.findWithFilters(status, category, venueId, keyword);
    }

    public Query saveQuery(Query query) {
        return queryRepository.save(query);
    }

    public Query createQuery(Query query, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imagePath = saveImage(imageFile);
                query.setImagePath(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }
        return queryRepository.save(query);
    }

    public Query assignQueryToWorker(Long queryId, Long workerId) {
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        Optional<User> workerOpt = userRepository.findById(workerId);

        if (queryOpt.isPresent() && workerOpt.isPresent()) {
            Query query = queryOpt.get();
            User worker = workerOpt.get();
            
            if (worker.getRole() == User.Role.WORKER) {
                query.setAssignedToWorker(worker);
                query.setStatus(Query.Status.ASSIGNED);
                return queryRepository.save(query);
            } else {
                throw new RuntimeException("User is not a worker");
            }
        } else {
            throw new RuntimeException("Query or Worker not found");
        }
    }

    public Query updateQueryStatus(Long queryId, Query.Status status) {
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        if (queryOpt.isPresent()) {
            Query query = queryOpt.get();
            query.setStatus(status);
            if (status == Query.Status.RESOLVED) {
                query.setResolvedAt(LocalDateTime.now());
            }
            return queryRepository.save(query);
        } else {
            throw new RuntimeException("Query not found");
        }
    }

    public void deleteQuery(Long id) {
        queryRepository.deleteById(id);
    }

    public Long getQueryCountByStatus(Query.Status status) {
        return queryRepository.countByStatus(status);
    }

    public Long getQueryCountByUser(User user) {
        return queryRepository.countByUser(user);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        return "/" + uploadDir + uniqueFilename;
    }

    public Query assignWorker(Long queryId, Long workerId) {
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        Optional<User> workerOpt = userRepository.findById(workerId);
        
        if (queryOpt.isPresent() && workerOpt.isPresent()) {
            Query query = queryOpt.get();
            User worker = workerOpt.get();
            
            // Verify the user is actually a worker
            if (worker.getRole() == User.Role.WORKER) {
                query.setAssignedToWorker(worker);
                query.setStatus(Query.Status.ASSIGNED);
                query.setUpdatedAt(LocalDateTime.now());
                return queryRepository.save(query);
            }
        }
        return null;
    }

    public List<Query> getQueriesByWorker(Long workerId) {
        User worker = userRepository.findById(workerId).orElse(null);
        if (worker != null) {
            return queryRepository.findByAssignedToWorkerOrderByCreatedAtDesc(worker);
        }
        return new ArrayList<>();
    }

    public Query completeQuery(Long queryId, String completionNotes, MultipartFile completionImage) {
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        if (queryOpt.isPresent()) {
            Query query = queryOpt.get();
            query.setStatus(Query.Status.RESOLVED);
            query.setResolvedAt(LocalDateTime.now());
            
            if (completionNotes != null && !completionNotes.trim().isEmpty()) {
                query.setCompletionNotes(completionNotes);
            }
            
            if (completionImage != null && !completionImage.isEmpty()) {
                try {
                    String completionImagePath = saveCompletionImage(completionImage);
                    query.setCompletionImagePath(completionImagePath);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save completion image", e);
                }
            }
            
            return queryRepository.save(query);
        } else {
            throw new RuntimeException("Query not found");
        }
    }

    private String saveCompletionImage(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir + "completions/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        return "/" + uploadDir + "completions/" + uniqueFilename;
    }

    public Query updateQueryStatusWithHistory(Long queryId, Query.Status newStatus, Long userId, String comment) {
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (queryOpt.isPresent() && userOpt.isPresent()) {
            Query query = queryOpt.get();
            User user = userOpt.get();
            Query.Status oldStatus = query.getStatus();
            
            // Update query status
            query.setStatus(newStatus);
            if (newStatus == Query.Status.RESOLVED) {
                query.setResolvedAt(LocalDateTime.now());
            }
            Query savedQuery = queryRepository.save(query);
            
            // Create status history entry
            QueryStatusHistory statusHistory = QueryStatusHistory.builder()
                    .query(query)
                    .oldStatus(oldStatus)
                    .newStatus(newStatus)
                    .updatedByUser(user)
                    .comment(comment)
                    .build();
            queryStatusHistoryRepository.save(statusHistory);
            
            return savedQuery;
        } else {
            throw new RuntimeException("Query or User not found");
        }
    }

    public Query completeQueryWithHistory(Long queryId, Long userId, String completionNotes, MultipartFile completionImage) {
        System.out.println("=== COMPLETION DEBUG ===");
        System.out.println("Query ID: " + queryId);
        System.out.println("User ID: " + userId);
        System.out.println("Completion Notes: " + completionNotes);
        System.out.println("Has Image: " + (completionImage != null && !completionImage.isEmpty()));
        
        Optional<Query> queryOpt = queryRepository.findById(queryId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (queryOpt.isPresent() && userOpt.isPresent()) {
            Query query = queryOpt.get();
            User user = userOpt.get();
            Query.Status oldStatus = query.getStatus();
            
            System.out.println("Found Query: " + query.getTitle());
            System.out.println("Found User: " + user.getName());
            System.out.println("Old Status: " + oldStatus);
            
            // Update query to resolved with completion details
            query.setStatus(Query.Status.RESOLVED);
            query.setResolvedAt(LocalDateTime.now());
            query.setCompletedByUser(user);
            
            // Set completion notes in the main query table
            if (completionNotes != null && !completionNotes.trim().isEmpty()) {
                query.setCompletionNotes(completionNotes);
                System.out.println("Set completion notes: " + completionNotes);
            }
            
            // Save completion image if provided
            String completionImagePath = null;
            if (completionImage != null && !completionImage.isEmpty()) {
                try {
                    completionImagePath = saveCompletionImage(completionImage);
                    query.setCompletionImagePath(completionImagePath);
                    System.out.println("Saved completion image: " + completionImagePath);
                } catch (IOException e) {
                    System.err.println("Failed to save completion image: " + e.getMessage());
                    throw new RuntimeException("Failed to save completion image", e);
                }
            }
            
            // Save the updated query first
            Query savedQuery = queryRepository.save(query);
            System.out.println("Saved query with completion data");
            
            // Create status history entry with completion details
            QueryStatusHistory statusHistory = QueryStatusHistory.builder()
                    .query(query)
                    .oldStatus(oldStatus)
                    .newStatus(Query.Status.RESOLVED)
                    .updatedByUser(user)
                    .comment(completionNotes)
                    .completionImagePath(completionImagePath)
                    .build();
            queryStatusHistoryRepository.save(statusHistory);
            System.out.println("Saved status history entry");
            
            System.out.println("=== COMPLETION COMPLETE ===");
            return savedQuery;
        } else {
            System.err.println("Query or User not found - Query exists: " + queryOpt.isPresent() + ", User exists: " + userOpt.isPresent());
            throw new RuntimeException("Query or User not found");
        }
    }

    public List<QueryStatusHistory> getQueryStatusHistory(Long queryId) {
        return queryStatusHistoryRepository.findByQueryIdOrderByCreatedAtDesc(queryId);
    }
}
